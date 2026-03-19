const conn = require('./config')

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
 * @param {number} id Workgroup ID
 * @returns {Object} The requested Workgroup
 */
async function getWorkgroup(id) {
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
 * @param {number} id Facility ID
 * @returns {Object} The specified facility
 */
async function getFacility(id) {
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
 * @param {number} id Facility ID
 * @returns {Object} The specified facility
 */
async function getFacilities() {
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
 * @param {number} facilityId Facility ID
 * @param {string} wgType Type of workgroup to show ('oncologo','analyst')
 * @returns {Array<Object>} The resulting workgroups
 */
async function getWorkgroups(facilityId,wgType='all') {
    try{
        const res = await conn.query(getWorkgroupsQuery,[facilityId])

        if(wgType === 'all')
            return res
        else
            return res.filter((item)=> item.groupType === wgType);
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