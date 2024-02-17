const pool = require("../database/")

/* ***************************
 *  Get all reviews by the id of inventory 
 * ************************** */
async function getReviewsbyVehicleId(inventory_id){
    try {
      const data = await pool.query(
        `SELECT r.review_id, r.review_text, TO_CHAR(r.review_date::timestamp, 'yyyy-mm-dd') as date, 
        r.account_id, r.inv_id, a.account_firstname, a.account_lastname 
        FROM public.review AS r 
        JOIN public.account AS a ON r.account_id = a.account_id
        WHERE inv_id='${inventory_id}'
        ORDER BY r.review_date DESC;`
      )
      return data.rows
    } catch (error) {
      console.error("getInventoryId " + error)
    }
}

/* ***************************
 *  Get the account_id by the review_id
 * ************************** */
async function getAccountIdByReviewId(review_id){
  try {
    const data = await pool.query(
      `SELECT account_id FROM public.review WHERE review_id='${review_id}';`
    )
    // console.log(data.rows)
    return data.rows[0].account_id
  } catch (error) {
    console.error("get account id by review id " + error)
  }
}

/* ***************************
 *  Get the review text to be update later or deleted
 * ************************** */
async function getReviewTextByReviewId(review_id){
  try {
    const data = await pool.query(
      `SELECT review_text FROM public.review WHERE review_id=${review_id};`
    )
    return data.rows[0].review_text
  } catch (error) {
    console.error("get text by review id " + error)
  }
}

module.exports = { getReviewsbyVehicleId, getAccountIdByReviewId, getReviewTextByReviewId }