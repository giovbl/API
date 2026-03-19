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
        res.status(400).json(error)
        return;
    }

    //Verifying if the patient already exists
    if(await db.patientExists(req.body.fiscalCode)){
        res.status(409).json({message:"Paziente già esistente"})
        return;
    }

    //Creating the new patient
    if(!await db.addPatient(req.body)){
        res.status(500).send()
        return;
    }

    res.status(201).send();
})

/*
    Route for getting all patients
*/
router.get('/',auth,async (req,res) => {

    const dbres = await db.getPatients()

    res.json(dbres);
})

/*
    Route for getting the specified patient's data
*/
router.get('/:fiscalCode',auth,async (req,res) => {

    const fiscalCode = req.params.fiscalCode

    if(!fiscalCode)
        res.status(400).send() 

    const dbres = await db.getPatient(fiscalCode)

    res.json(dbres);
})


module.exports = router;