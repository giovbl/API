var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {patientSchema} = require('../utils/validator')
var {auth} = require('../utils/jwt_auth');

/*
    Route for creating a patient
*/
router.post('/',auth,async (req,res) => {

    //Verifying if the user has the required permissions
    if(req.user.userType != 'Oncologo'){
        res.sendStatus(403)
        return
    }
    
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

    const query = req.query?.q;
    
    if(query)
        res.json(await db.queryPatients(query))
    else
        res.json(await db.getPatients())
})

/*
    Route for verifying patient existence by it's fiscal code
*/
router.post('/exists',auth,async (req,res) => {

    if(!req.body)
        return res.sendStatus(400)

    const fiscalCode = req.body.fiscalCode

    const dbres = await db.patientExists(fiscalCode)

    res.send({exists:Boolean(dbres)})
})

/*
    Route for getting the specified patient's data
*/
router.get('/:id',auth,async (req,res) => {

    const id = req.params.id

    const dbres = await db.getPatient(id)

    if(!dbres){
        res.sendStatus(404)
        return;
    }

    res.json(dbres);
})


module.exports = router;