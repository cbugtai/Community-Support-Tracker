function init() {
  // Attach Submit Event to the form
  const form = document.getElementById("volunteer-form");
  form.addEventListener("submit", onSubmit);

  loadFromLocalStorage();
}

/**
 * Handles the form submission.
 * Validates inputs and collects form data.
 */
async function onSubmit(event) {
  event.preventDefault();

  // Form Inputs
  const charityInput = document.getElementById("charity-name");
  const hoursInput = document.getElementById("hours-volunteered");
  const dateInput = document.getElementById("date-volunteered");
  const ratingInput = document.getElementById("experience-rating");

   // Clear previous error messages
   clearErrorMessages();

   // Validate all inputs
   const isValidCharity = validateCharityInput(charityInput);
   const isValidHours = validateHoursInput(hoursInput);
   const isValidDate = validateDateInput(dateInput);
   const isValidRating = validateRatingInput(ratingInput);
 
 // If all validations pass, collect and process form data
 if (isValidCharity && isValidHours && isValidDate && isValidRating) {
  const formData = collectData(
    charityInput.value,
    hoursInput.value,
    dateInput.value,
    ratingInput.value
  );

    updateTable(formData);
    saveToLocalStorage(formData); 
    calculateTotalHours(); 

// Clear the form inputs
    event.target.reset();
  }
}

/**
 * Updates the table with the submitted data.
 * @param {object} formData - The data collected from the form.
 */
function updateTable(formData) {
  const tableBody = document.querySelector("#volunteer-table tbody");
  const newRow = document.createElement("tr");

  newRow.innerHTML = `
    <td>${formData["Charity Name"]}</td>
    <td>${formData["Hours Volunteered"]}</td>
    <td>${formData["Date Volunteered"]}</td>
    <td>${formData["Experience Rating"]}</td>
    <td><button class="delete-btn">Delete</button></td>
  `;

  // Add delete functionality to the button
  newRow.querySelector(".delete-btn").addEventListener("click", () => {
    deleteRow(newRow, formData);
  });

  tableBody.appendChild(newRow);
}

  /**
 * Saves data to localStorage.
 * @param {object} data - The data to save.
 */
function saveToLocalStorage(data) {
  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  logs.push(data);
  localStorage.setItem("volunteerLogs", JSON.stringify(logs));
}

/**
 * Loads data from localStorage and updates the table.
 */
function loadFromLocalStorage() {
  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  logs.forEach((log) => updateTable(log));
  calculateTotalHours();
}

 /**
 * Deletes a row from the table and updates localStorage and the summary.
 * @param {HTMLElement} row - The row to delete.
 * @param {object} logData - The data associated with the row.
 */
function deleteRow(row, logData) {
  row.remove();

  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const updatedLogs = logs.filter(
    (log) =>
      log["Charity Name"] !== logData["Charity Name"] ||
      log["Date Volunteered"] !== logData["Date Volunteered"] ||
      log["Hours Volunteered"] !== logData["Hours Volunteered"]
  );
  localStorage.setItem("volunteerLogs", JSON.stringify(updatedLogs));

  calculateTotalHours();
}

/**
 * Updates the total hours summary based on table data.
 */
function calculateTotalHours() {
  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const totalHours = logs.reduce(
    (sum, log) => sum + parseFloat(log["Hours Volunteered"]),
    0
  );

  document.getElementById("total-hours").innerText = totalHours;
}

/**
 * Validates the Charity Name input.
 * @param {HTMLInputElement} charityInput - Input field for charity name.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateCharityInput(charityInput) {
  if (charityInput.value.trim() === "") {
    showErrorMessage("charity-name-error");
    return false;
  }
  return true;
}


/**
 * Validates the Hours Volunteered input.
 * Ensures value is a positive number.
 * @param {HTMLInputElement} hoursInput - Input field for hours volunteered.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateHoursInput(hoursInput) {
  if (hoursInput.value.trim() === "" || parseFloat(hoursInput.value) <= 0) {
    showErrorMessage("hours-volunteered-error");
    return false;
  }
  return true;
}

/**
 * Validates the Date input.
 * @param {HTMLInputElement} dateInput - Input field for date volunteered.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateDateInput(dateInput) {
  if (dateInput.value.trim() === "") {
    showErrorMessage("date-volunteered-error");
    return false;
  }
  return true;
}

/**
 * Validates the Experience Rating input.
 * Ensures the value is between 1 and 5.
 * @param {HTMLInputElement} ratingInput - Input field for experience rating.
 * @returns {boolean} - True if valid, false otherwise.
 */
function validateRatingInput(ratingInput) {
  const rating = parseInt(ratingInput.value, 10);
  if (
    ratingInput.value.trim() === "" ||
    isNaN(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    showErrorMessage("experience-rating-error");
    return false;
  }
  return true;
}
/**
 * Displays an error message for an invalid input field.
 * @param {string} errorId - The ID of the error message span element.
 */
function showErrorMessage(errorId) {
  const errorElement = document.getElementById(errorId);
  errorElement.style.display = "inline";
}

/**
 * Clears all existing error messages from the form.
 */
function clearErrorMessages() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.style.display = "none";
  });
}

/**
 * Collects validated form data into a temporary object.
 * @param {string} charityName - The name of the charity.
 * @param {string} hours - The number of hours volunteered.
 * @param {string} date - The date of volunteering.
 * @param {string} rating - The experience rating.
 * @returns {object} - Object containing the form data.
 */
function collectData(charityName, hours, date, rating) {
  return {
    "Charity Name": charityName,
    "Hours Volunteered": hours,
    "Date Volunteered": date,
    "Experience Rating": rating,
  };
}

// Initialize on window load
if (typeof window !== "undefined") {
  window.onload = init;
} else {
  module.exports = {
    init,
    onSubmit,
    collectData,
    validateCharityInput,
    validateHoursInput,
    validateDateInput,
    validateRatingInput,
    updateTable,
    saveToLocalStorage,
    loadFromLocalStorage,
    deleteRow,
    calculateTotalHours
  };
}
