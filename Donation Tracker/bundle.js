(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function init(){
    // Submit Event
    const form = document.getElementById("donation-form");
    form.addEventListener("submit", onSubmit);
}

// Function that runs when form submits
async function onSubmit(event){
    //Form Inputs
    const nameInput = document.getElementById("name-input");
    const amountInput = document.getElementById("amount-input");
    const dateInput = document.getElementById("date-input");
    const messageInput = document.getElementById("message-input")

    event.preventDefault();
    await clearErrorMessages()

    let nameValid = await validateNameInput(nameInput);
    let amountValid = await  validateAmountInput(amountInput);
    let dateValid = await validateDateInput(dateInput);

    //Checks if all validations return true
    if (nameValid && amountValid && dateValid){
        collectData(nameInput.value, amountInput.value, dateInput.value, messageInput.value)
    }
}

// Function to Validate Charity Name input
// takes an input element as an argument
// returns true if input is valid false if invalid
async function validateNameInput(nameInput){
    let isNameValid = false;

    // checks if input value is not blank
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

// Function to Validate Donation Amount input
// takes an input element as an argument
// negative values equal to invalid input
// returns true if input is valid false if invalid
async function validateAmountInput(amountInput){
    let isAmountValid = false;

    // checks if input value is not blank
    if (amountInput.value.trim() != ""){
        // checks if input value is not negative
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

// Function to Validate Date of Donation input
// takes an input element as an argument
// returns true if input is valid false if invalid
async function validateDateInput(dateInput){
    let isDateValid = false;
    
    // checks if input value is not blank
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

// Function that informs the user if theres any input error on the form
// Takes an element and a string message as the arguments
// appends a span element to the Element argument with the message argument as innerText 
function showInputError(inputElement, message){

    const errorDisplay = document.createElement("span");
    errorDisplay.innerText = message;
    errorDisplay.className = "error-message";
    errorDisplay.setAttribute("role", "alert")

    inputElement.parentElement.appendChild(errorDisplay);
}

//Scours the document for any elements with the error-message class and removes them
async function clearErrorMessages(){
    let errorMessages = Array.from(document.getElementsByClassName("error-message"));
    errorMessages.forEach(element => {
        element.remove()
    });
}

//Saves the form input data into a temporary object
function collectData(name, amount, date, message = ""){
    let formData = {};
    formData["Charity Name"] = name
    formData["Donation Amount"] = amount
    formData["Donation Date"] = date
    formData["Donation Message"] = message
    
    return formData;
}

// Exports the module snecessary when running tests
if (typeof window !== "undefined"){
    window.onload = init;
} else {
    module.exports = { init, collectData, validateNameInput, validateAmountInput, validateDateInput, showInputError }
}



},{}]},{},[1]);
