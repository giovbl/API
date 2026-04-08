const conn = require('./config')

const addQuery = "INSERT INTO Patient (fiscalCode,isForeign,b_name,surname,"+
    "birthDate,initials,gender,ethnicOrigin,otherEthnicOrigin,"+
    "residenceRegion,residenceCity,residenceProvince,"+
    "cap,r_address,civicNumber,phone,privacyAndConditions,"+
    "privacyPersonalData,diagnosis,neoplasia,familiarity,"+
    "brcaSomaticTest,mutationResult,histology,otherHistology,"+
    "isoTypeOtherDetails,hasReceivedSystemicTreatment,"+
    "platinumSensitive,oncologistNotes,"+
    "allergies,previousTreatments)"+
    "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

const getQuery = "SELECT id,fiscalCode,isForeign,b_name AS 'name',surname,"+
    "birthDate,initials,gender,ethnicOrigin,otherEthnicOrigin,"+
    "residenceRegion,residenceCity,residenceProvince,"+
    "cap,r_address AS 'address',civicNumber,phone,privacyAndConditions,"+
    "privacyPersonalData,diagnosis,neoplasia,familiarity,"+
    "brcaSomaticTest,mutationResult,histology,otherHistology,"+
    "isoTypeOtherDetails,hasReceivedSystemicTreatment,"+
    "platinumSensitive,oncologistNotes,"+
    "allergies,previousTreatments "+
    "FROM Patient WHERE id = ?";

const getPatientsQuery = "SELECT id,fiscalCode,isForeign,b_name AS 'name',surname,"+
    "birthDate,initials,gender,ethnicOrigin,otherEthnicOrigin,"+
    "residenceRegion,residenceCity,residenceProvince,"+
    "cap,r_address AS 'address',civicNumber,phone,privacyAndConditions,"+
    "privacyPersonalData,diagnosis,neoplasia,familiarity,"+
    "brcaSomaticTest,mutationResult,histology,otherHistology,"+
    "isoTypeOtherDetails,hasReceivedSystemicTreatment,"+
    "platinumSensitive,oncologistNotes,"+
    "allergies,previousTreatments "+
    "FROM Patient ";

const getPatientsWithQuery = getPatientsQuery + " WHERE fiscalCode LIKE ? "+
    "OR (CONCAT(CONCAT(b_name,' '),surname) LIKE ? )"

/**
 * Creates a new patient
 * @param {Object} patient Patient data
 * @returns {boolean} If the operation is successfull
 */
async function addPatient(patient) {

    try{
        await conn.query(addQuery,[
            patient.fiscalCode,patient.isForeign,patient.name,
            patient.surname,patient.birthDate,patient.initials,
            patient.gender,patient.ethnicOrigin,patient.otherEthnicOrigin,
            patient.residenceRegion,patient.residenceCity,patient.residenceProvince,
            patient.cap,patient.address,patient.civicNumber,patient.phone,
            patient.privacyAndConditions,patient.privacyPersonalData,
            patient.diagnosis,patient.neoplasia,patient.familiarity,
            patient.brcaSomaticTest,patient.mutationResult,patient.histology,
            patient.otherHistology,patient.isoTypeOtherDetails,
            patient.hasReceivedSystemicTreatment,patient.platinumSensitive,
            patient.oncologistNotes,patient.allergies,patient.previousTreatments
        ])
        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Gets data about a patient
 * @param {string} id Patient ID
 * @returns {Object} Patient data
 */
async function getPatient(id) {
    try{
        const res = await conn.query(getQuery,[id])

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
 * Gets all patients
 * @returns {Object} Patient data
 */
async function getPatients() {
    try{
        const res = await conn.query(getPatientsQuery+" LIMIT 10")

        if(!res)
            return {}

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Gets patients filtered by a query
 * @param {string} query Query for filtering patients
 * @returns {Object} Patient data
 */
async function queryPatients(query) {
    const qid = Number(query);
    try{
        const res = await conn.query(getPatientsWithQuery + " LIMIT 10 ORDER BY id DESC",[
            `%${query}%`,`%${query}%`
        ])

        if(!res)
            return {}

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Checks if a patient exists
 * @param {string} fiscalCode Patient's fiscal code
 * @returns {boolean} If the user exists
 */
async function patientExists(fiscalCode) {
    try{
        const res = await conn.query("SELECT fiscalCode FROM Patient WHERE fiscalCode=?",[fiscalCode])

        return res.length > 0;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    addPatient,
    getPatient,
    getPatients,
    queryPatients,
    patientExists
}