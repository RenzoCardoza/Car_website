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
    (req, res) => {
      res.status(200).send('login process')
    }
)
module.exports = router;