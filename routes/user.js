var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');
var {auth} = require('../utils/jwt_auth');
const { userWorkgroupSchema } = require('../utils/validator');

/*
    Route for getting current user infos
*/
router.get('/',auth,async (req,res) => {

    //Getting user data
    const user = await db.getUser(req.user.id)

    if(!user){
        await db.disconnect(dbs)
        res.sendStatus(500)
        return;
    }

    //Getting user's workgroup info
    if(user.workgroup){
        user.workgroup = await db.getWorkgroup(user.workgroup)

        //Adding facility info to workgroup
        user.workgroup.facility = await db.getFacility(user.workgroup.facility)
    }
    
    res.json(user)
})

/*
    Route for modifying current user's workgroup
*/
router.patch('/workgroup',auth,async (req,res) => {

    if(!req.body){
        res.sendStatus(400)
        return
    }

    //Body validation
    const {error} = userWorkgroupSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return
    }

    const ops = await db.setUserWorkgroup(req.user.id,
                                          req.body.workgroup)

    if(!ops)
        res.sendStatus(500)

   res.sendStatus(204)
})

module.exports = router;