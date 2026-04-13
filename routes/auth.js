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
        res.send({failed: true, message:"Login failed: wrong email or password"});
        return;
    }

    const sdata = await createSession(db,dbres.id)

    //Storing the refresh token of the new session
    res.cookie('refreshToken',sdata.token,{
        path: 'auth/refresh',
        httpOnly:true,
        //secure: true,
        //sameSite: "none"
    })
    
    //Generating and saving the auth token as http-only cookie
    res.cookie('authToken',createAuthToken({
                                    id:dbres.id,
                                    userType:dbres.type,
                                    sid:sdata.sessionId
                                }),{
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
        if(!await db.sessionValid(refreshCookie,user.id)){        
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
    
    //Verifying if the user already exists
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

/* Route for logging out a user */
router.get('/logout',auth,async (req,res) => {

    res.clearCookie("authToken")
    res.clearCookie("refreshToken");

    if(!await db.setSessionValidity(req.user.sid,false)){
        res.sendStatus(500)
        return
    }

    res.json({message:"Logout is a success"})
})

module.exports = router;