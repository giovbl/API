var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for getting samples data for a specified user id
*/
router.get('/',auth,async (req,res) => {

    const userId = req.body.userId;

    if(!userId)
        res.status(400).send()

    const dbs = await db.connect();
    const out = await db.getSamples(userId) //TODO: implement the function
    db.disconnect(dbs);
    
    res.json(out)
})

/*
    Route for creating a sample
*/
router.post('/',auth,(req,res) => {
    
})

/*
    Route for creating a shipping a sample with the specified courier
*/
router.get('/:id/ship',auth,(req,res) => {

})

/*
    Route for modifying the sample status
*/
router.put('/:id/status',auth,(req,res) => {

})



module.exports = router;