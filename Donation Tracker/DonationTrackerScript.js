// Variables
const form = document.getElementById("donation-form");

// Submit Event
form.addEventListener("submit", async (event) => {
    event.preventDefault();
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
        console.log("Name cannot be blank")
    }

    return isNameValid
}

async function validateAmountInput(){
    const amountInput = document.getElementById("amount-input");
    let isAmountValid = false;

    if (amountInput.value.trim() != ""){
        isAmountValid = true;
    } else{
        console.log("Amount cannot be blank")
    }

    return isAmountValid
}

async function validateDateInput(){
    const dateInput = document.getElementById("date-input");
    let isDateValid = false;

    if (dateInput.value.trim() != ""){
        isDateValid = true;
    } else{
        console.log("Date cannot be blank")
    }

    return isDateValid
}
