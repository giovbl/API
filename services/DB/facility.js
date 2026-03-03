
/**
 * Gets data about the spcified facility
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

module.exports = {
    getFacility
}