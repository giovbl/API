const conn = require('./config')

const addRefertoEssentialsQuery = "INSERT INTO RefertoElegibile("+
                                  "isLabelEligible,isSampleElegible,"+
                                  "notElegibleReason,otherNotElegibleReason,"+
                                  "reasonSampleNotElegible,"+
                                  "ref_sample"+
                                  ") VALUES(?,?,?,?,?,?) RETURNING id"

const addRefertoLabelReasonQuery = "UPDATE RefertoElegibile "+
            "SET notElegibleReason = ?,otherNotElegibleReason = ? "+
            "WHERE id = ?"

const addRefertoSampleElReasonQuery = "UPDATE RefertoElegibile "+
                                "SET reasonSampleNotElegible = ?"+
                                "WHERE id = ?"

const addRefertoResQuery = "INSERT INTO RefertoRes("+
    "dnaQuality,technique,genomicInstabilityStatus,"+
    "lossOfHeterozygosityPercentage,genomicInstabilityMetric,"+
    "hrdStatus,hrdScore,genomicIntegrityStatus,brcaMutationStatus,"+
    "genotypeBrca,variantStatus,geneMutation,geneOther,exon,intron,"+
    "nucleotideSubstitution,aminoacidSubstitution,reportingNotes,"+
    "reportingNotesBRCA,refertingNotesHrd,technicalNotes,notesAnalysisCenter"+
    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id"

const addPDFQuery = "UPDATE RefertoElegibile SET file_pdf = ? "+
                    "WHERE id = ?"

const getRefertoQuery = "SELECT id,"+
                        "isLabelEligible,isSampleElegible,"+
                        "notElegibleReason,otherNotElegibleReason,"+
                        "reasonSampleNotElegible,summary,"+
                        "result,ref_sample AS 'sample',"+
                        "file_pdf AS refertoPdf "+
                        "FROM RefertoElegibile WHERE id = ?"

const getRefertoResQuery = "SELECT "+
    "dnaQuality,technique,genomicInstabilityStatus,"+
    "lossOfHeterozygosityPercentage,"+
    "genomicInstabilityMetric,hrdStatus,"+
    "hrdScore,genomicIntegrityStatus,"+
    "brcaMutationStatus,genotypeBrca,"+
    "variantStatus,geneMutation,geneOther,"+
    "exon,intron,nucleotideSubstitution,"+
    "aminoacidSubstitution,reportingNotes,"+
    "reportingNotesBRCA,refertingNotesHrd,"+
    "technicalNotes,notesAnalysisCenter "+
    "FROM RefertoRes WHERE id = ?"

/**
 * Creates a referto
 * @param {Object} referto Elegibility data about the referto
 * @param {Object} result Results about the referto
 * @returns {Number} The Id of the created referto
 */
async function addReferto(referto,result) {
    try{
        const refId = await conn.query(addRefertoEssentialsQuery,[
            referto.isLabelEligible,
            referto.isSampleElegible,
            referto.notElegibleReason,
            referto.otherNotElegibleReason,
            referto.reasonSampleNotElegible,
            referto.sample
        ])

        if(!referto.isLabelEligible){
            await conn.query(addRefertoLabelReasonQuery,[
                referto.notElegibleReason,
                referto.otherNotElegibleReason,
                refId[0].id
            ])
        }

        if(!referto.notElegibleReason){
            await conn.query(addRefertoSampleElReasonQuery,[
                referto.reasonSampleNotElegible,
                refId[0].id
            ])
        }

        if(result) {

            const resId = await conn.query(addRefertoResQuery,[
                result.dnaQuality,result.technique,result.genomicInstabilityStatus,
                result.lossOfHeterozygosityPercentage,result.genomicInstabilityMetric,
                result.hrdStatus,result.hrdScore,result.genomicIntegrityStatus,
                result.brcaMutationStatus,result.genotypeBrca,result.variantStatus,
                result.geneMutation,result.geneOther,result.exon,result.intron,
                result.nucleotideSubstitution,result.aminoacidSubstitution,
                result.reportingNotes,result.reportingNotesBRCA,result.refertingNotesHrd,
                result.technicalNotes,result.notesAnalysisCenter
            ])

            await conn.query("UPDATE RefertoElegibile SET result = ? WHERE id = ?",
                            [resId[0].id,refId[0].id])
        }

        return refId[0].id;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Gets data about a referto
 * @param {number} id Referto ID
 * @returns {Object} The requested referto
 */
async function getReferto(id) {

    try{
        const res = await conn.query(getRefertoQuery,[id])

        if(!res)
            return {}

        return res[0];
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Gets results about a referto
 * @param {number} id Referto Results ID
 * @returns {Object} The requested referto results
 */
async function getRefertoRes(id) {

    try{
        const res = await conn.query(getRefertoResQuery,[id])

        if(!res)
            return {}

        return res[0];
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Gets the summary genereted for a referto
 * @param {number} id Referto ID
 * @returns {String | null} The rgenerated summary
 */
async function getRefertoSummary(id) {

    try{
        const res = await conn.query("SELECT summary FROM RefertoElegibile WHERE id=?",[id])

        if(!res)
            return {}

        return res[0].summary;
    }
    catch(error){
        console.log(error)
        return null;
    }

}

/**
 * Adds PDF reference to a referto's result
 * @param {number} refertoId Referto ID
 * @param {string} fileName PDF reference
 */
async function addPDF(refertoId,fileName) {
    try{
        await conn.query(addPDFQuery,
                         [fileName,refertoId])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

/**
 * Gets the id of the referto associated to the sample
 * @param {number} sampleId Sample ID
 * @returns The id of the referto
 */
async function getRefertoId(sampleId) {
    try{
        const res = await conn.query("SELECT id FROM RefertoElegibile WHERE ref_sample = ?",
                                    [sampleId])

        if(!res)
            return null

        if(!res[0])
            return null

        return res[0].id;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

module.exports = {
    addReferto,
    getReferto,
    getRefertoRes,
    getRefertoSummary,
    getRefertoId,
    addPDF
}