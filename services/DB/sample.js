const mariadb = require('mariadb');

const addQuery = "INSERT INTO Sample("+
    "analystWorkgroup,typeOfBiologicalMaterial,"+
    "exhaustedBiologicalMaterial,histologicalNumber,"+
    "tissuePreservationMode,tissueSamplingMode,"+
    "otherTissueSamplingMode,biopsyType,tissueProvenance,"+
    "metaStaticSite,pctTumorCells,ageOfSample,isCourierUsed,"+
    "pathologistNotes,patient,analysisStat,shipping,oncologiWorkgroup"+
    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

    
/**
 * 
 * @param {mariadb.Connection} conn DB connection
 * @param {Object} sample Sample data
 * @returns {boolean} If the operation is successfull
 */
async function addSample(conn,sample)
{
    try{
        await conn.query(addQuery,[
            sample.analystWorkgroup,sample.typeofBiologicalMaterial,
            sample.exhaustedBiologicalMaterial,sample.histologicalNumber,
            sample.tissuePreservationMode,sample.tissueSamplingMode,
            sample.otherTissueSamplingMode,sample.biopsyType,
            sample.tissueProvenance,sample.metaStaticSite,
            sample.pctTumorCells,sample.ageOfSample,sample.isCourierUsed,
            sample.pathologistNotes,sample.patient,sample.analysisStat,
            sample.shipping,sample.oncologiWorkgroup
        ])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

async function getSamples(conn,workgroupId) {
    try{
        const res = await conn.query(
                        "SELECT * FROM Sample "+
                        "WHERE (analystWorkgroup = ?) OR (oncologiWorkgroup = ?)",
                        [workgroupId,workgroupId])

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * 
 * @param {mariadb.Connection} conn DB connection 
 * @param {number} id Sample id 
 * @param {string} status New status for the sample
 * @returns {boolean} If the operation is successfull
 */
async function setSampleStatus(conn,id,status) {
    try{
        await conn.query("UPDATE Sample SET analysisStat = ? WHERE id = ?",
                         [status,id])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}


module.exports = {
    addSample,
    getSamples,
    setSampleStatus
}