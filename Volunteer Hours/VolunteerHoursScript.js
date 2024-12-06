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

  await clearErrorMessages();

  // Validate all inputs
  const inputsValid = await Promise.all([
    validateCharityInput(charityInput),
    validateHoursInput(hoursInput),
    validateDateInput(dateInput),
    validateRatingInput(ratingInput),
  ]);

  // If all validations pass, collect and log form data
  if (inputsValid.every((isValid) => isValid)) {
    const formData = collectData(
      charityInput.value,
      hoursInput.value,
      dateInput.value,
      ratingInput.value
    );

    console.log("Form Submitted Successfully:", formData);
    updateTable(formData);
    saveToLocalStorage(formData); 
    updateTotalHours(); 

// Clear the form inputs
    form.reset();
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
    deleteRow(newRow, formData["Hours Volunteered"]);
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
  updateTotalHours();
}

 /**
 * Deletes a row from the table and updates localStorage and the summary.
 * @param {HTMLElement} row - The row to delete.
 * @param {string} hours - The hours associated with the row.
 */
function deleteRow(row, hours) {
  const tableBody = document.querySelector("#volunteer-table tbody");
  tableBody.removeChild(row);

  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const updatedLogs = logs.filter(
    (log) => log["Hours Volunteered"] !== hours
  );
  localStorage.setItem("volunteerLogs", JSON.stringify(updatedLogs));

  updateTotalHours();
}

/**
 * Updates the total hours summary based on table data.
 */
function updateTotalHours() {
  const logs = JSON.parse(localStorage.getItem("volunteerLogs")) || [];
  const totalHours = logs.reduce(
    (sum, log) => sum + parseInt(log["Hours Volunteered"], 10),
    0
  );

  document.getElementById("total-hours").innerText = totalHours;
}


/**
 * Validates the Charity Name input.
 * @param {HTMLInputElement} charityInput - Input field for charity name.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
async function validateCharityInput(charityInput) {
  return validateInputField(charityInput, "*Charity Name cannot be blank");
}

/**
 * Validates the Hours Volunteered input.
 * Ensures value is a positive number.
 * @param {HTMLInputElement} hoursInput - Input field for hours volunteered.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
async function validateHoursInput(hoursInput) {
  if (hoursInput.value.trim() === "" || hoursInput.value <= 0) {
    showInputError(
      hoursInput,
      "*Hours Volunteered must be greater than 0 and not blank"
    );
    return false;
  }
  return true;
}

/**
 * Validates the Date input.
 * @param {HTMLInputElement} dateInput - Input field for date volunteered.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
async function validateDateInput(dateInput) {
  return validateInputField(dateInput, "*Date cannot be blank");
}

/**
 * Validates the Experience Rating input.
 * Ensures the value is between 1 and 5.
 * @param {HTMLInputElement} ratingInput - Input field for experience rating.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
async function validateRatingInput(ratingInput) {
  const rating = Number(ratingInput.value);
  if (ratingInput.value.trim() === "" || rating < 1 || rating > 5) {
    showInputError(ratingInput, "*Rating must be between 1 and 5");
    return false;
  }
  return true;
}

/**
 * validation for input fields.
 * @param {HTMLInputElement} inputElement - The input field to validate.
 * @param {string} errorMessage - The error message to display if invalid.
 * @returns {Promise<boolean>} - True if valid, false otherwise.
 */
async function validateInputField(inputElement, errorMessage) {
  if (inputElement.value.trim() === "") {
    showInputError(inputElement, errorMessage);
    return false;
  }
  return true;
}

/**
 * Displays an error message for an invalid input field.
 * @param {HTMLInputElement} inputElement - The input field with an error.
 * @param {string} message - The error message to display.
 */
function showInputError(inputElement, message) {
  const errorDisplay = document.createElement("span");
  errorDisplay.innerText = message;
  errorDisplay.className = "error-message";
  errorDisplay.setAttribute("role", "alert");

  inputElement.parentElement.appendChild(errorDisplay);
}

/**
 * Clears all existing error messages from the form.
 */
async function clearErrorMessages() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.remove();
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
    collectData,
    validateCharityInput,
    validateHoursInput,
    validateDateInput,
    validateRatingInput,
    showInputError,
  };
}
