const mariadb = require('mariadb');

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

/**
 * Creates a new patient
 * @param {mariadb.Connection} conn DB connection
 * @param {Object} patient Patient data
 * @returns {boolean} If the operation is successfull
 */
async function addPatient(conn,patient) {

    try{
        await conn.query(addQuery,[
            patient.fiscalCode,patient.isForeign,patient.b_name,
            patient.surname,patient.birthDate,patient.initials,
            patient.gender,patient.ethnicOrigin,patient.otherEthnicOrigin,
            patient.residenceRegion,patient.residenceCity,patient.residenceProvince,
            patient.cap,patient.r_address,patient.civicNumber,patient.phone,
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
 * Creates a new patient
 * @param {mariadb.Connection} conn DB connection
 * @returns {Object} patient Patient data
 */
async function getPatient(conn,fiscalCode) {
    try{
        const res = await conn.query("SELECT * FROM Patient WHERE fiscalCode = ?",[fiscalCode])

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
    addPatient,
    getPatient
}