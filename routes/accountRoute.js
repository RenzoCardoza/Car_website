// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController.js")
const utilities = require("../utilities/")

//Route for my account button
router.get("/login", utilities.handleErrors(accController.buildLogin));

module.exports = router;