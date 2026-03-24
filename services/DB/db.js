const {login, addSession, sessionExists} = require('./auth')
const {addPatient, getPatient, patientExists, getPatients} = require('./patient')
const {addSample, getSamples, getSample, setSampleStatus, setShipping, getShipmentSampleId} = require('./sample')
const {addShipping, getShippings, getShipping, setShippingStatus} = require('./shipping')
const {getFacility,getFacilities, getFacilityFromWorkgroup, getWorkgroup, getWorkgroups}  = require('./facility')
const {addReferto, getReferto, getRefertoRes,getRefertoId,addPDF} = require('./referto')
const {getUserWorkgroupID, setUserWorkgroup, addUser, userExists, getUser, getCouriers} = require('./user')

module.exports = {
    login,
    addSession,
    sessionExists,
    addPatient,
    getPatient,
    getPatients,
    patientExists,
    addSample,
    getSamples,
    getSample,
    setSampleStatus,
    setShipping,
    addShipping,
    getShippings,
    getShipping,
    setShippingStatus,
    getShipmentSampleId,
    getFacility,
    getFacilities,
    getFacilityFromWorkgroup,
    getWorkgroup,
    getWorkgroups,
    addReferto,
    getReferto,
    getRefertoRes,
    getRefertoId,
    addPDF,
    addUser,
    getUser,
    getCouriers,
    userExists,
    setUserWorkgroup,
    getUserWorkgroupID
}