const userRepository = require('../user/repository/userRepository');
const jwt = require('jsonwebtoken');


exports.completeUserNativeLogIn = (user, res) => {
    const token = jwt.sign({
        email: user.email,
        id: user.id
    }, process.env.JWT_KEY,  {
        expiresIn: 1800 });
    this.sendResponse(res, 200, 'Login efetuado com sucesso.', '', token, user);
}

exports.getUserByEmail = async (userEmail) => {
    const user = await userRepository.get_user_by_email(userEmail);
    return user;
}

// exports.validateTokenScope = (req) => {
//     return 'scp' in req.authInfo && req.authInfo['scp'].split(" ").indexOf("demo.read") >= 0
// }

exports.sendResponse = (res, statusCode, message, error, token, user) => {
    error = error ? error : '';
    token = token ? token : '';
    user = user ? user : '';
    return (
        res.status(statusCode).json({
            message: message,
            error: error,
            token: token, 
            user: user
        })
    )
}