var express = require('express');
var router = express.Router();

var db = require('../services/DB/db');

var {auth} = require('../utils/jwt_auth');

/*
    Route for creating a patient
*/
router.get('/',auth,(req,res) => {
    
})

/*
    Route for getting the specified patient's data
*/
router.get('/:id',auth,(req,res) => {
    
})



module.exports = router;