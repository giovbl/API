var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');
const { sampleSchema,sampleStatusSchema } = require('../utils/validator');

/*
    Route for getting samples data for a specified user id
*/
router.get('/',auth,async (req,res) => {



    const analystWorkgroup = req.query?.analystWorkgroup
    const oncologiWorkgroup = req.query?.oncologiWorkgroup

    const out = await db.getSamples(await db.getUserWorkgroupID(req.user.id))

    //Adding requested workgroup data
    if(req.params){

        for (var i = 0; i < out.length; i++) {

            if(analystWorkgroup){

                out[i].analystWorkgroup = await db.getWorkgroup(out[i].analystWorkgroup)

                const fac = await db.getFacility(out[i].analystWorkgroup.facility);
                out[i].analystWorkgroup.facility = {nome: fac.nome, id: fac.id}
            }

            if(oncologiWorkgroup){
                out[i].oncologiWorkgroup = await db.getWorkgroup(out[i].oncologiWorkgroup)
                
                const fac = await db.getFacility(out[i].oncologiWorkgroup.facility)
                out[i].oncologiWorkgroup.facility = {nome: fac.nome, id: fac.id}

                out[i].referto = await db.getRefertoId(out[i].id)
            }

            if(out[i].shipment)
                out[i].shipment = await db.getShipping(out[i].id)
        }
    }

    res.json(out)
})

/*
    Route for creating a sample
*/
router.post('/',auth,async (req,res) => {

    //Verifying if the user has the required permissions
    if(req.user.userType != 'Oncologo'){
        res.sendStatus(403)
        return
    }

    if(!req.body)
        res.status(400).send()

    //Body validation
    const {error} = sampleSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return
    }
    
    

    //Automatically deciding if it is necessary to use a courier
    req.body.isCourierUsed = new Boolean(
        await db.getWorkgroup(req.body.oncologiWorkgroup).facility 
        === 
        await db.getWorkgroup(req.body.analystWorkgroupWorkgroup).facility 
    );

    //Creating the sample with the informations provided
    if(!await db.addSample(req.body)){ 
        
        res.status(500).send()
        return;
    }

    

    res.status(201).send();
})

/*
    Route for getting data about a sample
*/
router.get('/:id',auth,async (req,res) => {

    //Verifying if the user has the required permissions
    console.log(req.user)
    if(req.user.userType != 'Oncologo' &&
       req.user.userType != 'Analista'){
        res.sendStatus(403)
        return
    }

    const id = req.params.id;

    const dbres = await db.getSample(id)

    if(!dbres)
        res.sendStatus(404)

    res.json(dbres)

})

/*
    Route for shipping a sample with the specified courier
*/
router.post('/:id/ship',auth,async (req,res) => {
    const id = req.params.id;

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
    const {error} = shipSampleSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return;
    }
    
    

    const shippingId = await db.addShipping(req.body) 
    
    if(!shippingId)
        res.status(500)

    if(!await db.setShipping(id,shippingId))
        res.status(500)


    res.send();
})

/*
    Route for modifying the sample status
*/
router.patch('/:id/status',auth,async (req,res) => {
    const id = req.params.id

    //Verifying if the user has the required permissions
    if(req.user.userType != 'Analista'){
        res.sendStatus(403)
        return
    }

    if(!req.body){
        res.seandStatus(400)
        return;
    }
    
    const {error} = sampleStatusSchema.validate(req.body)

    if(error){
        res.status(400).json(error)
        return;
    }
    

    if(!await db.setSampleStatus(id,req.body.status)){
        
        res.status(500).send()
        return;
    }

    res.sendStatus(204)
})



module.exports = router;