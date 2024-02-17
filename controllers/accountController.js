const utilities = require("../utilities/")
const accModel = require("../models/account-model")
const revModel = require("../models/review-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  
  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  } 
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
async function buildManagement(req, res, next) {
  let nav = await utilities.getNav()
  const reviews = await revModel.getReviewsByAccountId(res.locals.accountData.account_id)
  const reviewByAccount = await utilities.buildReviews(reviews)
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    reviewByAccount,
  })
}

/* ****************************************
*  Deliver the update account info view
* *************************************** */
async function buildUpdateAccount(req, res, next){
  let nav = await utilities.getNav()
  let accountId = req.params.accountId
  res.render("account/update-account", {
    title: "Update account information",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process the informations update for the account
* *************************************** */
async function accInfoUpdate(req, res){
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  const updateResult = await accModel.updateAccountInfos(account_firstname, 
    account_lastname, account_email, account_id)
  
  if (updateResult) {
    const accountData = await accModel.getAccountById(account_id)
    req.flash("notice", `Informations were successfully updated.`)
    req.flash("notice", `${accountData.account_firstname} ${accountData.account_lastname}, ${accountData.account_email}`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
    title: "Update Account Informations",
    nav,
    errors: null,
    account_firstname,
    account_lastname,
    account_email,
    })
  }
}

/* ****************************************
*  Process the password update for the account
* *************************************** */
async function accPasswordUpdate(req, res){
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the update.')
    res.status(500).render("account/update-account", {
      title: "Update account information",
      nav,
      errors: null,
    })
  }

  const updateResult = await accModel.updateAccountPassword(hashedPassword, account_id)
  if (updateResult) {
    req.flash("notice", `Pasword was successfully updated.`)
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update-account", {
    title: "Update Account Informations",
    nav,
    errors: null,
    account_password,
    })
  }
}

//Process the logout for the page
async function logoutAction(req, res, next){
  res.clearCookie("jwt")
  req.flash("notice", "Logged Out Successfully")
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, 
  registerAccount, buildUpdateAccount, 
  accountLogin, buildManagement, accInfoUpdate, 
  accPasswordUpdate, logoutAction }