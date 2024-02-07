const { render } = require("ejs")
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
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    managementView,
    classificationList,
    errors: null,
  })
}

/* ***************************
 *  Build the new classification view
 * ************************** */
invCont.buildNewClassification = async function(req, res, next){
  const newClassification = await utilities.buildNewClassificationView()
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add a New Classification",
    nav,
    newClassification,
    errors: null,
  })
}

/* ***************************
 *  Build the new vehicle view
 * ************************** */
invCont.buildNewVehicle = async function(req, res, next){
  const newVehicle = await utilities.buildNewVehicleView()
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add a New Vehicle",
    nav,
    newVehicle,
    errors: null,
  })
}

/* ***************************
 *  ADD A NEW CLASSIFICATION
 * ************************** */
invCont.addNewClassification= async function(req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const classificationResult = await invModel.updateClassifications(classification_name)
  const newClassification = await utilities.buildNewClassificationView()
  const managementView = await utilities.buildManagementView()
  if (classificationResult) {
    nav = await utilities.getNav()
    req.flash(
      "notice",
      `Congratulations, ${classification_name} was registered correctly.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      managementView,
    })
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      newClassification,
      errors: null,
    })
  }
}

/* ***************************
 *  ADD A NEW VEHICLE
 * ************************** */
invCont.addNewVehicle = async function(req, res, next){
  let nav = await utilities.getNav()
  const { classification_id, inv_make, inv_model, inv_year, 
    inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
  const managementView = await utilities.buildManagementView()
  const newVehicle = await utilities.buildNewVehicleView()
  const addVehicleResult = await invModel.updateInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image,
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )
  if (addVehicleResult) {
    req.flash(
      "notice",
      `Congratulations, the vehicle was registered correctly.`
    )
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      managementView,
    })
  } else {
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      newVehicle,
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont