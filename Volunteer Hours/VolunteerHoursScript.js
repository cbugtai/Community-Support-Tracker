function init() {
  // Attach Submit Event to the form
  const form = document.getElementById("volunteer-form");
  form.addEventListener("submit", onSubmit);
}

/**
 * Handles the form submission.
 * Validates inputs and collects form data.
 */
async function onSubmit(event) {
  // Form Inputs
  const charityInput = document.getElementById("charity-name");
  const hoursInput = document.getElementById("hours-volunteered");
  const dateInput = document.getElementById("date-volunteered");
  const ratingInput = document.getElementById("experience-rating");

  event.preventDefault();
  await clearErrorMessages();

  // Validate all inputs
  const charityValid = await validateCharityInput(charityInput);
  const hoursValid = await validateHoursInput(hoursInput);
  const dateValid = await validateDateInput(dateInput);
  const ratingValid = await validateRatingInput(ratingInput);

  // If all validations pass, collect and log form data
  if (charityValid && hoursValid && dateValid && ratingValid) {
    const formData = collectData(
      charityInput.value,
      hoursInput.value,
      dateInput.value,
      ratingInput.value
    );

    console.log("Form Submitted Successfully:", formData);
  }
}

/**
 * Validates the Charity Name input.
 * @param {HTMLInputElement} charityInput - Input field for charity name.
 * @returns {boolean} - True if valid, false otherwise.
 */
async function validateCharityInput(charityInput) {
  let isValid = false;

  if (charityInput.value.trim() !== "") {
    isValid = true;
  } else {
    try {
      showInputError(charityInput, "*Charity Name cannot be blank");
    } catch {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Validates the Hours Volunteered input.
 * Ensures value is a positive number.
 * @param {HTMLInputElement} hoursInput - Input field for hours volunteered.
 * @returns {boolean} - True if valid, false otherwise.
 */
async function validateHoursInput(hoursInput) {
  let isValid = false;

  if (hoursInput.value.trim() !== "") {
    if (hoursInput.value > 0) {
      isValid = true;
    } else {
      try {
        showInputError(hoursInput, "*Hours must be greater than 0");
      } catch {
        isValid = false;
      }
    }
  } else {
    try {
      showInputError(hoursInput, "*Hours cannot be blank");
    } catch {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Validates the Date input.
 * @param {HTMLInputElement} dateInput - Input field for date volunteered.
 * @returns {boolean} - True if valid, false otherwise.
 */
async function validateDateInput(dateInput) {
  let isValid = false;

  if (dateInput.value.trim() !== "") {
    isValid = true;
  } else {
    try {
      showInputError(dateInput, "*Date cannot be blank");
    } catch {
      isValid = false;
    }
  }

  return isValid;
}

/**
 * Validates the Experience Rating input.
 * Ensures the value is between 1 and 5.
 * @param {HTMLInputElement} ratingInput - Input field for experience rating.
 * @returns {boolean} - True if valid, false otherwise.
 */
async function validateRatingInput(ratingInput) {
  let isValid = false;

  if (ratingInput.value.trim() !== "") {
    const rating = Number(ratingInput.value);
    if (rating >= 1 && rating <= 5) {
      isValid = true;
    } else {
      try {
        showInputError(ratingInput, "*Rating must be between 1 and 5");
      } catch {
        isValid = false;
      }
    }
  } else {
    try {
      showInputError(ratingInput, "*Rating cannot be blank");
    } catch {
      isValid = false;
    }
  }

  return isValid;
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
  const errorMessages = Array.from(
    document.getElementsByClassName("error-message")
  );
  errorMessages.forEach((element) => {
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
  const formData = {
    "Charity Name": charityName,
    "Hours Volunteered": hours,
    "Date Volunteered": date,
    "Experience Rating": rating,
  };

  return formData;
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
