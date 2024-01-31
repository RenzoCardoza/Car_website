// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accController")
const utilities = require("../utilities/")

//Route for my account button
router.get("/account/:login", utilities.handleErrors(accController.buildLogin));

module.exports = router;