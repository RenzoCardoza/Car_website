const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by inv ID
 * ************************** */
invCont.buildByInvId = async function(req, res, next){
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const vehicleView = await utilities.buildVehicleDetails(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    vehicleView,
    errors: null,
  })
}

/* ***************************
 *  Build the management view
 * ************************** */
invCont.buildManagement = async function(req, res, next){
  const managementView = await utilities.buildManagementView()
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    managementView,
    errors: null,
  })
}

module.exports = invCont