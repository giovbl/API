
async function getUserWorkgroupID(conn,id) {

    try{
        const res = await conn.query(
                        "SELECT workgroup FROM User "+
                        "WHERE id = ?",[id])

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
    getUserWorkgroupID
}