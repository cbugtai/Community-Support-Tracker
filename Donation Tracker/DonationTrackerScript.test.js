const { collectData }  = require("./DonationTrackerScript");

// test for the collectData fuction for if it populates the formData object properly
test("collectData saves data passed into it in a dictionary", () => {
    expect(collectData("testName", 100.00, 2024-11-28)).toStrictEqual({
        "Charity Name": 'testName', 
        "Donation Amount": 100.00, 
        "Donation Date": 2024-11-28, 
        "Donation Message": ''
    });
});
