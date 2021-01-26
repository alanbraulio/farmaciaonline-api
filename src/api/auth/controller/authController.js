const jwt = require('jsonwebtoken');
var payloadCheck = require('payload-validator');
const authHelpers = require('../helpers.js');


exports.login = async (req, res, next) => {
    let payloadExpected = {
        "email" : req.body.email,
        "password" : req.body.password
    };
    let payloadResult = payloadCheck.validator(req.body,payloadExpected, ['email', 'password'], false);
    if (payloadResult.success) {
        const user = await authHelpers.getUserByEmail(req.body.email);
        if (!user) authHelpers.sendResponse(res, 401, 'E-mail inválido - Usuário não encontrado'); 
        else if (user && user.password && user.email === req.body.email && user.password === req.body.password) {
                authHelpers.completeUserNativeLogIn(user, res)
        }else{
            authHelpers.sendResponse(res, 401, 'Senha inválida.');
        }
    } else {
        authHelpers.sendResponse(res, 401, payloadResult.response.errorMessage);
    }
}

exports.verifyToken = (req, res, next) => {
        try{
            if(req.headers.authorization){
                const token = req.headers.authorization.split(" ")[1];
                const decoded = jwt.verify(token, process.env.JWT_KEY);
    
                    if(decoded) {
                        res.status(200).json({
                            message: 'Token válido',
                            decoded: decoded
                    })
                }
            }
            else{
                res.status(401).json({
                    message: 'Empty token'
                })
            }
        } 
        catch(error){
            return res.status(401).json({
                message: 'Erro interno de servidor',
                error: error
            });
        }
    }
