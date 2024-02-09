const utilities = require(".")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validateInv = {}

/* ******************************
 * Check data for new classification 
 * ***************************** */
validateInv.checkNewClass = () => {
    return [
        // classification must be at least 3 characters and a string
        body("classification_name")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a correct classification.") // on error this message is sent.
            .custom(async (classification_name) => {
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists){
                throw new Error("Classification exists. Please use a different name")
            }
        })
    ]
}
  
// Validate the entry on new classification input element
validateInv.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const newClassification = await utilities.buildNewClassificationView()
      res.render("inventory/add-classification", {
        errors,
        title: "Add New Classification",
        nav,
        newClassification,
        classification_name,
      })
      return
    }
    next()
}

// rules for the vehicle check on the vehicle inventory add page
validateInv.vehicleRules = () => {
    return [
        // inv_make must be a 3 characters minimum
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide an inventory make."), // on error this message is sent.

        // the model must be at least 3 characters in lenght
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid model."), // on error this message is sent.

        // a valid description is required 
        body("inv_description")
            .trim()    
            .isEmpty()
            .withMessage("A description is required."), // on error this message is sent
            
        // price validation - take away the commas 
        body("inv_price")
            .trim()
            .isEmpty()
            .withMessage("Please enter a valid price number."), // on error this message is sent
        
        body("inv_year")
            .trim()
            .isLength({ max: 4 })
            .withMessage("Please provide a valid year."), // on error this message is sent.
        
        body("inv_miles")
            .trim()
            .isEmpty()  
            .withMessage("Please enter the miles for the vehicle."), // on error this message is sent.         
        
        body("inv_color")
            .trim()
            .isEmpty()
            .withMessage("Please enter a valid color."), // on error this message is sent.
    ]
}

// rules for the vehicle check on the vehicle inventory add page
validateInv.updateRules = () => {
    return [
        // inv_make must be a 3 characters minimum
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide an inventory make."), // on error this message is sent.

        // the model must be at least 3 characters in lenght
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid model."), // on error this message is sent.

        // a valid description is required 
        body("inv_description")
            .trim()    
            .isLength({ max: 255})
            .withMessage("A description is required."), // on error this message is sent
            
        // price validation - take away the commas 
        body("inv_price")
            .trim()
            .isNumeric()
            .withMessage("Please enter a valid price number."), // on error this message is sent
        
        body("inv_year")
            .trim()
            .isLength({ min: 4 })
            .withMessage("Please provide a valid year."), // on error this message is sent.
        
        body("inv_miles")
            .trim()
            .isNumeric()  
            .withMessage("Please enter the miles for the vehicle."), // on error this message is sent.         
        
        body("inv_color")
            .trim()
            .isLength({max: 15})
            .withMessage("Please enter a valid color."), // on error this message is sent.
    ]
}

//validate the entry of the add inventory site
validateInv.checkVehicleData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const newVehicle = await utilities.buildNewVehicleView()
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Vehicle",
        nav,
        newVehicle,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles, 
        inv_color
      })
      return
    }
    next()
}

//validate the entry of the update form 
validateInv.checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color,
    inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      res.render("inventory/edit-inventory", {
        errors,
        title: `Edit ${inv_make} ${inv_model}`,
        nav,
        classificationSelect: classificationSelect,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_price,
        inv_year,
        inv_miles, 
        inv_color,
        inv_id
      })
      return
    }
    next()
}

module.exports = validateInv