// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accController = require("../controllers/accountController.js")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

//Route for my account button
router.get("/login", utilities.handleErrors(accController.buildLogin));

//Route for the registration view
router.get("/register", utilities.handleErrors(accController.buildRegister));
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accController.registerAccount)
)
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLogData,
    utilities.handleErrors(accController.accountLogin)
)

// Route for the default view. Manage account 
router.get("/", utilities.handleErrors(accController.buildManagement))

module.exports = router;