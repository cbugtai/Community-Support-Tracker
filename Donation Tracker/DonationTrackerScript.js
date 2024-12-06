function init(){
    //Shows donation history (if any)
    showHistory();

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
        let formData = collectData(nameInput.value, amountInput.value, dateInput.value, messageInput.value);
        await saveDonationHistory(formData);
        // Show donation history
        showHistory()
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

// either creates an empy donationHistory array or gets the donationHistory from localStorage 
async function getDonationHistory(){
    if (localStorage.getItem("DONATIONHISTORY") === null){
        return [];
    } else {
        return JSON.parse(localStorage.getItem("DONATIONHISTORY"))
    }
}

// saves formData object to an array of formData objects called donationHistory
// then saves donationHistory to local storage un the name "DONATIONHISTORY"
async function saveDonationHistory(formData){
    let donationHistory = await getDonationHistory();
    
    donationHistory.unshift(formData)

    localStorage.setItem("DONATIONHISTORY", JSON.stringify(donationHistory));
}

// adds all data in storage to a table
async function showHistory(){
    //This is a trashcan svg i got from chatGPT
    const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="5 5 80 80" width="50" height="50">
                    <rect x="25" y="30" width="50" height="50" fill="#808080" stroke="#666" stroke-width="2" rx="5" ry="5"/>
                    <rect x="20" y="20" width="60" height="10" fill="#666" stroke="#555" stroke-width="2" rx="3" ry="3"/>
                    <rect x="40" y="15" width="20" height="5" fill="#444" stroke="#333" stroke-width="2" rx="2" ry="2"/>
                    <line x1="35" y1="35" x2="35" y2="75" stroke="#555" stroke-width="2"/>
                    <line x1="50" y1="35" x2="50" y2="75" stroke="#555" stroke-width="2"/>
                    <line x1="65" y1="35" x2="65" y2="75" stroke="#555" stroke-width="2"/>
                    </svg>
                    `;

    let donationHistory = await getDonationHistory();
    console.log("showHistory",donationHistory)

    if (donationHistory.length > 0) {
        //creating the table
        const table = document.createElement("table")
        table.id = "donation-history"
        table.className = "table"
        //Adding Headers
        let header = table.createTHead();
        let headerRow = header.insertRow(0);
        // header columns
        let dateHeader = headerRow.insertCell(0);
        let nameHeader = headerRow.insertCell(1);
        let amountHeader = headerRow.insertCell(2);
        let messageHeader = headerRow.insertCell(3);
        let deleteHeader = headerRow.insertCell(4);
        // header text
        dateHeader.innerHTML = "Date"
        nameHeader.innerHTML = "Charity Name"
        amountHeader.innerHTML = "Donation Amount"
        messageHeader.innerHTML = "Donor Message"
        deleteHeader.innerHTML =  svgString
        // body contents
        for (let i = 0; i < donationHistory.length; i++) {
            let body = table.createTBody();
            let bodyRow = body.insertRow(0);

            let dateBody = bodyRow.insertCell(0);
            let nameBody = bodyRow.insertCell(1);
            let amountBody = bodyRow.insertCell(2);
            let messageBody = bodyRow.insertCell(3);
            let deleteBody = bodyRow.insertCell(4)

            dateBody.innerHTML = donationHistory[i]["Donation Date"]
            nameBody.innerHTML = donationHistory[i]["Charity Name"]
            amountBody.innerHTML = Intl.NumberFormat('en-US',
                                        {
                                            style: 'currency',
                                            currency: 'USD'
                                        }
                                    ).format(donationHistory[i]["Donation Amount"])
            if (donationHistory[i]["Donation Message"] == ""){
                messageBody.innerHTML = donationHistory[i]["Donation Message"]
            } else {
                messageBody.innerHTML = (`"${donationHistory[i]["Donation Message"]}"`)
            }
            deleteBody.innerHTML = `<button value=${i} onclick="deleteRow(this)">Delete</button>`
        }
        
        document.getElementById("donation-history").replaceWith(table)
    } 
    //Summary
    showSummary()
}


// deletes this row of data from local storage
async function deleteRow(event){
    let text = `Are you sure you want to delete this donation?`

    if (confirm(text) == true){
        let donationHistory = await getDonationHistory();
        let index = event.value

        donationHistory.splice(index, 1)
        localStorage.setItem("DONATIONHISTORY", JSON.stringify(donationHistory));
        showHistory()
    } 
}

// shows the total amount donated
async function showSummary(){
    let donationHistory = await getDonationHistory();
    donationSummary = 0
    for (let i = 0; i < donationHistory.length; i++) {
        donationSummary = donationSummary + Number(donationHistory[i]["Donation Amount"])
    }
    donationSummaryFormatted = Intl.NumberFormat('en-US',
                                    {
                                        style: 'currency',
                                        currency: 'USD'
                                    }
                                ).format(donationSummary)
    const summary = document.getElementById("donation-summary");
    summary.innerHTML = `Total Amount Donated: ${donationSummaryFormatted}`
}

// Exports the modules necessary when running tests
if (typeof window !== "undefined"){
    window.onload = init;
} else {
    module.exports = { init, collectData, validateNameInput, validateAmountInput, validateDateInput, showInputError }
}


