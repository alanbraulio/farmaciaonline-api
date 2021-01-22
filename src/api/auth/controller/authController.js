const jwt = require('jsonwebtoken');
var payloadCheck = require('payload-validator');
const authHelpers = require('../helpers.js');
const userRepository = require('../../user/repository/userRepository');


exports.login = async (req, res, next) => {
    let payloadExpected = {
        "email" : req.body.email,
        "password" : req.body.password
    };
    let payloadResult = payloadCheck.validator(req.body,payloadExpected, ['email', 'password'], false);
    if (payloadResult.success) {
        const user = await authHelpers.getUserByEmail(req.body.email);
        if (user.length === 0) authHelpers.sendResponse(res, 401, 'E-mail inválido - Usuário não encontrado'); 
        else if (user && user[0] && !user[0].password) authHelpers.sendResponse(res, 404, 'Clique em "Problemas para acessar?" e cadastre uma senha');
        else if (user && user[0] && user[0].password && user[0].email === req.body.email && user[0].password === req.body.password) {
                const { id } = await userRepository.login_user(req.body.email, req.body.password);
                const token = jwt.sign({id}, process.env.JWT_KEY, {
                    expiresIn: 1800 });
                authHelpers.sendResponse(res, 200, 'Login efetuado com sucesso.', '', token);
        }else{
            authHelpers.sendResponse(res, 401, 'E-mail ou senha invalidos.');
        }
    } else {
        authHelpers.sendResponse(res, 401, payloadResult.response.errorMessage);
    }
}

exports.verifyToken = (req, res, next) => {
    if(process.env.CYPRESS) {
        const decoded = jwt.verify(process.env.ACESS_TOKEN, process.env.JWT_KEY);

        if(decoded) {
            res.status(200).json({
                message: 'Token válido',
                decoded: decoded
            })
        } else{
            res.status(401).json({
                message: 'Empty token'
            })
        }
    } else {
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
}
