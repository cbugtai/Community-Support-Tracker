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

        let nameValid = await validateNameInput(nameInput);
        let amountValid = await  validateAmountInput(amountInput);
        let dateValid = await validateDateInput(dateInput);

        if (nameValid && amountValid && dateValid){
            collectData(nameInput.value, amountInput.value, dateInput.value, messageInput.value)
        }
    })
}

async function validateNameInput(nameInput){
    let isNameValid = false;

    if (nameInput.value.trim() != ""){
        isNameValid = true;
    } else{
        try{
            showInputError(nameInput, "*Name cannot be blank")
        } catch {
            isNameValid = false;
        }
    }

    return isNameValid
}

async function validateAmountInput(amountInput){
    let isAmountValid = false;

    if (amountInput.value.trim() != ""){
        if(amountInput.value > 0){
            isAmountValid = true;
        } else{
            try{
                showInputError(amountInput, "*Amount cannot be negative")
            } catch {
                isAmountValid = false;
            }
        }
    } else{
        try{
            showInputError(amountInput, "*Amount cannot be blank")
        } catch {
            isAmountValid = false;
        }
    }

    return isAmountValid
}

async function validateDateInput(dateInput){
    let isDateValid = false;
    
    if (dateInput.value.trim() != ""){
        isDateValid = true;
    } else{
        try{
            showInputError(dateInput, "*Date cannot be blank")
        } catch {
            isDateValid = false
        }
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

    return formData;
}

if (typeof window !== "undefined"){
    window.onload = init;
} else {
    module.exports = { init,collectData, validateNameInput, validateAmountInput, validateDateInput, showInputError }
}


