
/**
 * Gets data about the specified workgroup
 * @param {mariadb.Connection} conn 
 * @param {number} id Workgroup ID
 * @returns {Object} The requested Workgroup
 */
async function getWorkgroup(conn,id) {
    try{
        const res = await conn.query("SELECT * FROM WorkGroup WHERE id = ?",[id])

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
 * Gets data about the specified facility
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Facility ID
 * @returns {Object} The specified facility
 */
async function getFacility(conn,id) {
    try{
        const res = await conn.query("SELECT * FROM Facility WHERE id = ?",[id])

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
 * Gets all the workgroups of a facility
 * @param {mariadb.Connection} conn DB connection
 * @param {number} facilityId Facility ID
 * @returns {Array<Object>} The resulting workgroups
 */
async function getWorkgroups(conn,facilityId) {
    try{
        const res = await conn.query("SELECT * FROM WorkGroup WHERE facility = ?",[facilityId])

        return res.filter((item)=> item.type === 'analyst');
    }
    catch(error){
        console.log(error)
        return null;
    }
}

module.exports = {
    getFacility,
    getWorkgroup,
    getWorkgroups
}