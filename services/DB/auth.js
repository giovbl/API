const conn = require('./config')
const bcrypt = require('bcrypt')

/**
 * Authenticates a user using email and password
 * @param {string} email email for the authentication
 * @param {string} pwd user's password
 * @return {Object} User's useful data for permissions and post login
 */
async function login(email,pwd) {

    try{
        const rows = await conn.query("SELECT id,pwd,userType,workgroup FROM User WHERE email= ?",[email])

        //If login is successfull
        if(rows.length > 0 && await bcrypt.compare(pwd,rows[0].pwd)){

            const reqConf = (rows[0].userType != 'Corriere') && 
                            (rows[0].workgroup == null);

            return {id:rows[0].id,type:
                    rows[0].userType,
                    requiresConfig:reqConf};
        }

        return null;
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Creates a new session for the user
 * @param {string} refresh Refresh token
 * @param {number} userId User's ID
 * @returns {number} Id of the created session
 */
async function initSession(userId) {

    try{
        const res = await conn.query("INSERT INTO Session (user) VALUES (?) RETURNING id",[userId])
        
        if(!res)
            return null

        return res[0].id;
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Sets a token for the session
 * @param {number} id Session ID
 * @param {string} token Token to memorize in the DB
 * @returns {boolean} If the operation is successfull
 */
async function setSessionToken(id,token) {

    const hashToken = await bcrypt.hash(token,12)

    try{
        await conn.query("UPDATE Session SET token=? WHERE id=?",[hashToken,id])

        return true
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Verifies if a user's session is valid
 * @param {string} refresh Refresh token of the session
 * @param {number} sessionId Session ID
 * @returns {boolean} If the session is valid
 */
async function sessionValid(refresh,sessionId) {

    try{
        const user = await conn.query("SELECT token,valid FROM Session WHERE id=?",[sessionId])

        if(!user)
            return false

        const vt = await bcrypt.compare(refresh,user[0].token)

        return user[0].valid && vt
    }
    catch(error){
        console.log(error)
        return false;
    }
}

/**
 * 
 * @param {number} id Session ID 
 * @param {boolean} validity New validity of the session
 * @returns {boolean} If the operation is successfull
 */
async function setSessionValidity(id,validity){
    try{
        await conn.query("UPDATE Session SET valid=? WHERE id=?",[validity,id])

        return true
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    login,
    initSession,
    setSessionToken,
    sessionValid,
    setSessionValidity
}