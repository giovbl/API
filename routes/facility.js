var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/* 
    Route for getting all the facilities and related analyst workgroups
*/
router.get('/',async (req,res) => {

    const filter = req.query?.workgroupType

    const dbs = await db.connect()
    const out = await db.getFacilities(dbs)

    for(var i = 0; i < out.length; i++)
        if(filter != undefined)
            out[i].workgroups = await db.getWorkgroups(dbs,out[i].id,filter)
        else
            out[i].workgroups = await db.getWorkgroups(dbs,out[i].id)

    res.json(out)

})

module.exports = router;