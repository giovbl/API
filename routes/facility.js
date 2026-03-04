var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/* 
    Route for getting all the facilities and related analyst workgroups
*/
router.get('/',auth,async (req,res) => {

    const dbs = await db.connect()
    const out = await db.getFacilities(dbs)

    for(var i = 0; i < out.length; i++)
        out[i].workgroups = await db.getWorkgroups(dbs,out[i].id)

    res.json(out)

})