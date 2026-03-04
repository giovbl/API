var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

router.post('/',auth,async (req,res) => {
    if(!req.body)
        res.status(400).send()

    const dbs = await db.connect()

    if(!await db.addReferto(dbs,req.body.referto,req.body.result))
        res.status(500)

    res.send()
})

/* 
    Route for getting data about a referto
*/
router.get('/:id',auth,async (req,res) => {

    const dbs = await db.connect()

    const out = await db.getReferto(dbs,id)

    //Getting Referto results if exists
    if(out.result)
        out.result = await db.getRefertoRes(dbs,id)

    //Getting sample data if specified
    if(req.body && req.body.getSample)
        out.ref_sample = await db.getSample(dbs,id)

    db.disconnect(dbs)
    
    res.json(out)
})

module.exports = router