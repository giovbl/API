const conn = require('./config')
const bcrypt = require('bcrypt')

const addUserQuery = "INSERT INTO User("+
                    "fullname,email,pwd,userType)"+
                    "VALUES(?,?,?,?) RETURNING id"

const getUserQuery = "SELECT fullname,email,"+
                     "userType,workgroup "+
                     "FROM User WHERE id = ?"

/**
 * Obtains the workgroup ID of an user's workgroup
 * @param {number} id User ID
 * @returns The id of the user's workgroup
 */
async function getUserWorkgroupID(id) {

    try{
        const res = await conn.query("SELECT workgroup FROM User WHERE id = ?",[id])

        if(!res)
            return {}

        return res[0].workgroup;
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Adds a new user
 * @param {Object} user Data of the user to create
 * @returns {boolean} If the operation is successfull
 */
async function addUser(user) {

    try{
        const res = await conn.query(addUserQuery,[
            user.fullname,user.email,
            await bcrypt.hash(user.pwd,12),
            user.userType
        ])

        if(!res)
            return null

        return res[0];
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Adds an user to a workgroup
 * @param {number} id User ID
 * @param {number} workgroupId Workgroup ID
 * @returns {boolean} If the operation is successfull
 */
async function setUserWorkgroup(id,workgroupId) {

    try{
        await conn.query("UPDATE User SET workgroup = ? WHERE id = ?",
                        [workgroupId,id])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Verifies if an user exists
 * @param {string} email Email related to the user
 * @returns {boolean} If the user exists
 */
async function userExists(email) {

    try{
        const res = await conn.query("SELECT id FROM User WHERE email = ?",[email])

        return res.length > 0
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Gets data about the desired user
 * @param {string} id User ID
 * @returns {Object} The requested user's data
 */
async function getUser(id) {

    try{
        const res = await conn.query(getUserQuery,[id])

        if(!res)
            return null

        return res[0]
    }
    catch(error){
        console.log(error)
        return null;
    }

}

module.exports = {
    addUser,
    userExists,
    getUserWorkgroupID,
    setUserWorkgroup,
    getUser
}