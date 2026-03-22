var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var db = require('../services/DB/db');
var {auth,createSession, createAuthToken} = require('../utils/jwt_auth');
const { loginSchema, registerSchema } = require('../utils/validator');

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

    if(!req.body){
        res.sendStatus(400)
        return
    }

    //Body data validation
    const {error} = loginSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return
    }

    //Credentials verification
    const dbres = await db.login(req.body.email,req.body.pwd);

    if(!dbres){
        
        res.sendStatus(401);
        return;
    }

    //Storing the refresh token of the new session
    res.cookie('refreshToken',createSession(db,dbres.id),{
        path: 'auth/refresh',
        httpOnly:true,
        //secure: true,
        //sameSite: "none"
    })
    
    //Generating and saving the auth token as http-only cookie
    res.cookie('authToken',createAuthToken({id:dbres.id,userType:dbres.type}),{
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
    const refreshCookie = req.cookies['refreshToken'];

     //Token verification
    jwt.verify(refreshCookie, process.env.JWT_REFRESH_SECRET, async (err, user) => {

        if(err)
            return res.sendStatus(401)

        //Verifying if a session with this token exists
        if(!await db.sessionExists(refreshCookie)){        
            return res.sendStatus(401)
        }

        //Generating and saving the auth token as http-only cookie
        res.cookie('authToken',createAuthToken(await db.getUser(user.id)),{
            httpOnly:true,
            //secure: true,
            //sameSite: "none"
        })

        res.send();
    })
})

/*
    Route for registering an user
*/
router.post('/register',async (req,res) => {
   
    if(!req.body){
        res.sendStatus(400)
        return
    }

    //Body data validation
    const {error} = registerSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return;
    }
    
        
    const dbs = await db.connect();

    if(await db.userExists(req.body.email)){
        res.status(409).json({message:"Utente già esistente"})
        return
    }

    const id = await db.addUser(req.body)

    if(!id)
        res.sendStatus(500)
    else
        res.sendStatus(201)
})

module.exports = router;