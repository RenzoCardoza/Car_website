const pool = require("../database/")

/* ***************************
 *  Get all reviews by the id of inventory 
 * ************************** */
async function getReviewsbyVehicleId(inventory_id){
    try {
      const data = await pool.query(
        `SELECT r.review_text, TO_CHAR(r.review_date::timestamp, 'yyyy-mm-dd') as date, 
        r.account_id, r.inv_id, a.account_firstname, a.account_lastname 
        FROM public.review AS r 
        JOIN public.account AS a ON r.account_id = a.account_id
        WHERE inv_id='${inventory_id}'
        ORDER BY r.review_date DESC;`
      )
      console.log(data.rows)
      return data.rows
    } catch (error) {
      console.error("getInventoryId " + error)
    }
}

module.exports = { getReviewsbyVehicleId }