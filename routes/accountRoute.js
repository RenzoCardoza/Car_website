// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController.js")
const utilities = require("../utilities/")

//Route for my account button
router.get("/login", utilities.handleErrors(accController.buildLogin));

//Route for the registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));
router.post('/register', utilities.handleErrors(accController.registerAccount));

module.exports = router;