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

    const dbs = await db.connect()
    const out = await db.getSamples(dbs,await db.getUserWorkgroupID(dbs,req.user.id))

    //Adding requested workgroup data
    if(req.params){

        for (var i = 0; i < out.length; i++) {

            if(analystWorkgroup){

                out[i].analystWorkgroup = await db.getWorkgroup(dbs,out[i].analystWorkgroup)

                const fac = await db.getFacility(dbs,out[i].analystWorkgroup.facility);
                out[i].analystWorkgroup.facility = {nome: fac.nome, id: fac.id}
            }

            if(oncologiWorkgroup){
                out[i].oncologiWorkgroup = await db.getWorkgroup(dbs,out[i].oncologiWorkgroup)
                
                const fac = await db.getFacility(dbs,out[i].oncologiWorkgroup.facility)
                out[i].oncologiWorkgroup.facility = {nome: fac.nome, id: fac.id}

                out[i].referto = await db.getRefertoId(dbs,out[i].id)
            }

            if(out[i].shipment)
                out[i].shipment = await db.getShipping(dbs,out[i].id)
        }
    }

    await db.disconnect(dbs)
    
    res.json(out)
})

/*
    Route for creating a sample
*/
router.post('/',auth,async (req,res) => {

    if(!req.body)
        res.status(400).send()

    //Body validation
    const {error} = sampleSchema.validate(req.body)
    if(error){
        res.json(err).status(400)
        return
    }
    
    const dbs = await db.connect();

    //Automatically deciding if it is necessary to use a courier
    req.body.isCourierUsed = new Boolean(
        await db.getWorkgroup(dbs,req.body.oncologiWorkgroup).facility 
        === 
        await db.getWorkgroup(dbs,req.body.analystWorkgroupWorkgroup).facility 
    );

    //Creating the sample with the informations provided
    if(!await db.addSample(dbs,req.body)){ 
        await db.disconnect(dbs)
        res.status(500).send()
        return;
    }

    await db.disconnect(dbs);

    res.status(201).send();
})

/*
    Route for shipping a sample with the specified courier
*/
router.post('/:id/ship',auth,async (req,res) => {

    const id = req.params.id;

    if(!req.body){
        res.sendStatus(400)
        return;
    }

    //Body validation
    const {error} = shipSampleSchema.validate(req.body)
    if(error){
        res.json(error).status(400)
        return;
    }
    
    const dbs = await db.connect();

    const shippingId = await db.addShipping(dbs,req.body) 
    
    if(!shippingId)
        res.status(500)

    if(!await db.setShipping(dbs,id,shippingId))
        res.status(500)

    await db.disconnect(dbs);

    res.send();
})

/*
    Route for modifying the sample status
*/
router.patch('/:id/status',auth,async (req,res) => {
    const id = req.params.id

    if(!req.body){
        res.seandStatus(400)
        return;
    }
    
    const {error} = sampleStatusSchema.validate(req.body)

    if(error){
        res.json(error).status(400)
        return;
    }
    
    const dbs = await db.connect();

    if(!await db.setSampleStatus(dbs,id,req.body.status)){
        await db.disconnect(dbs);
        res.status(500).send()
        return;
    }

    await db.disconnect(dbs);

    res.sendStatus(204)
})



module.exports = router;