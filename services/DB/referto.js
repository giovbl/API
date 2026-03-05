
const addRefertoEssentialsQuery = "INSERT INTO RefertoElegibile("+
                                  "isLabelEligible,isSampleElegible,"+
                                  "result,ref_sample"+
                                  ") VALUES(?,?,?,?) RETURNING id"

const addRefertoLabelReasonQuery = "UPDATE RefertoEligible"+
            "SET notElegibleReason = ?,otherNotElegibleReason = ? "+
            "WHERE id = ?"

const addRefertoSampleElReasonQuery = "UPDATE RefertoEligible"+
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

const addPDFQuery = "UPDATE RefertoRes SET file_pdf = ? "+
                    "WHERE id = ( SELECT result FROM RefertoElegibile "+
                                "WHERE id = ? )"

const getRefertoQuery = "SELECT "+
                        "isLabelEligible,isSampleElegible,"+
                        "result,ref_sample AS 'sample' "+
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
 * @param {mariadb.Connection} conn DB connection
 * @param {Object} referto Elegibility data about the referto
 * @param {Object} result Results about the referto
 * @returns {boolean} If the operation is successfull
 */
async function addReferto(conn,referto,result) {
    try{
        const refId = await conn.query(addRefertoEssentialsQuery,[
            referto.isLabelEligible,
            referto.isSampleElegible,
            referto.sample
        ])

        if(!referto.isLabelEligible){
            await conn.query(addRefertoLabelReasonQuery,[
                referto.notElegibleReason,
                referto.otherNotEligibleReason,
                refId
            ])
        }

        if(!referto.notElegibleReason){
            await conn.query(addRefertoSampleElReasonQuery,[
                referto.reasonSampleNotElegible,
                refId
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

            await conn.query("UPDATE RefertoEligible SET result = ? WHERE id = ?",
                            [resId,refId])
        }

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

/**
 * Gets data about a referto
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Referto ID
 * @returns {Object} The requested referto
 */
async function getReferto(conn,id) {

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
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Referto Results ID
 * @returns {Object} The requested referto results
 */
async function getRefertoRes(conn,id) {

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
 * Adds PDF reference to a referto's result
 * @param {mariadb.Connection} conn DB connection
 * @param {number} refertoId Referto ID
 * @param {string} fileName PDF reference
 */
async function addPDF(conn,refertoId,fileName) {
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

module.exports = {
    addReferto,
    getReferto,
    getRefertoRes,
    addPDF
}