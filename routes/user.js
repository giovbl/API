var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');
var {auth} = require('../utils/jwt_auth');

/*
    Route for getting current user infos
*/
router.get('/',auth,async (req,res) => {

    const dbs = await db.connect()

    const user = await db.getUser(dbs,req.user.id)

    db.disconnect(dbs)

    if(!user)
        res.sendStatus(500)
    else
        res.json(user)

})

/*
    Route for modifying current user's workgroup
*/
router.patch('/workgroup',auth,async (req,res) => {

    if(!req.body || !req.body.workgroup)
        res.sendStatus(400)

    const dbs = await db.connect()

    const ops = await db.setUserWorkgroup(dbs,req.user.id,
                                          req.body.workgroup)

    db.disconnect(dbs)

    if(!ops)
        res.sendStatus(500)

   res.sendStatus(204)
})

module.exports = router;