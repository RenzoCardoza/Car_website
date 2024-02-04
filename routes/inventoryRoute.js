// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the vehicle details by the inventory Id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

// Route to get the management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add a new classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

// Route to add a vehicle
router.get("/add-vehicle", utilities.handleErrors(invController.buildNewVehicle));

module.exports = router;