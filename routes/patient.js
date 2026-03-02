var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for creating a patient
*/
router.post('/',auth,async (req,res) => {
    
    if(!req.body)
        res.status(400).send()

    const dbs = await db.connect();

    if(!await db.addPatient(dbs,req.body)) {
        res.status(500)
    }

    db.disconnect(dbs);

    res.send();
})

/*
    Route for getting the specified patient's data
*/
router.get('/',auth,async (req,res) => {
    if(!req.body.fiscalCode)
        res.status(400).send() 

    const dbs = await db.connect()

    const dbres = await db.getPatient(dbs,req.body.fiscalCode)

    db.disconnect(dbs);

    res.json(dbres);
})



module.exports = router;