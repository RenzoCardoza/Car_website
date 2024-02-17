const utilities = require(".")
const revModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const { body, validationResult } = require("express-validator")
const validateRev = {}

/*  **********************************
 *  Rules for the review to be post
 * ********************************* */
validateRev.reviewRules = () => {
    return [
        // rules for the textarea on the review
        body("review_text")
            .trim()
            .isLength({ min: 30 })
            .withMessage("Please provide a detailed review on the vehicle."),
    ]
}

/*  **********************************
 *  Check if the review to be posted is correct
 * ********************************* */
validateRev.checkReviewText = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        const vehicleData = await invModel.getInventoryByInventoryId(inv_id)
        const vehicleName = `${vehicleData[0].inv_year} ${vehicleData[0].inv_make} ${vehicleData[0].inv_model}`
        const reviews = await revModel.getReviewsbyVehicleId(inv_id)
        const vehicleView = await utilities.buildVehicleDetails(vehicleData)
        let reviewView
        if (!reviews.length == 0){
            reviewView = await utilities.buildReviews(reviews) // build the utilities
        } else {
            reviewView = `<p id="no-revs-msg">Currently, there are no reviews for this vehicle</p>`
        }
        let nav = await utilities.getNav()
        res.render("inventory/vehicle", {
            errors,
            title: vehicleName,
            nav,
            vehicleView,
            reviewView,
            review_text,
            account_id,
            inv_id,
        })
        return
    }
    next()
}

/*  **********************************
 *  Check if the review to be updated is correct
 * ********************************* */
validateRev.checkUpdateReviewText = async (req, res, next) => {
    const { review_text, inv_id, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/edit-review", {
            errors,
            title: "Update your review",
            nav,
            review_text,
            account_id,
            inv_id,
        })
        return
    }
    next()
}

module.exports = validateRev