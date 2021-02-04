const { getConnection } = require('../../shared/dbConnection');
const globalReturn = require('../../shared/returnPrepare');
const sql = require('mssql');

const SQL_SELECT_QUERY = `SELECT Users.id, Users.name, Users.email, UsersType.name as position
FROM Users 
INNER JOIN UsersType ON Users.position_id = UsersType.id`;
const SQL_INSERT_QUERY = `INSERT INTO Users (name, email, password, position_id, active) VALUES (@name, @email, @password, (SELECT id FROM UsersType WHERE name=@position), @active)`;
const SQL_DELETE_QUERY = `DELETE FROM Users WHERE id=@id`;
const SQL_SELECT_LOGIN = `SELECT id FROM Users WHERE email = @email AND password = @password`;
const SQL_SELECT_USER = `${SQL_SELECT_QUERY} and Users.id=@id`;

exports.get_all_users = async () => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        const result = await request.query(SQL_SELECT_QUERY);
        return result.recordsets[0];

    } catch(error) {
        console.log(error);
        return null;
    }
}


exports.get_user = async (id) => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        request.input('id', sql.UniqueIdentifier, id);

        const result = await request.query(SQL_SELECT_USER);
        return result.recordsets[0];

    } catch(error) {
        console.log(error);
        return null;
    }
}

exports.get_user_by_email = async (userEmail) => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        const result = await request.query(`SELECT * FROM Users WHERE email = '${userEmail}'`);
        return result.recordset[0];

    } catch(error) {
        console.log(error);
        return null;
    }
}

exports.create_user = async (name, email, password, position) => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        request.input('name', sql.VarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);
        request.input('position', sql.VarChar, position);
        request.input('active', sql.VarChar, 1);

        const result = await request.query(SQL_INSERT_QUERY);
        return globalReturn.returnPrepare(result.rowsAffected);

    } catch(error) {
        console.log(error)
        return null;
    }
}

exports.update_user = async(id, name, email, password, position, active) => {
    try{

        const dbClient = await getConnection();
        const request = dbClient.request();
        request.input('id', sql.UniqueIdentifier, id);    

        let setStatementCollumns=[];

        if(name){
            setStatementCollumns.push('name=@name');
            request.input('name', sql.VarChar, name);
        }
        if(email){
            setStatementCollumns.push('email=@email');
           request.input('email', sql.VarChar, email);
        }
        if(password){
            setStatementCollumns.push('password=@password');
           request.input('password', sql.VarChar, password);
        }
        if(position){
            setStatementCollumns.push('position=@position');
           request.input('position', sql.VarChar, position);
        }
        if(active){
            setStatementCollumns.push('active=@active');
           request.input('active', sql.Bit, active);
        }
        const sql_query= `UPDATE Users SET ${setStatementCollumns.join(',')} WHERE id=@id`;
        
        const result = await request.query(sql_query);
        return globalReturn.returnPrepare(result.rowsAffected);

    } catch(error) {
        return null;
    }                    
}

exports.delete_user = async(id) => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        request.input('id', sql.UniqueIdentifier, id);

        const result = await request.query(SQL_DELETE_QUERY);
        return globalReturn.returnPrepare(result.rowsAffected);

    } catch(error) {
        console.log(error)
        return null;
    }              
}

exports.login_user = async(email, password) =>{
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);

        const result = await request.query(SQL_SELECT_LOGIN);
        return result.recordsets[0];

    } catch(error) {
        return null;
    }
}