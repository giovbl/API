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

    if(await db.patientExists(dbs,req.body.fiscalCode)){
        db.disconnect(dbs);
        res.status(409).json({message:"Paziente già esistente"})
        return;
    }


    if(!await db.addPatient(dbs,req.body)){
        db.disconnect(dbs)
        res.status(500).send()
    }

    db.disconnect(dbs);

    res.status(201).send();
})

/*
    Route for getting the specified patient's data
*/
router.get('/',auth,async (req,res) => {

    if(!req.body)
        res.status(400).send()

    const fiscalCode = req.body.fiscalCode

    if(!fiscalCode)
        res.status(400).send() 

    const dbs = await db.connect()

    const dbres = await db.getPatient(dbs,fiscalCode)

    db.disconnect(dbs);

    res.json(dbres);
})


module.exports = router;