var express = require('express');
var router = express.Router();

const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

var db = require('../services/DB/db');
var s3 = require('../services/storage/s3')

var {auth} = require('../utils/jwt_auth');

/*
    Route for creating a referto
*/
router.post('/',auth,async (req,res) => {
    if(!req.body)
        res.status(400).send()

    const dbs = await db.connect()

    if(!await db.addReferto(dbs,req.body.referto,req.body.result))
        res.status(500)

    res.send()
})

/*
    Route for getting data about a referto
*/
router.get('/:id',auth,async (req,res) => {

    const id = req.params.id

    const dbs = await db.connect()

    const out = await db.getReferto(dbs,id)

    //Getting Referto results if exists
    if(out.result){

        out.result = await db.getRefertoRes(dbs,out.result)

        const s3c = s3.initializeClient()
        out.result.file_pdf = await s3.getObjectURL(s3c,out.result.file_pdf);
    }

    //Getting sample data if specified
    if(req.body && req.body.getSample)
        out.ref_sample = await db.getSample(dbs,out.ref_sample)

    db.disconnect(dbs)
    
    res.json(out)
})

/*
    Route for uploading the PDF file of a referto
*/
router.post('/:id/file',upload.single('refpdf'),async (req,res) => {

    //auth(req,res,next)
    const id = req.params.id

    if(!req.body)
        res.status(400).send()

    const s3c = s3.initializeClient()
    const fileName = await s3.addObject(s3c,req.file.buffer,req.file.mimetype)

    if(!fileName)
        res.status(500).send()

    const dbs = await db.connect()

    if(!await db.addPDF(dbs,id,fileName))
        res.status(500)

    res.send()
})

module.exports = router