const { render } = require("ejs")
const invModel = require("../models/inventory-model")
const revModel = require("../models/review-model")
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
  const reviews = await revModel.getReviewsbyVehicleId(inv_id)
  const vehicleView = await utilities.buildVehicleDetails(data)
  let reviewView
  if (!reviews.length == 0){
    reviewView = await utilities.buildReviews(reviews) // build the utilities
  } else {
    reviewView = `<p id="no-revs-msg">Currently, there are no reviews for this vehicle</p>`
  }
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/vehicle", {
    title: vehicleName,
    nav,
    vehicleView,
    reviewView,
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
  const addVehicleResult = await invModel.addNewInventory(
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  // const inv_id = parseInt(req.params.inv_id)
  const inv_id = req.params.inventoryId
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  const selections = await utilities.buildSelections()
  console.log(itemData)
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    selections,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id, inv_make,
    inv_model, inv_description,
    inv_image, inv_thumbnail,
    inv_price, inv_year,
    inv_miles, inv_color,
    classification_id, } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, 
    inv_model, inv_year, 
    inv_description, inv_image, 
    inv_thumbnail, inv_price, 
    inv_miles, inv_color, 
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async function (req, res, next) {
  // const inv_id = parseInt(req.params.inv_id)
  const inv_id = req.params.inventoryId
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByInventoryId(inv_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_price: itemData[0].inv_price,
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_id, inv_make, inv_model } = req.body
  const deleteResult = await invModel.deleteInventory(inv_id)

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The item was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    })
  }
}

// Function to build the edit reviews view
invCont.buildEditReview = async function (req, res, next) {
  const review_id = req.params.reviewId
  const review_text = await revModel.getReviewTextByReviewId(review_id)
  let nav = await utilities.getNav()
  res.render("./inventory/edit-review", {
    title: "Edit Review",
    nav,
    errors: null,
    review_text,
  })
}

// Function to build the delete reviews view
invCont.buildDeleteReview = async function (req, res, next) {
  const review_id = req.params.reviewId
  const review_text = await revModel.getReviewTextByReviewId(review_id)
  let nav = await utilities.getNav()
  res.render("./inventory/delete-review", {
    title: "Delete Review",
    nav,
    errors: null,
    review_text,
  })
}

// Function to post a new review ---- TEST THIS FIRST 
invCont.postReview = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { review_text, inv_id, account_id } = req.body
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const vehicleView = await utilities.buildVehicleDetails(data)
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`

  // add the review to the database
  const addReviewResult = await revModel.addNewReview(review_text, inv_id, account_id)
  if (addReviewResult) {
    const reviews = await revModel.getReviewsbyVehicleId(inv_id)
    let reviewView
    if (!reviews.length == 0){
      reviewView = await utilities.buildReviews(reviews)
    } else {
      reviewView = `<p id="no-revs-msg">Currently, there are no reviews for this vehicle</p>`
    }
    req.flash(
    "notice",
    `Congratulations, the review was registered correctly.`
    )
    res.status(201).render("inventory/vehicle", {
      title: vehicleName,
      nav,
      vehicleView,
      reviewView,
      errors: null,
    })
  } else {
    const reviews = await revModel.getReviewsbyVehicleId(inv_id)
    let reviewView
    if (!reviews.length == 0){
      reviewView = await utilities.buildReviews(reviews)
    } else {
      reviewView = `<p id="no-revs-msg">Currently, there are no reviews for this vehicle</p>`
    }
    req.flash("notice", "Sorry, something went wrong")
    res.status(501).render("inventory/vehicle", {
      title: vehicleName,
      nav,
      errors: null,
      vehicleView,
      reviewView,
      review_text,
      inv_id,
      account_id,
    })
  }
}

/* ***************************
 *  Update Review on the database
 * ************************** */
invCont.editReview = async function (req, res, next) {
  const review_id = req.params.reviewId
  let nav = await utilities.getNav()
  const { review_text, inv_id } = req.body
  const updateResult = await revModel.updateReview(review_text, review_id)

  if (updateResult) {
    req.flash("notice", `The review was successfully updated.`)
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-review", {
    title: "Update your review",
    nav,
    errors: null,
    review_text,
    })
  }
}

/* ***************************
 *  Delete Review on the database
 * ************************** */
invCont.deleteReview = async function (req, res, next) {
  const review_id = req.params.reviewId
  let nav = await utilities.getNav()
  const deleteResult = await revModel.deleteReview(review_id)

  if (deleteResult) {
    req.flash("notice", `The deletion was successfully.`)
    res.redirect(`/inv/detail/${inv_id}`)
  } else {
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-review", {
    title: "Delete your review",
    nav,
    errors: null,
    review_text,
    })
  }
}

module.exports = invCont