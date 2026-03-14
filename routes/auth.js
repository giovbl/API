var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var db = require('../services/DB/db');
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
        res.sendStatus(401);
        return;
    }

    //Storing the refresh token of the new session
    res.cookie('refreshToken',createSession(db,dbs,dbres.id),{
        path: 'auth/refresh',
        httpOnly:true,
        //secure: true,
        //sameSite: "none"
    })

    //DB connection no longer needed
    db.disconnect(dbs)
    
    //Generating and saving the auth token as http-only cookie
    res.cookie('authToken',createAuthToken({id: dbres.id}),{
        httpOnly:true,
        //secure: true,
        //sameSite: "none"
    })
    
    //Sending as response useful user infos
    res.json(dbres)
})

/*
    Route for generating a new authentication token
*/
router.post('/refresh',async (req,res) => {
    const refreshCookie = req.cookies['refreshToken'];ù
    
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

/*
    Route for registering an user
*/
router.post('/register',async (req,res) => {
   
    if(!req.body)
        res.status(400).send()
        
    const dbs = await db.connect();

    if(await db.userExists(dbs,req.body.email)){
        db.disconnect(dbs)
        res.status(409).json({message:"Utente già esistente"})
    }

    const id = await db.addUser(dbs,req.body)
    
    db.disconnect(dbs)

    if(!id)
        res.status(500)
    else
        res.status(201)

    res.send()
})

module.exports = router;