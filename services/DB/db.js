const {login, addSession, sessionExists} = require('./auth')
const {addPatient, getPatient, patientExists, getPatients, queryPatients} = require('./patient')
const {addSample, getSamples, getSample, setSampleStatus, setShipping, getShipmentSampleId, querySamples} = require('./sample')
const {addShipping, getShippings, getShipping, setShippingStatus, queryShipments} = require('./shipping')
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
    queryPatients,
    addSample,
    getSamples,
    getSample,
    setSampleStatus,
    querySamples,
    setShipping,
    addShipping,
    getShippings,
    getShipping,
    setShippingStatus,
    getShipmentSampleId,
    queryShipments,
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