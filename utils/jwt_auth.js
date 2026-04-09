var jwt = require('jsonwebtoken');

//Middle-ware function for JWT token authentication
function auth(req,res,next){

    //Cookie containing the authentication token
    const authCookie = req.cookies['authToken'];

    if(authCookie == null) 
        return res.sendStatus(401);

    //Token verification
    jwt.verify(authCookie, process.env.JWT_AUTH_SECRET, (err, data) => {
        
        if(err)
            return res.sendStatus(401);

        req.user = data;
        next();
    })

}

/*
    Function for athenticating a user.
*/
async function authFun(req){

    //Cookie containing the authentication token
    const authCookie = req.cookies['authToken'];

    if(authCookie == null) 
        return {user: null, failed: true}

    try{
        const usr = await jwt.verify(authCookie, process.env.JWT_AUTH_SECRET)

        return {user: usr, failed: false}
    } catch{
        return {user: null, failed:true}
    }

}

/**
 * Creates a session for a user
 * @param {Obbject} db Database object
 * @param {mariadb.Connection} dbs DB connection
 * @param {number} userId User's id
 * @returns {string} The generated token for the new session
 */
async function createSession(db,userId){

    //Creating a new session on the DB
    const sid = await db.initSession(userId);

    //Generting the refresh token
    const refresh = jwt.sign({id: userId, sid:sid},
        process.env.JWT_REFRESH_SECRET,
        {expiresIn: "30d"}
    );

    await db.setSessionToken(sid,refresh)

    return {refreshToken: refresh, sessionId: sid}
}

/**
 * Creates and authentication token
 * @param {Object} user User's info
 * @returns {string} The generated token
 */
function createAuthToken(user) {
    return jwt.sign({id: user.id, userType: user.userType},
                    process.env.JWT_AUTH_SECRET,
                    {expiresIn: "15m"});
}

module.exports = {
    auth,
    authFun,
    createSession,
    createAuthToken
}