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
    console.error("getInventoryId error" + error)
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

async function updateInventory(inv_make, inv_model, inv_year, inv_description,
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
      console.error("Update inventory " + error)
    }
  }


module.exports = {getClassifications, 
  getInventoryByClassificationId, 
  getInventoryByInventoryId, 
  updateClassifications, updateInventory};