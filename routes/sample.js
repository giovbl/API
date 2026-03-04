var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for getting samples data for a specified user id
*/
router.get('/',auth,async (req,res) => {

    const dbs = await db.connect()
    const out = await db.getSamples(dbs,await db.getUserWorkgroupID(req.user.id))

    //Adding requested workgroup data
    if(req.body){

        for (var i = 0; i < dbres.length; i++) {

            if(req.body.analystWorkgroup){
                out[i].analystWorkgroup = await db.getWorkgroup(dbs,out[i].analystWorkgroup)
                out[i].analystWorkgroup.facilityNome = await db.getFacility().nome
            }

            if(req.body.oncologiWrkgroup){
                out[i].oncologiWorkgroup = await db.getWorkgroup(dbs,out[i].oncologiWorkgroup)
                out[i].oncologiWorkgroup.facilityName = await db.getFacility().nome
            }
        }
    }

    db.disconnect(dbs)
    
    res.json(out)
})

/*
    Route for creating a sample
*/
router.post('/',auth,async (req,res) => {

    if(!req.body)
        res.status(400).send()
    
    const dbs = await db.connect();

    if(!await db.addSample(dbs,req.body)) 
        res.status(500)
    

    db.disconnect(dbs);

    res.send();

})

/*
    Route for creating a shipping a sample with the specified courier
*/
router.get('/:id/ship',auth,async (req,res) => {

    const id = req.params.id;

    if(!req.body)
        res.status(400).send()
    
    const dbs = await db.connect();

    if(!await db.addShipping(dbs,req.body)) 
        res.status(500)

    db.disconnect(dbs);

    res.send();

})

/*
    Route for modifying the sample status
*/
router.put('/:id/status',auth,async (req,res) => {

    if(!req.body)
        res.status(400).send()

    const id = req.params.id
    const status = req.body.status

    if(!status)
        res.status(400).send()
    
    const dbs = await db.connect();

    if(!await db.setSampleStatus(dbs,id,status))
        res.status(500)

    db.disconnect(dbs);

    res.send();
})



module.exports = router;