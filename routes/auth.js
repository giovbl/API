var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var db = require('../services/db');
var {auth,createSession, createAuthToken} = require('../utils/jwt_auth');

require('dotenv').config();

/*
    Route with the sole purpouse of verifying the authetication token
*/
router.get('/',auth,(req,res) => {
    res.status(200).send()
})

/*
    Route used for logging in a user
*/
router.post('/login',async (req,res) => {

    //Initializing a connection to the DB
    const dbs = await db.connect();

    //Credentials verification
    const dbres = await db.login(dbs,req.body.email,req.body.pwd);

    if(!dbres){
        db.disconnect(dbs);
        res.status(401).send();
    }

    //Storing the refresh token of the new session
    res.cookie('refreshToken',createSession(db,dbs,dbres.id),{httpOnly:true})

    //DB connection no longer needed
    db.disconnect(dbs)
    
    //Generating and saving the auth token as http-only cookie
    res.cookie('authToken',createAuthToken({id: dbres.id}),{httpOnly:true})
    
    //Sending as response useful user infos
    res.json({id: dbres.id, type: dbres.type})
})

/*
    Route for generating a new authentication token
*/
router.post('/refresh',async (req,res) => {
    const refreshCookie = req.cookies['refreshToken'];

     //Token verification
    jwt.verify(refreshCookie, process.env.JWT_REFRESH_SECRET, async (err, user) => {

        if(err)
            return res.sendStatus(401)


        //Verifying if a session with this token exists
        const dbs = await db.connect()
        if(!await db.sessionExists(dbs,refreshCookie)){
            
            db.disconnect(dbs)

            return res.sendStatus(401)
        }

        db.disconnect(dbs)

        //Generating and saving the auth token as http-only cookie
        res.cookie('authToken',createAuthToken(user),{httpOnly:true})

        res.send();
    })
})

module.exports = router;