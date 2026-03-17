var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {patientSchema} = require('../utils/validator')
var {auth} = require('../utils/jwt_auth');

/*
    Route for creating a patient
*/
router.post('/',auth,async (req,res) => {
    
    if(!req.body){
        res.sendStatus(400)
        return;
    }

    //Body validation
    const {error} = patientSchema.validate(req.body)
    if(error){
        res.json(error).status(400)
        return;
    }

    const dbs = await db.connect();

    if(await db.patientExists(dbs,req.body.fiscalCode)){
        await db.disconnect(dbs);
        res.status(409).json({message:"Paziente già esistente"})
        return;
    }


    if(!await db.addPatient(dbs,req.body)){
        await db.disconnect(dbs)
        res.status(500).send()
        return;
    }

    await db.disconnect(dbs);

    res.status(201).send();
})

/*
    Route for getting all patients
*/
router.get('/',auth,async (req,res) => {

    const dbs = await db.connect()

    const dbres = await db.getPatients(dbs)

    await db.disconnect(dbs);

    res.json(dbres);
})

/*
    Route for getting the specified patient's data
*/
router.get('/:fiscalCode',auth,async (req,res) => {

    if(!req.body)
        res.status(400).send()

    const fiscalCode = req.body.fiscalCode

    if(!fiscalCode)
        res.status(400).send() 

    const dbs = await db.connect()

    const dbres = await db.getPatient(dbs,fiscalCode)

    await db.disconnect(dbs);

    res.json(dbres);
})


module.exports = router;