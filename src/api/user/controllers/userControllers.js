const payloadCheck = require('payload-validator');
var jwt = require('jsonwebtoken');

const userRepository = require('../repository/userRepository');
const responses = require('../../common/responses/responses');

const UserModel = require("./userModel");

exports.get_all_users = async (req, res) => {
    try{
        const users = await userRepository.get_all_users();
        return responses.response(
            res, 
            {status: 200, message:'Sucesso ao pegar os Usuários!', 
            value: users ? users.map((user) => new UserModel(user.id,user.name,user.email,user.password, user.cargo, user.active)) : users});
    }  
    catch(err){
        return responses.response(res, {status: 500, message:'Falha ao pegar os Usuários!'})
    }
}

exports.create_user = async (req, res) => {

    let payloadExpected = {
        "name": "",
        "email": "",
        "password": "",
        "cargo":"",
    };

    let checkedPayload = payloadCheck.validator(req.body,payloadExpected, ['name', 'email', "password", "cargo"], false);
    if(!checkedPayload.success){
        return responses.response(res, {status: 400, message:'Por favor, preencha todos os campos!'})
    }

    try{
        const newUser = await userRepository.create_user(req.body.name, req.body.email, req.body.password, req.body.cargo);
        if(newUser){
            return responses.response(res, {status: 201, message:"Sucesso ao criar Usuário!"})
        } else{
            throw null;
        }
    }catch(err){
        console.log(err, 'erro')
        return responses.response(res, {status: 500, message:"Falha ao criar o Usuário!"})
    }
}

exports.update_user = async (req, res) => {
    try{
        if (req.body.name || req.body.email || req.body.password || req.body.cargo || req.body.active) {
            updateFaq = await userRepository.update_user(req.params.id, req.body.name,  req.body.email, req.body.password, req.body.cargo, req.body.active);

            if(updateFaq){
                return responses.response(res, {status: 200, message:'Usuário editado com sucesso!'});
            } else {
                throw null
            }
        } else {
            return responses.response(res, {status: 400, message:'Por favor, preencha ao menos um campo para ser alterado'})
        }
    }catch(err){
        return responses.response(res, {status: 500, message:'Falha ao editar o Usuário!'})
    }
}

exports.delete_user = async (req, res) => {
    try{
        const deleteUser = await userRepository.delete_user(req.params.id)
        if(deleteUser){
            return responses.response(res, {status: 200, message:"Usuário deletado com sucesso!"})
        } else{
            throw null
        }
    }catch(err){
        return responses.response(res, {status: 500, message:"Falha ao deletar o Usuário!"})
    }
}

// exports.user_Login = async (req, res) =>{
//     try{
//         const { id } = await userRepository.login_user(req.body.email, req.body.password);
//         if(req.body.email && req.body.password){
//                 var token = jwt.sign({id}, process.env.SECRET, {
//                 expiresIn: 300 // expires in 5min
//         });
//         res.status(200).send({ auth: true, token: token });
//         }
//     }  
//     catch(err){
//         return responses.response(res, {status: 500, message:'Falha ao fazer Login!'})
//     }
// }