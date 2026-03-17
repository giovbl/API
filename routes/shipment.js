var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');
const { shipmentStatusSchema } = require('../utils/validator');

/*
    Route for getting shippings assigned to
    the courier requesting the data
*/
router.get('/',auth,async (req,res) => {
    
    const userId = req.user.id;

    const dbs = await db.connect()
    
    const dbres = await db.getShippings(dbs,userId)

    /*
    Adding:
        - data about the sender
        - data about the recipient
        - ID of the sample being shipped
    */
    for (var i = 0; i < dbres.length; i++) {
        dbres[i].sender = await db.getFacility(dbs,dbres[i].sender)
        dbres[i].recipient = await db.getFacility(dbs,dbres[i].recipient)
        dbres[i].sample = await db.getShipmentSampleId(dbs,dbres[i].id)
    }


    await db.disconnect(dbs);

    res.json(dbres);
})

/* 
    Route for updating the status of a shipping 
*/
router.patch('/:id/status',auth,async (req,res) => {
    const shippingId = req.params.id

    if(!req.body)
        res.status(400).send()

    const {error} = shipmentStatusSchema.validate(req.body)

    if(error)
        res.status(400).json(error).send()
    
    const dbs = await db.connect();

    if(!await db.setShippingStatus(dbs,shippingId,req.body.status)){
        await db.disconnect(dbs)
        res.status(500).send()
        return;
    }

    await db.disconnect(dbs);

    res.sendStatus(204);
})

module.exports = router;