
const getWorkgroupPartialQuery = "SELECT id,groupName,groupType,facility "

const getFacilityPartialQuery = "SELECT "+
                        "id,nome,residenceRegion,"+
                        "residenceCity,residenceProvince,cap,"+
                        "r_address AS 'address',civicNumber ";

const getWorkgroupQuery = getWorkgroupPartialQuery + "FROM WorkGroup WHERE id = ?";

const getWorkgroupsQuery = getWorkgroupPartialQuery+ "FROM WorkGroup WHERE facility = ?"

const getFacilityQuery = getFacilityPartialQuery +
                        "FROM Facility WHERE id = ?"

const getFacilitiesQuery = getFacilityPartialQuery + "FROM Facility"
                        

/**
 * Gets data about the specified workgroup
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Workgroup ID
 * @returns {Object} The requested Workgroup
 */
async function getWorkgroup(conn,id) {
    try{
        const res = await conn.query(getWorkgroupQuery,[id])

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
        const res = await conn.query(getFacilityQuery,[id])

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
 * Gets all the avaliable facilities
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Facility ID
 * @returns {Object} The specified facility
 */
async function getFacilities(conn) {
    try{
        const res = await conn.query(getFacilitiesQuery)

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Gets all the workgroups of a facility (only analyst ones)
 * @param {mariadb.Connection} conn DB connection
 * @param {number} facilityId Facility ID
 * @returns {Array<Object>} The resulting workgroups
 */
async function getWorkgroups(conn,facilityId) {
    try{
        const res = await conn.query(getWorkgroupsQuery,[facilityId])

        return res.filter((item)=> item.groupType === 'analyst');
    }
    catch(error){
        console.log(error)
        return null;
    }
}

module.exports = {
    getFacility,
    getFacilities,
    getWorkgroup,
    getWorkgroups
}