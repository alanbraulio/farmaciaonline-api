const { getConnection } = require("../../shared/dbConnection");
const globalReturn = require("../../shared/returnPrepare");
const sql = require("mssql");

const SQL_SELECT_QUERY = `SELECT Users.id, Users.name, Users.email, Users.crm, Users.especialidade, Users.crf, Users.cpf, Users.cep, Users.endereco, Users.dataNascimento, Users.telefone, Users.celular, UsersType.name as position, Users.active
FROM Users 
INNER JOIN UsersType ON Users.position_id = UsersType.id`;
const SQL_INSERT_QUERY = `INSERT INTO Users (name, email, password, position_id, crm, especialidade, crf, cep, endereco, cpf, dataNascimento, telefone, celular, active) VALUES (@name, @email, @password, (SELECT id FROM UsersType WHERE name=@position), @crm, @especialidade, @crf, @cep, @endereco, @cpf, @dataNascimento, @telefone, @celular, @active)`;
const SQL_DELETE_QUERY = `DELETE FROM Users WHERE id=@id`;
const SQL_SELECT_LOGIN = `SELECT id FROM Users WHERE email = @email AND password = @password`;
const SQL_SELECT_USER = `${SQL_SELECT_QUERY} and Users.id=@id`;

exports.getAllUsers = async () => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    const result = await request.query(SQL_SELECT_QUERY);
    return result.recordsets[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.getUser = async (id) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(SQL_SELECT_USER);
    return result.recordsets[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.getUserByEmail = async (userEmail) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    const result = await request.query(
      `SELECT * FROM Users WHERE email = '${userEmail}'`
    );
    return result.recordset[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.getUserByCRM = async (crm) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    const result = await request.query(
      `SELECT * FROM Users WHERE crm = '${crm}'`
    );
    return result.recordset[0];
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.createUser = async (
  name,
  email,
  password,
  position,
  crm,
  especialidade,
  crf,
  cep,
  endereco,
  cpf,
  dataNascimento,
  telefone,
  celular,
  active = 0
) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    request.input("name", sql.VarChar, name);
    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);
    request.input("position", sql.VarChar, position);
    request.input("crm", sql.VarChar, crm);
    request.input("especialidade", sql.VarChar, especialidade);
    request.input("crf", sql.VarChar, crf);
    request.input("cep", sql.VarChar, cep);
    request.input("endereco", sql.VarChar, endereco);
    request.input("cpf", sql.VarChar, cpf);
    request.input("dataNascimento", sql.Date, dataNascimento);
    request.input("telefone", sql.VarChar, telefone);
    request.input("celular", sql.VarChar, celular);
    request.input("active", sql.VarChar, active);

    const result = await request.query(SQL_INSERT_QUERY);
    return globalReturn.returnPrepare(result.rowsAffected);
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.updateUser = async (
  id,
  name,
  email,
  password,
  especialidade,
  cep,
  endereco,
  dataNascimento,
  telefone,
  celular
) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();
    request.input("id", sql.UniqueIdentifier, id);

    let setStatementCollumns = [];

    if (name) {
      setStatementCollumns.push("name=@name");
      request.input("name", sql.VarChar, name);
    }
    if (email) {
      setStatementCollumns.push("email=@email");
      request.input("email", sql.VarChar, email);
    }
    if (password) {
      setStatementCollumns.push("password=@password");
      request.input("password", sql.VarChar, password);
    }
    if (especialidade) {
      setStatementCollumns.push("especialidade=@especialidade");
      request.input("especialidade", sql.VarChar, especialidade);
    }
    if (cep) {
        setStatementCollumns.push("cep=@cep");
        request.input("cep", sql.VarChar, cep);
    }
    if (endereco) {
        setStatementCollumns.push("endereco=@endereco");
        request.input("endereco", sql.VarChar, endereco);
    }
    if (dataNascimento) {
        setStatementCollumns.push("dataNascimento=@dataNascimento");
        request.input("dataNascimento", sql.Date, dataNascimento);
    }
    if (telefone) {
        setStatementCollumns.push("telefone=@telefone");
        request.input("telefone", sql.VarChar, telefone);
    }
    if (celular) {
        setStatementCollumns.push("celular=@celular");
        request.input("celular", sql.VarChar, celular);
    }
    const sql_query = `UPDATE Users SET ${setStatementCollumns.join(
      ","
    )} WHERE id=@id`;

    const result = await request.query(sql_query);
    return globalReturn.returnPrepare(result.rowsAffected);
  } catch (error) {
    return null;
  }
};

exports.deleteUser = async (id) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(SQL_DELETE_QUERY);
    return globalReturn.returnPrepare(result.rowsAffected);
  } catch (error) {
    console.log(error);
    return null;
  }
};

exports.login_user = async (email, password) => {
  try {
    const dbClient = await getConnection();
    const request = dbClient.request();

    request.input("email", sql.VarChar, email);
    request.input("password", sql.VarChar, password);

    const result = await request.query(SQL_SELECT_LOGIN);
    return result.recordsets[0];
  } catch (error) {
    return null;
  }
};
