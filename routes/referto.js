var express = require('express');
var router = express.Router();

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

var db = require('../services/DB/db');
var s3 = require('../services/storage/s3')

var {auth,authFun} = require('../utils/jwt_auth');
const { refertoSchema } = require('../utils/validator');

/*
    Route for creating a referto
*/
router.post('/',auth,async (req,res) => {

    //Verifying if the user has the required permissions
    if(req.user.userType != 'Analista'){
        res.sendStatus(403)
        return
    }

    if(!req.body){
        res.sendStatus(400)
        return
    }

    //Body validation
    const {error} = refertoSchema.validate(req.body)
    if(error){
        res.status(400).json(error)
        return
    }

    const refertoId = await db.addReferto(req.body.referto,req.body.result)
    
    if(!refertoId){
        res.sendStatus(500)
        return
    }

    res.status(201).json({id: refertoId});
})

/*
    Route for getting data about a referto
*/
router.get('/:id',auth,async (req,res) => {

    //Verifying if the user has the required permissions
    if(req.user.userType != 'Oncologo' && 
       req.user.userType != 'Analista'){
        res.sendStatus(403)
        return
    }

    const id = req.params.id


    const out = await db.getReferto(id)

    if(!out){
        res.sendStatus(404)
        return
    }

    //Getting Referto results if exists
    if(out.result)
        out.result = await db.getRefertoRes(out.result)

    //GEtting URL for the PDF
    const s3c = s3.initializeClient()
    out.refertoPdf = await s3.getObjectURL(s3c,out.refertoPdf);

    //Getting sample data if specified
    if(req.body && req.body.getSample)
        out.sample = await db.getSample(out.sample)
    
    res.json(out)
})

/*
    Route for uploading the PDF file of a referto
*/
router.post('/:id/file',upload.single('refpdf'),async (req,res) => {
    const id = req.params.id

    //Authentication
    const auth = await authFun(req);
    if(auth.failed){
        res.sendStatus(401)
        return;
    }

    //Verifying if the user has the required permissions
    if(auth.user.userType != 'Analista'){
        res.sendStatus(403)
        return
    }

    console.log(req.file)

    //Initializing S3 client
    const s3c = s3.initializeClient()

    //Uploading PDF to S3 bucket
    const fileName = await s3.addObject(s3c,req.file.buffer,req.file.mimetype)
    if(!fileName){
        res.sendStatus(500)
        return
    }

    if(!await db.addPDF(id,fileName)){
        res.status(500).send()
    }

    res.status(201).send()
})

module.exports = router