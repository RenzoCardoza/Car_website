const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("#vehicleBtn")
      updateBtn.removeAttribute("disabled")
    })