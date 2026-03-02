var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for getting samples data of the specified workgroup
*/
router.get('/',auth,(req,res) => {
    
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