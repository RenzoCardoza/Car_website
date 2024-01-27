// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build the vehicle details by the inventory Id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

module.exports = router;