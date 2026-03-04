
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

const addRefertoResultQuery = "UPDATE RefertoEligible "+
                              "SET result = ? WHERE id = ?"

const addRefertoResQuery = "INSERT INTO RefertoRes("+
    "dnaQuality,technique,genomicInstabilityStatus,"+
    "lossOfHeterozygosityPercentage,genomicInstabilityMetric,"+
    "hrdStatus,hrdScore,genomicIntegrityStatus,brcaMutationStatus,"+
    "genotypeBrca,variantStatus,geneMutation,geneOther,exon,intron,"+
    "nucleotideSubstitution,aminoacidSubstitution,reportingNotes,"+
    "reportingNotesBRCA,refertingNotesHrd,technicalNotes,notesAnalysisCenter"+
    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING id"

/**
 * 
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
            referto.ref_sample
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

            await conn.query(addRefertoResultQuery,[resId,refId])
        }

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

async function getReferto(conn,id) {

    try{
        const res = await conn.query("SELECT * FROM RefertoEligibile WHERE id = ?",[id])

        if(!res)
            return {}

        return res[0];
    }
    catch(error){
        console.log(error)
        return null;
    }

}

async function getRefertoRes(conn,id) {

    try{
        const res = await conn.query("SELECT * FROM RefertoRes WHERE id = ?",[id])

        if(!res)
            return {}

        return res[0];
    }
    catch(error){
        console.log(error)
        return null;
    }

}

module.exports = {
    addReferto,
    getReferto,
    getRefertoRes
}