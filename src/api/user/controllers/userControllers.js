const { check, param } = require("express-validator");
const userRepository = require("../repository/userRepository");
const responses = require("../../common/responses/responses");
const { BadRequestError } = require("../../shared/errors/requestError");
const {
  getErrosFromRequestValidation,
} = require("../../shared/errors/errorBuilder");

const UserModel = require("./userModel");

async function configureCheckForName(req) {
  await check("name")
    .isString()
    .withMessage("Parâmetro name mal formatado")
    .notEmpty()
    .withMessage("Parâmetro name não preenchido")
    .isLength({ max: 100 })
    .withMessage("Parâmetro name ultrapassou o limite de 100 caracteres")
    .run(req);
}

async function configureCheckForEmail(req) {
  await check("email")
    .isEmail()
    .withMessage("Parâmetro email mal formatado")
    .notEmpty()
    .withMessage("Parâmetro email não preenchido")
    .isLength({ max: 100 })
    .withMessage("Parâmetro email ultrapassou o limite de 100 caracteres")
    .run(req);
}

async function configureCheckForPosition(req) {
  await check("position")
    .isString()
    .withMessage("Parâmetro position mal formatado")
    .notEmpty()
    .withMessage("Parâmetro position não preenchido")
    .run(req);
}

exports.get_all_users = async (req, res) => {
  try {
    const users = await userRepository.getAllUsers();
    return responses.response(res, {
      status: 200,
      message: "Sucesso ao pegar os Usuários!",
      value: users
        ? users.map(
            (user) =>
              new UserModel(
                user.id,
                user.name,
                user.email,
                user.password,
                user.crm,
                user.especialidade,
                user.crf,
                user.cep,
                user.cpf,
                user.endereco,
                user.dataNascimento,
                user.telefone,
                user.celular,
                user.position,
                user.active
              )
          )
        : users,
    });
  } catch (err) {
    return responses.response(res, {
      status: 500,
      message: "Falha ao pegar os Usuários!",
    });
  }
};

exports.get_user = async (req, res) => {
  try {
    const userSearch = await userRepository.getUser(req.params.id);
    if (userSearch) {
      return responses.response(res, {
        status: 200,
        message: "Sucesso ao trazer Usuário!",
        value: userSearch
          ? userSearch.map(
              (user) =>
                new UserModel(
                  user.id,
                  user.name,
                  user.email,
                  user.password,
                  user.crm,
                  user.especialidade,
                  user.crf,
                  user.cep,
                  user.cpf,
                  user.endereco,
                  user.dataNascimento,
                  user.telefone,
                  user.celular,
                  user.position,
                  user.active
                )
            )
          : null,
      });
    } else {
      return responses.response(res, {
        status: 500,
        message: "Falha ao trazer Usuário!",
      });
    }
  } catch (err) {
    return responses.response(res, {
      status: 500,
      message: "Falha ao trazer Usuário!",
    });
  }
};

exports.create_user = async (req, res, next) => {
  try {
    await configureCheckForName(req);
    await configureCheckForEmail(req);
    await configureCheckForPosition(req);

    const validationError = await getErrosFromRequestValidation(req);

    if (validationError) {
      return next(validationError);
    }

    const userEmail = await userRepository.getUserByEmail(req.body.email);

    if (userEmail)
      return next(new BadRequestError("Já existe um usuário com este email!"));

    const userCRM = await userRepository.getUserByCRM(req.body.crm);

    if (userCRM)
      return next(new BadRequestError("Já existe um usuário com este CRM Cadastrado!"));

    const newUser = await userRepository.createUser(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.position,
      req.body.crm,
      req.body.especialidade,
      req.body.crf,
      req.body.cep,
      req.body.endereco,
      req.body.cpf,
      req.body.dataNascimento,
      req.body.telefone,
      req.body.celular,
      req.body.active,
    );
    if (newUser) {
      return responses.response(res, {
        status: 201,
        message: "Sucesso ao criar Usuário!",
      });
    }
    return next(new Error("Falha ao criar o Usuário!"));
  } catch (err) {
    return next(new Error("Falha ao criar o Usuário!"));
  }
};

exports.update_user = async (req, res, next) => {
  try {
    if(req.body.crf || req.body.crm || req.body.cpf || req.body.position){
      return next(
        new BadRequestError(
          "Esse atributo não pode ser alterado"
        )
      );
    }
    if (!req.body.name && !req.body.email && !req.body.password && !req.body.especialidade && !req.body.cep && !req.body.endereco && !req.body.dataNascimento && !req.body.telefone && !req.body.celular) {
      return next(
        new BadRequestError(
          "Preencher o parâmetro name ou email ou password ou especialidade ou cep ou endereco ou dataNascimento ou telefone ou celular para executar a operação."
        )
      );
    }

    if (req.body.name) {
      await configureCheckForName(req);
    }

    if (req.body.email) {
      await configureCheckForEmail(req);
    }

    const validationError = await getErrosFromRequestValidation(req);
    if (validationError) {
      return next(validationError);
    }

    const user = await userRepository.getUser(req.params.id);

    if (user.length === 0)
      return responses.response(res, {
        status: 401,
        message: "Usuário não encontrado",
      });

    const updateUser = await userRepository.updateUser(
      req.params.id,
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.especialidade,
      req.body.cep,
      req.body.endereco,
      req.body.dataNascimento,
      req.body.telefone,
      req.body.celular,
    );
    if (updateUser) {
      return responses.response(res, {
        status: 200,
        message: "Usuário editado com sucesso!",
      });
    }

    return next(new Error("Falha ao editar o Usuário"));
  } catch (err) {
    console.log(err)
    return next(new Error("Falha ao editar o Usuário"));
  }
};

exports.delete_user = async (req, res, next) => {
  try {
    const deleteUser = await userRepository.deleteUser(req.params.id);
    if (deleteUser) {
      return responses.response(res, {
        status: 200,
        message: "Usuário deletado com sucesso!",
      });
    }
    return next(new Error("Falha ao deletar o Usuário"));
  } catch (err) {
    return next(new Error("Falha ao deletar o Usuário"));
  }
};
