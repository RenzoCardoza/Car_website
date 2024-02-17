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

/* ***************************
 *  Update the review to the database
 * ************************** */
async function updateReview(review_text, review_id) {
  try {
    const sql = 
      "UPDATE public.review SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const data = await pool.query(sql, [
      review_text,
      review_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete the review from the database
 * ************************** */
async function deleteReview(review_id) {
  try {
    const sql = 'DELETE FROM review WHERE review_id = $1';
    const data = await pool.query(sql, [ review_id ])
    return data
  } catch (error) {
    console.error("review model error: " + error)
  }
}

/* ***************************
 *  Add a new review to the database
 * ************************** */
async function addNewReview(review_text, inv_id, account_id){
  try {
    const sql = "INSERT INTO public.review (review_text, inv_id, account_id) VALUES ('$1', '$2', '$3')"
    const data = await pool.query(sql, [review_text, inv_id, account_id])
    //return the review added as a check mark
    const test = await pool.query("SELECT * FROM public.review WHERE review_text='$1'", [review_text])
    return test.rows
  } catch (error) {
    console.error("Add New review " + error)
  }
}

module.exports = { getReviewsbyVehicleId, getAccountIdByReviewId, getReviewTextByReviewId,
updateReview, deleteReview, addNewReview }