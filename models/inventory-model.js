const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
}

// Get all the info on one specific item on the inventory
async function getInventoryByInventoryId(inventory_id){
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id='${inventory_id}'`
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryId " + error)
  }
}

// POST (update the db with some info from management)
async function updateClassifications(classification_name){
  try {
    const data = await pool.query(
      `INSERT INTO public.classification (classification_name) VALUES('${classification_name}')`
    )
    const test = await pool.query(
      `SELECT * FROM public.classification WHERE classification_name='${classification_name}'`
    )
    return test.rows
  } catch (error) {
    console.error("Update classification error" + error)
  }
}

// Function to add new items to the inventory
async function addNewInventory(inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
      const inv = await pool.query(
        `INSERT INTO 
          public.inventory (inv_make, 
            inv_model, 
            inv_year,
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price, 
            inv_miles, 
            inv_color, 
            classification_id)
        VALUES ('${inv_make}',
        '${inv_model}', 
        '${inv_year}',
        '${inv_description}', 
        '${inv_image}', 
        '${inv_thumbnail}',
        '${inv_price}',
        '${inv_miles}',
        '${inv_color}',
        '${classification_id}')`
      )
      const test = await pool.query(
        `SELECT * FROM public.inventory WHERE inv_make='${inv_make}'`
      )
      return test.rows
    } catch (error) {
      console.error("Add new inventory " + error)
    }
}

//Check if classification exists withing the DB
async function checkExistingClassification(classification_name){
  try {
    const sql = "SELECT * FROM public.classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

// function to update an existing item 
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try {
      const sql = 
        "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
      const data = await pool.query(sql, [
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
        inv_id
      ])
      return data.rows[0]
    } catch (error) {
      console.error("model error: " + error)
    }
}

// function to delete an item from the DB
async function deleteInventory(inv_id){
    try {
      const sql = 'DELETE FROM inventory WHERE inv_id = $1';
      const data = await pool.query(sql, [ inv_id ])
      return data
    } catch (error) {
      console.error("model error: " + error)
    }
}



module.exports = {getClassifications, 
  getInventoryByClassificationId, 
  getInventoryByInventoryId, 
  updateClassifications, updateInventory, addNewInventory,
  checkExistingClassification, deleteInventory};