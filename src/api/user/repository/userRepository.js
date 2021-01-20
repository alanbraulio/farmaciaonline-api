const { getConnection } = require('../../shared/dbConnection');
const sql = require('mssql');

const SQL_SELECT_QUERY = `SELECT id, name, email, password, cargo, active FROM Users`;
const SQL_INSERT_QUERY = `INSERT INTO Users (name, email, password, cargo, active) VALUES (@name, @email, @password, @cargo, @active)`;
const SQL_DELETE_QUERY = `DELETE FROM Users WHERE id=@id`;
// const SQL_SELECT_LOGIN = `SELECT id, name, email, password, cargo, active FROM Users WHERE email = @email AND password = @password`;

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

exports.create_user = async (name, email, password, cargo) => {
    try{
        const dbClient = await getConnection();
        const request = dbClient.request();

        request.input('name', sql.VarChar, name);
        request.input('email', sql.VarChar, email);
        request.input('password', sql.VarChar, password);
        request.input('cargo', sql.VarChar, cargo);
        request.input('active', sql.VarChar, 1);

        const result = await request.query(SQL_INSERT_QUERY);
        return result.rowsAffected;

    } catch(error) {
        return null;
    }
}

exports.update_user = async(id, name, email, password, cargo, active) => {
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
        if(cargo){
            setStatementCollumns.push('cargo=@cargo');
           request.input('cargo', sql.VarChar, cargo);
        }
        if(active){
            setStatementCollumns.push('active=@active');
           request.input('active', sql.Bit, active);
        }
        const sql_query= `UPDATE Users SET ${setStatementCollumns.join(',')} WHERE id=@id`;
        
        const result = await request.query(sql_query);
        return result.rowsAffected;

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
        return result.rowsAffected;

    } catch(error) {
        return null;
    }              
}

// exports.login_user = async(email, password) =>{
//     try{
//         const dbClient = await getConnection();
//         const request = dbClient.request();

//         request.input('email', sql.VarChar, email);
//         request.input('password', sql.VarChar, password);

//         const result = await request.query(SQL_SELECT_LOGIN);
//         return result.recordsets[0];

//     } catch(error) {
//         return null;
//     }
// }