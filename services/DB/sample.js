const conn = require('./config')

const addQuery = "INSERT INTO Sample("+
    "analystWorkgroup,typeOfBiologicalMaterial,"+
    "exhaustedBiologicalMaterial,histologicalNumber,"+
    "tissuePreservationMode,tissueSamplingMode,"+
    "otherTissueSamplingMode,biopsyType,tissueProvenance,"+
    "metaStaticSite,pctTumorCells,ageOfSample,isCourierUsed,"+
    "pathologistNotes,patient,oncologiWorkgroup"+
    ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"

const selectInitialQuery ="SELECT id,"+
                "analystWorkgroup,typeOfBiologicalMaterial,"+
                "exhaustedBiologicalMaterial,histologicalNumber,"+
                "tissuePreservationMode,tissueSamplingMode,"+
                "otherTissueSamplingMode,biopsyType,"+
                "tissueProvenance,metaStaticSite,pctTumorCells,"+
                "ageOfSample,isCourierUsed,pathologistNotes,"+
                "patient,analysisStat,shipping as 'shipment',oncologiWorkgroup "+
                "FROM Sample "

const getSamplesQuery = selectInitialQuery + "WHERE (analystWorkgroup = ?) OR (oncologiWorkgroup = ?)"

const getSampleQuery = selectInitialQuery + "WHERE id = ?"

    
/**
 * Adds a new sample
 * @param {Object} sample Sample data
 * @returns {boolean} If the operation is successfull
 */
async function addSample(sample)
{
    try{
        await conn.query(addQuery,[
            sample.analystWorkgroup,sample.typeofBiologicalMaterial,
            sample.exhaustedBiologicalMaterial,sample.histologicalNumber,
            sample.tissuePreservationMode,sample.tissueSamplingMode,
            sample.otherTissueSamplingMode,sample.biopsyType,
            sample.tissueProvenance,sample.metaStaticSite,
            sample.pctTumorCells,sample.ageOfSample,(sample.isCourierUsed?1:0),
            sample.pathologistNotes,sample.patient,
            sample.oncologiWorkgroup
        ])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

/**
 * Gets all the samples created/assigned by a workgroup
 * @param {number} workgroupId Workgroup ID
 * @returns {Array<Object>} The resulting samples
 */
async function getSamples(workgroupId) {
    try{
        const res = await conn.query(getSamplesQuery,
                                    [workgroupId,workgroupId])

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Gets all the samples created/assigned by a workgroup
 * @param {number} id Sample ID
 * @returns {Object} The resulting sample
 */
async function getSample(id) {
    try{
        const res = await conn.query(getSampleQuery,[id])
        
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
 * Updates the sample status
 * @param {number} id Sample id 
 * @param {string} status New status for the sample
 * @returns {boolean} If the operation is successfull
 */
async function setSampleStatus(id,status) {
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

/**
 * Assigns a shipping to 
 * @param {number} id Sample id 
 * @param {string} status New status for the sample
 * @returns {boolean} If the operation is successfull
 */
async function setShipping(id,shippingId) {
    try{
        await conn.query("UPDATE Sample SET shipping = ? WHERE id = ?",
                         [shippingId,id])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

async function getShipmentSampleId(shipmentId){
    try{
        const res = await conn.query("SELECT id FROM Sample WHERE shipping=?",[shipmentId])

        if(!res)
            return null

        return res[0].id;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

module.exports = {
    addSample,
    getSamples,
    getSample,
    setSampleStatus,
    setShipping,
    getShipmentSampleId
}