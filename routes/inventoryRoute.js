// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");
const validateInv = require("../utilities/inventory-validation");
const validateRev = require("../utilities/review-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for the classification view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the vehicle details by the inventory Id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

// Route to get the view for the update review 
router.get(
    "/editReview/:reviewId", 
    utilities.checkLogin,
    utilities.checkReviewIdToAccount,
    utilities.handleErrors(invController.buildEditReview));

// Route to get the delete review view
router.get(
    "/deleteReview/:reviewId",
    utilities.checkLogin,
    utilities.checkReviewIdToAccount,
    utilities.handleErrors(invController.buildDeleteReview)
);

// Route to get the management view
router.get(
    "/", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildManagement));

// Route to add a new classification
router.get(
    "/add-classification", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildNewClassification));

// Route to add a vehicle
router.get(
    "/add-vehicle", 
    utilities.checkLogin,
    utilities.checkAccountType,
    utilities.handleErrors(invController.buildNewVehicle));

// process the add new classification
router.post(
    "/add-classification", 
    validateInv.checkNewClass(),
    validateInv.checkClassData,
    utilities.handleErrors(invController.addNewClassification)
);

// process the add new inventory item
router.post(
    "/add-vehicle", 
    validateInv.vehicleRules(),
    validateInv.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

// Route for the edit inventory
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory));

// Route for the inventory update
router.post(
    "/update/", 
    validateInv.updateRules(),
    validateInv.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

//Route for the inventory delete
router.get("/delete/:inventoryId", utilities.handleErrors(invController.buildDeleteInventory));

//Route for the post method to delete de item
router.post("/delete/", utilities.handleErrors(invController.deleteInventory));

// Route for the post method of posting a new review
router.post(
    "/postReview/",
    validateRev.reviewRules(),
    validateRev.checkReviewText,
    utilities.handleErrors(invController.postReview)
);

// Route for the post method of editing a review 
router.post(
    "/updateReview/",
    validateRev.reviewRules(),
    validateRev.checkUpdateReviewText,
    utilities.handleErrors(invController.editReview)
);

// Route for the post method of deleting a review 
router.post("/deleteReview/", utilities.handleErrors(invController.deleteReview));

module.exports = router;