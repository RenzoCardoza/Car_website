const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + ' details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the vehicle details HTML
* ************************************ */
Util.buildVehicleDetails = async function(vehicle){
  // create the container element
  let container = '<div id="vehicle-display">'
  container += `<img src="${vehicle[0].inv_image}" alt="Image of ${vehicle[0].inv_make} ${vehicle[0].inv_model} on CSE Motors">`
  container += `<section id="vehicle-details">`
  container += `<h2 class="vehicle-name">${vehicle[0].inv_make} ${vehicle[0].inv_model} Details</h2>`
  container += '<span class="vehicle-price"><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle[0].inv_price) + '</span>'
  container += `<span class="vehicle-desc"><strong>Description:</strong> ${vehicle[0].inv_description}</span>`
  container += `<span class="vehicle-color"><strong>Color:</strong> ${vehicle[0].inv_color}</span>`
  container += `<span class="vehicle-miles"><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(vehicle[0].inv_miles)}</span>`
  container += `</section>`
  container += `</div>`

  return container
}

/* **************************************
* Build the management view
* ************************************ */
Util.buildManagementView = async function() {
  //Create a container for the elements (two links)
  let container = '<div id="management-links">'
  container += '<a href="/inv/add-classification"><p>Add New Classification</p></a>'
  container += '<a href="/inv/add-vehicle"><p>Add New Vehicle</p></a>'
  container += '</div>'
  return container
}

/* **************************************
* Build the add classification view
* ************************************ */
Util.buildNewClassificationView = async function() {
  //Container for the elements
  let container = '<form id="add-class-frm"  method="post" action="/inv/add-classification">'
  container += '<h3>This field is required</h3>'
  container += '<fieldset id="classification-name">'
  container += '<label class="class-name">'
  container += 'Classification Name'
  container += '<span id="new-class-rules">NAME MUST BE ALPHABETIC CHARACTERS ONLY</span>'
  container += '<input type="text" id="classificationName" name="classification_name" required pattern="^[a-zA-Z]+$">'
  container += '</label>'
  container += '<input type="submit" class="submitBtn" value="Add new classfication">'
  container += '</fieldset>'
  container += '</form>'

  return container
}

/* **************************************
* Build the add vehicle view
* ************************************ */
Util.buildNewVehicleView = async function() {
  //Container for the form 
  let data = await invModel.getClassifications()
  let container = '<form id="add-vehicle-frm" method="post" action="/inv/add-vehicle">'
  container += '<h3>All fields are required</h3>'
  container += '<fieldset id="new-vehicle-data">'
  container += '<label>'
  container += '<span class="vehicle-titles">Classification</span>'
  container += '<select id="classification-selection" name="classification_id" required>' 
  container += '<option value="">--Choose a classification--</option>'
  data.rows.forEach((row) => {
    container += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  container += '</select>'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Make</span>'
  container += '<input type="text" id="invMake" name="inv_make" required pattern="^.{3,}$" placeholder="3 characters minimum">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Model</span>'
  container += '<input type="text" id="invModel" name="inv_model" required pattern="^.{3,}$" placeholder="3 characters minimum">'
  container += '</label>' 
  container += '<label>'
  container += '<span class="vehicle-titles">Description</span>'
  container += '<textarea name="inv_description" rows="8" cols="25" placeholder="Provide a small description of the vehicle" required>'
  container += '</textarea>'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Image Path</span>'
  container += '<input type="text" id="invImage" name="inv_image" required value="/images/vehicles/no-image.png">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Thumbnail Path</span>'
  container += '<input type="text" id="invThumbnail" name="inv_thumbnail" required value="/images/vehicles/no-image-tn.png">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Price</span>'
  container += '<input type="text" id="invPrice" name="inv_price" required pattern="^\\d+(,\\d+)?$" placeholder="Integers or decimal using comma">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Year</span>'
  container += '<input type="text" id="invYear" name="inv_year" required pattern="^(202[0-4]|20[0-1][0-9]|200[0-9]|19[0-9]{2}|[1-9][0-9]{0,2})$" placeholder="4-digit year">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Miles</span>'
  container += '<input type="text" id="invMiles" name="inv_miles" required pattern="^[1-9]\\d*(,\\d+)?$" placeholder="only digits">'
  container += '</label>'
  container += '<label>'
  container += '<span class="vehicle-titles">Color</span>'
  container += '<input type="text" id="invColor" name="inv_color" required placeholder="Color of the vehicle">'
  container += '</label>'
  container += '<input type="submit" class="submitBtn" id="vehicleBtn" value="Add new Vehicle">'
  container += '</fieldset>'
  container += '</form>'

  return container
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

Util.buildClassificationList = async function (){
  // create a variable to secure the elements
  let data = await invModel.getClassifications()
  let container = '<select id="classificationList" name="classification_id" required>'
  container += '<option value="">--Choose a classification--</option>'
  data.rows.forEach((row) => {
    container += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })
  container += '</select>'

  return container
}

/* **************************************
* Build the edit inventory view
* ************************************ */
Util.buildSelections = async function() {
  //Container for the form 
  let data = await invModel.getClassifications()
  let container
  data.rows.forEach((row) => {
    container += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })

  return container
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util