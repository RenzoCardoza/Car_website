const invModel = require("../models/inventory-model")
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
  container += '<a href=""><p>Add New Classification</p></a>'
  container += '<a href=""><p>Add New Vehicle</p></a>'

  return container
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util