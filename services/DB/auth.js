const mariadb = require('mariadb');
const bcrypt = require('bcrypt')

/**
 * Authenticates a user using email and password
 * @param {mariadb.Connection} conn DB connection
 * @param {string} email email for the authentication
 * @param {string} pwd user's password
 * @return {Object} User info
 */
async function login(conn,email,pwd) {

    try{
        const rows = await conn.query("SELECT id,pwd,userType FROM User WHERE email= '"+email+"\'")

        console.log(rows)

        if(rows.length > 0 && await bcrypt.compare(pwd,rows[0].pwd))
            return {id:rows[0].id,type:rows[0].userType};

        return null;
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Creates a new session for the user
 * @param {mariadb.Connection} conn DB connection
 * @param {string} refresh Refresh token
 * @param {number} id User's id
 * @returns {boolean} If the operation is successfull
 */
async function addSession(conn,refresh,id) {

    try{
        await conn.query("INSERT INTO Session (token,user) VALUES (?,?)",[refresh,id])
        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Verifies if a user's session exists
 * @param {mariadb.Connection} conn DB connection
 * @param {string} refresh Refresh token of the session
 * @returns {boolean} If the session exists
 */
async function sessionExists(conn,refresh) {

    try{
        const user = await conn.query("SELECT user FROM Session WHERE token=?",[refresh])

        return (user ? true : false);
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    login,
    addSession,
    sessionExists
}