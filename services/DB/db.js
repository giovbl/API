const mariadb = require('mariadb');

const {login, addSession, sessionExists} = require('./auth')
const {addPatient, getPatient, patientExists} = require('./patient')
const {addSample, getSamples, getSample, setSampleStatus, setShipping} = require('./sample')
const {addShipping, getShippings, getShipping, setShippingStatus} = require('./shipping')
const {getFacility,getFacilities, getWorkgroup,getWorkgroups}  = require('./facility')
const {addReferto, getReferto, getRefertoRes,getRefertoId,addPDF} = require('./referto')
const {getUserWorkgroupID, setUserWorkgroup, addUser, userExists} = require('./user')

/**
 * Creates a DB session
 * @returns {mariadb.Connection} the created session
 */
async function connect(){
    return await mariadb.createPool({
        host: process.env.MARIADB_HOST,
        user: process.env.MARIADB_USER,
        database: process.env.MARIADB_DB,
        password: process.env.MARIADB_USER_PWD
    }).getConnection();
}

/**
 * Closes a DB session
 * @param {mariadb.Connection} conn DB session
 */
function disconnect(conn) {
    conn.release();
}

module.exports = {
    connect,
    disconnect,
    login,
    addSession,
    sessionExists,
    addPatient,
    getPatient,
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
    getFacility,
    getFacilities,
    getWorkgroup,
    getWorkgroups,
    addReferto,
    getReferto,
    getRefertoRes,
    getRefertoId,
    addPDF,
    addUser,
    userExists,
    setUserWorkgroup,
    getUserWorkgroupID
}