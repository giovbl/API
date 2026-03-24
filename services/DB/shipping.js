const conn = require('./config')

const addQuery = "INSERT INTO Shipping("+
                "sender,recipient,"+
                "taken_ext_date,del_date_ext,courier"+
                ") VALUES (?,?,?,?,?) RETURNING id"

const getShippingsQuery = "SELECT id,"+
                        "d_status AS 'status',"+
                        "sender,recipient,"+
                        "taken_ext_date AS expectedTakenDate,"+
                        "del_date_ext AS expectedDeliveryDate,"+
                        "taken_eff AS effectiveTakenDate,"+
                        "del_date_eff AS effectiveDeliveryDate "+
                        "FROM Shipping WHERE courier = ? "

const getShippingQuery = "SELECT id,"+
                        "d_status AS 'status',"+
                        "sender,recipient,"+
                        "taken_ext_date AS expectedTakenDate,"+
                        "del_date_ext AS expectedDeliveryDate,"+
                        "taken_eff AS effectiveTakenDate,"+
                        "del_date_eff AS effectiveDeliveryDate "+
                        "FROM Shipping WHERE id = ? "

/**
 * Adds shipping informations
 * @param {Object} shipping Shipping data
 * @returns {number} The ID of the created shipping
 */
async function addShipping(shipping) {

    try{

        const rows = await conn.query(addQuery,[
            shipping.sender,
            shipping.recipient,
            new Date(shipping.expectedTakenDate),
            new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            shipping.courier
        ])

        return rows[0].id;
    }
    catch(error){
        console.log(error)
        return false;
    }

}

/**
 * Gets all the shippings for the specified courier
 * @param {number} id Courier ID
 * @returns {Array<Object>} Array of shippings
 */
async function getShippings(id) {
    try{
        const res = await conn.query(getShippingsQuery,[id])

        return res;
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Gets data about a shipping
 * @param {number} shippingId Shipping ID
 * @returns {Object} The requested shipping
 */
async function getShipping(shippingId) {
    try{
        const res = await conn.query(getShippingQuery,[shippingId])

        if(!res)
            return null;

        return res[0];
    }
    catch(error){
        console.log(error)
        return null;
    }
}

/**
 * Sets a new status for a shipping
 * @param {number} id Shipping ID
 * @param {string} status New status
 * @returns {boolean} If the operation is successfull
 */
async function setShippingStatus(id,status) {

    try{
        await conn.query("UPDATE Shipping SET d_status = ? WHERE id = ?",
                         [status,id])

        if(status === 'taken')
            await conn.query("UPDATE Shipping SET taken_eff = ? WHERE id = ?",
                         [new Date(Date.now()),id])

        if(status === 'arrived')
            await conn.query("UPDATE Shipping SET del_date_eff = ? WHERE id = ?",
                         [new Date(Date.now()),id])

        return true;
    }
    catch(error){
        console.log(error)
        return false;
    }
}

module.exports = {
    addShipping,
    getShipping,
    getShippings,
    setShippingStatus
}