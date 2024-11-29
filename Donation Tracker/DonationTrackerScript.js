// Variables
const form = document.getElementById("donation-form");

// Submit Event
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await clearErrorMessages()
    let isFormValid = await validateForm();
    if (isFormValid){
        console.log("Form is submitted")
    }
})

async function validateForm(){
    let isFormValid = false;

    let nameInput = await validateNameInput();
    let amountInput = await  validateAmountInput();
    let dateInput = await validateDateInput();

    if(nameInput && amountInput && dateInput){
        isFormValid = true
    }

    return isFormValid;
}

async function validateNameInput(){
    const nameInput = document.getElementById("name-input");
    let isNameValid = false;

    if (nameInput.value.trim() != ""){
        isNameValid = true;
    } else{
        showInputError(nameInput, "*Name cannot be blank")
    }

    return isNameValid
}

async function validateAmountInput(){
    const amountInput = document.getElementById("amount-input");
    let isAmountValid = false;

    if (amountInput.value.trim() != ""){
        isAmountValid = true;
    } else{
        showInputError(amountInput, "*Amount cannot be blank")
    }

    return isAmountValid
}

async function validateDateInput(){
    const dateInput = document.getElementById("date-input");
    let isDateValid = false;

    if (dateInput.value.trim() != ""){
        isDateValid = true;
    } else{
        showInputError(dateInput, "*Date cannot be blank")
    }

    return isDateValid
}

function showInputError(inputElement, message){

    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";
    errorDisplay.setAttribute("role", "alert")

    inputElement.parentElement.appendChild(errorDisplay);
}

async function clearErrorMessages(){
    let errorMessages = Array.from(document.getElementsByClassName("error-message"));
    errorMessages.forEach(element => {
        element.remove()
    });
}