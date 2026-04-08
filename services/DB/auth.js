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
 * @param {number} id User's id
 * @returns {boolean} If the operation is successfull
 */
async function addSession(refresh,id) {

    const hashToken = await bcrypt.hash(refresh,12)

    try{
        await conn.query("INSERT INTO Session (token,user) VALUES (?,?)",[hashToken,id])
        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Verifies if a user's session is valid
 * @param {string} refresh Refresh token of the session
 * @param {number} User ID
 * @returns {boolean} If the session is valid
 */
async function sessionValid(refresh,userId) {

    try{
        const user = await conn.query("SELECT token,valid FROM Session WHERE user=?",[userId])

        if(!user)
            return false
        
        const vt = await bcrypt.compare(refresh,user.token)

        return user[0].valid && vt
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    login,
    addSession,
    sessionValid
}