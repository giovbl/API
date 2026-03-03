const addQuery = "INSERT INTO Shipping("+
                "d_status,sender,recipient,"+
                "taken_ext_date,del_date_ext,courier"+
                ") VALUES (?,?,?,?,?,?)"

/**
 * Adds shipping informations
 * @param {mariadb.Connection} conn DB connection
 * @param {Object} shipping Shipping data
 * @returns {boolean} If the operation is successfull
 */
async function addShipping(conn,shipping) {

    try{
        await conn.query(addQuery,[
            shipping.d_status,shipping.sender,
            shipping.recipient,shipping.taken_ext_date,
            shipping.del_date_ext,shipping.courier
        ])
        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Gets all the shippings for the specified courier
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Courier ID
 * @returns {Array<Object>} Array of shippings
 */
async function getShippings(conn,id) {
    try{
        const res = await conn.query("SELECT * FROM Shipping WHERE courier = ?",[id])

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Sets a new status for a shipping
 * @param {mariadb.Connection} conn DB connection
 * @param {number} id Shipping ID
 * @param {string} status New status
 * @returns {boolean} If the operation is successfull
 */
async function setShippingStatus(conn,id,status) {

    try{
        await conn.query("UPDATE Shipping SET d_status = ? WHERE id = ?",
                         [status,id])

        if(status === 'taken')
            await conn.query("UPDATE Shipping SET taken_eff = ? WHERE id = ?",
                         [Date.now(),id])

        if(status === 'arrived')
            await conn.query("UPDATE Shipping SET del_date_eff = ? WHERE id = ?",
                         [Date.now(),id])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    addShipping,
    getShippings,
    setShippingStatus
}