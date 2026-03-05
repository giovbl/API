var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for getting samples data for a specified user id
*/
router.get('/',auth,async (req,res) => {

    const dbs = await db.connect()
    const out = await db.getSamples(dbs,await db.getUserWorkgroupID(dbs,req.user.id))

    //Adding requested workgroup data
    if(req.body){

        for (var i = 0; i < out.length; i++) {

            if(req.body.analystWorkgroup){

                out[i].analystWorkgroup = await db.getWorkgroup(dbs,out[i].analystWorkgroup)

                const fac = await db.getFacility(dbs,out[i].analystWorkgroup.facility);
                out[i].analystWorkgroup.facility = {nome: fac.nome, id: fac.id}
            }

            if(req.body.oncologiWorkgroup){
                out[i].oncologiWorkgroup = await db.getWorkgroup(dbs,out[i].oncologiWorkgroup)
                
                const fac = await db.getFacility(dbs,out[i].oncologiWorkgroup.facility)
                out[i].oncologiWorkgroup.facility = {nome: fac.nome, id: fac.id}

                out[i].referto = await db.getRefertoId(dbs,out[i].id)
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