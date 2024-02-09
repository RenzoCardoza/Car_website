// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/");
const validateInv = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for the classification view
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to build the vehicle details by the inventory Id
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInvId));

// Route to get the management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to add a new classification
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));

// Route to add a vehicle
router.get("/add-vehicle", utilities.handleErrors(invController.buildNewVehicle));

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
router.get("/edit/:inventoryId", utilities.handleErrors(invController.buildEditInventory))

// Route for the inventory update
router.post(
    "/update/", 
    validateInv.vehicleRules(),
    validateInv.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

module.exports = router;