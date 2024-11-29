function init(){
    // Variables
    const form = document.getElementById("donation-form");
    const nameInput = document.getElementById("name-input");
    const amountInput = document.getElementById("amount-input");
    const dateInput = document.getElementById("date-input");
    const messageInput = document.getElementById("message-input")

    // Submit Event
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        await clearErrorMessages()
        let isFormValid = await validateForm();
        if (isFormValid){
            collectData(nameInput.value, amountInput.value, dateInput.value, messageInput.value)
        }
    })
}

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
        if(amountInput.value > 0){
            isAmountValid = true;
        } else{
            showInputError(amountInput, "*Amount cannot be negative")
        }
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

function collectData(name, amount, date, message = ""){
    let formData = {};
    formData["Charity Name"] = name
    formData["Donation Amount"] = amount
    formData["Donation Date"] = date
    formData["Donation Message"] = message
    console.log(formData)

    return formData;
}

if (typeof window !== "undefined"){
    window.onload = init;
} else {
    module.exports = { collectData, validateNameInput, validateAmountInput, validateDateInput }
}


