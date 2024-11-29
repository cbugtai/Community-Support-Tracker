
const form = document.getElementById("volunteer-form");
const charityInput = document.getElementById("charity-name");
const hoursInput = document.getElementById("hours-volunteered");
const dateInput = document.getElementById("date-volunteered");
const ratingInput = document.getElementById("experience-rating");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await clearErrorMessages();
  let isFormValid = await validateForm();
  if (isFormValid) {
      collectData(
          charityNameInput.value,
          hoursInput.value,
          dateInput.value,
          ratingInput.value
      );
  }
});


async function validateForm() {
  let isFormValid = false;

  const charityNameValid = await validateCharityNameInput();
  const hoursValid = await validateHoursInput();
  const dateValid = await validateDateInput();
  const ratingValid = await validateRatingInput();

  if (charityNameValid && hoursValid && dateValid && ratingValid) {
      isFormValid = true;
  }

  return isFormValid;
}


async function validateCharityNameInput() {
  let isCharityNameValid = false;

  if (charityNameInput.value.trim() !== "") {
      isCharityNameValid = true;
  } else {
      showInputError(charityNameInput, "*Charity Name cannot be blank");
  }

  return isCharityNameValid;
}


async function validateHoursInput() {
  let isHoursValid = false;

  if (hoursInput.value.trim() !== "") {
      if (hoursInput.value > 0) {
          isHoursValid = true;
      } else {
          showInputError(hoursInput, "*Hours must be greater than 0");
      }
  } else {
      showInputError(hoursInput, "*Hours cannot be blank");
  }

  return isHoursValid;
}


async function validateDateInput() {
  let isDateValid = false;

  if (dateInput.value.trim() !== "") {
      isDateValid = true;
  } else {
      showInputError(dateInput, "*Date cannot be blank");
  }

  return isDateValid;
}


async function validateRatingInput() {
  let isRatingValid = false;

  if (ratingInput.value.trim() !== "") {
      const rating = Number(ratingInput.value);
      if (rating >= 1 && rating <= 5) {
          isRatingValid = true;
      } else {
          showInputError(ratingInput, "*Rating must be between 1 and 5");
      }
  } else {
      showInputError(ratingInput, "*Rating cannot be blank");
  }

  return isRatingValid;
}

function showInputError(inputElement, message) {
  const errorDisplay = document.createElement("span");
  errorDisplay.innerText = message;
  errorDisplay.className = "error-message";
  errorDisplay.setAttribute("role", "alert");

  inputElement.parentElement.appendChild(errorDisplay);
}

async function clearErrorMessages() {
  let errorMessages = Array.from(document.getElementsByClassName("error-message"));
  errorMessages.forEach((element) => {
      element.remove();
  });
}

function collectData(charityName, hours, date, rating) {
  let formData = {
      "Charity Name": charityName,
      "Hours Volunteered": hours,
      "Date Volunteered": date,
      "Experience Rating": rating,
  };

  console.log("Form Submitted Successfully:", formData);
}


