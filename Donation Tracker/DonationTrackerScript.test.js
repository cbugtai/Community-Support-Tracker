const { JSDOM } = require("jsdom");
const { init } = require("./DonationTrackerScript");
const { collectData }  = require("./DonationTrackerScript");
const { validateNameInput } = require("./DonationTrackerScript");
const { validateAmountInput } = require("./DonationTrackerScript");
const { validateDateInput } = require("./DonationTrackerScript");



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
test("testing validateNameInput() blank name input", async () => {
    const mockDom = new JSDOM(`
        <input type="text" id="name-input" value="">
        `);
    const document = mockDom.window.document;
    const nameInput = document.getElementById("name-input");

    expect(await validateNameInput(nameInput)).toBe(false)
})

test("testing validateNameInput() valid name input", async () => {
    const mockDom = new JSDOM(`
        <input type="text" id="name-input" value="Test Name">
        `);
    const document = mockDom.window.document;
    const nameInput = document.getElementById("name-input");

    expect(await validateNameInput(nameInput)).toBe(true)
})


// test for the collectData fuction for if it populates the formData object properly
test("collectData saves data passed into it in a dictionary", () => {
    expect(collectData("testName", 100.00, 2024-11-28)).toStrictEqual({
        "Charity Name": 'testName', 
        "Donation Amount": 100.00, 
        "Donation Date": 2024-11-28, 
        "Donation Message": ''
    });
});
