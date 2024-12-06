const { JSDOM } = require("jsdom");
const { init, collectData, validateNameInput, validateAmountInput, validateDateInput } = require("./DonationTrackerScript");

let dom;
let document;

beforeEach(() => {
    dom = new JSDOM(`
        <form id="donation-form">
            <input type="text" id="name-input" />
            <input type="number" id="amount-input" />
            <input type="date" id="date-input" />
            <input type="text" id="message-input" />
        </form>

        <h1 id="donation-summary"></h1>

        <table id="donation-history"></table>
    `);
    document = dom.window.document;
    global.document = document;
});

// Testing From Submission
test("testing form submission", () => {
    // Here I am creating a new form and submit button
    const dom = new JSDOM(`
    <form id="test-form">
        <button type="submit">Submit</button>
    </form>
    `);
    // This creates a local DOM in my test
    const document = dom.window.document;
    // I get the form from my JSDOM code
    const form = document.querySelector("#test-form");
    // Jest allows you to spy on things like functions
    const handleSubmitSpy = jest.fn(init);
    // here I set the forms submit handler to be my spied on function
    form.onsubmit = handleSubmitSpy;
    // I need to create the submit event myself and then dispatch that event, dispatching is like I am triggering the event
    const event = new dom.window.Event("submit");
    form.dispatchEvent(event);
    // Finally I check, was my funciton called?
    expect(handleSubmitSpy).toHaveBeenCalled();
});

// Testing validateNameInput() Function
// blank input test
test("testing validateNameInput() blank name input", async () => {
    const mockDom = new JSDOM(`
        <input type="text" id="name-input" value="">
        `);
    const document = mockDom.window.document;
    const nameInput = document.getElementById("name-input");

    expect(await validateNameInput(nameInput)).toBe(false)
})
// valid input test
test("testing validateNameInput() valid name input", async () => {
    const mockDom = new JSDOM(`
        <input type="text" id="name-input" value="Test Name">
        `);
    const document = mockDom.window.document;
    const nameInput = document.getElementById("name-input");

    expect(await validateNameInput(nameInput)).toBe(true)
})

// Testing validateAmountInput() Function
// blank input test
test("testing validateAmountInput() blank amount input", async () => {
    const mockDom = new JSDOM(`
        <input type="number" id="input" value="">
        `);
    const document = mockDom.window.document;
    const input = document.getElementById("input");

    expect(await validateAmountInput(input)).toBe(false)
})
// negative input amount test
test("testing validateAmountInput() negative amount value", async () => {
    const mockDom = new JSDOM(`
        <input type="number" id="input" value="-1000">
        `);
    const document = mockDom.window.document;
    const input = document.getElementById("input");

    expect(await validateAmountInput(input)).toBe(false)
})
// valid input test
test("testing validateAmountInput() valid amount input", async () => {
    const mockDom = new JSDOM(`
        <input type="number" id="input" value="100.00">
        `);
    const document = mockDom.window.document;
    const input = document.getElementById("input");

    expect(await validateAmountInput(input)).toBe(true)
})

// Testing validateDateInput() Function
// blank input test
test("testing validateDateInput() blank date input", async () => {
    const mockDom = new JSDOM(`
        <input type="date" id="input" value="">
        `);
    const document = mockDom.window.document;
    const input = document.getElementById("input");

    expect(await validateDateInput(input)).toBe(false)
})
// valid input test
test("testing validateDateInput() blank date input", async () => {
    const mockDom = new JSDOM(`
        <input type="date" id="input" value="2024-11-29">
        `);
    const document = mockDom.window.document;
    const input = document.getElementById("input");

    expect(await validateDateInput(input)).toBe(true)
})

// test for the collectData fuction for if it populates the formData object properly
test("testing collectData() saves data passed into it in a dictionary", () => {
    expect(collectData("testName", 100.00, 2024-11-28)).toStrictEqual({
        "Charity Name": 'testName', 
        "Donation Amount": 100.00, 
        "Donation Date": 2024-11-28, 
        "Donation Message": ''
    });
});

describe("STAGE TWO", () => {
    const { 
        saveDonationHistory, 
        getDonationHistory,
        showHistory,
        showSummary,
        deleteRow
    } = require("./DonationTrackerScript")

    describe("Persitence Test", () => {
        class localStorageMock{
            constructor(){
                this.store = {}
            }
            getItem(key){
                return this.store[key]  || null;
            }
            setItem(key, value){
                this.store[key] = String(value);
            }
        }
        global.localStorage = new localStorageMock

        test("Test that data is correctly stored in localStorage", async () => {
            formData1 = {
                "Charity Name" : "testName1",
                "Donation Amount": 100, 
                "Donation Date": "2024-11-28", 
                "Donation Message": "Testing 1234"
            }

            await saveDonationHistory(formData1);

            expect(JSON.parse(localStorage.getItem("DONATIONHISTORY"))).toEqual([formData1]);
        })
        test("Test that data is correctly retrieved and loaded into table", async () => {
            await showHistory();
            let tableItems = document.getElementsByTagName("td");
            // td's 0-4 are the headers
            let tableDate = tableItems[5].innerHTML;
            let tableName = tableItems[6].innerHTML;
            let tableAmount = tableItems[7].innerHTML;
            let tableMessage = tableItems[8].innerHTML;

            expect(tableDate).toBe("2024-11-28");
            expect(tableName).toBe("testName1");
            expect(tableAmount).toBe("$100.00");
            expect(tableMessage).toBe(`"Testing 1234"`);
        })
    })
    describe("Summary and Deletion Test", () =>{
        test("Test that the summary section correctly calculates and displays the total amount donated.", async () => {
            formData2 = {
                "Charity Name" : "randomCharity2",
                "Donation Amount": 7777, 
                "Donation Date": "2024-12-05", 
                "Donation Message": ""
            }

            await showSummary();
            let summary = document.getElementById("donation-summary").innerHTML;
            expect(summary).toBe("Total Amount Donated: $100.00");

            //adding another entry
            await saveDonationHistory(formData2);

            await showSummary()
            let summaryUpdated = await document.getElementById("donation-summary").innerHTML;
            expect(summaryUpdated).toBe("Total Amount Donated: $7,877.00");
        })
        test("Test that the delete button removes a record from the table and localStorage", async () => {
            await showHistory();
            let tableItems = document.getElementsByTagName("td");

            expect(tableItems.length).toBe(15);
            expect((JSON.parse(localStorage.getItem("DONATIONHISTORY"))).length).toBe(2);
            
            // Always true when asked for confirmation
            global.confirm = jest.fn(() => true)
            // delete row at index 1
            await deleteRow(1);
            
            expect(tableItems.length).toBe(10);
            expect((JSON.parse(localStorage.getItem("DONATIONHISTORY"))).length).toBe(1);
        })
        test("Test that the total donation amount in the summary section is updated when a donation is deleted.", async () => {
            await showSummary();
            let summary = document.getElementById("donation-summary").innerHTML;
            expect(summary).toBe("Total Amount Donated: $7,777.00");
        })
    })
})