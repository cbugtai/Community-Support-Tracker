const { JSDOM } = require("jsdom");
const {
  init,
  collectData,
  validateCharityInput,
  validateHoursInput,
  validateDateInput,
  validateRatingInput,
} = require("./VolunteerScript");

// Test: Form Submission Trigger
test("Function is triggered on form submission", () => {
  const dom = new JSDOM(`<form id="volunteer-form"></form>`);
  const document = dom.window.document;
  const form = document.getElementById("volunteer-form");
  const onSubmitSpy = jest.fn(init);
  form.onsubmit = onSubmitSpy;

  const event = new dom.window.Event("submit");
  form.dispatchEvent(event);
  expect(onSubmitSpy).toHaveBeenCalled();
});

// Test: collectData Function
test("Correctly collects form data", () => {
  const data = collectData("Charity", "5", "2024-12-01", "4");
  expect(data).toEqual({
    "Charity Name": "Charity",
    "Hours Volunteered": "5",
    "Date Volunteered": "2024-12-01",
    "Experience Rating": "4",
  });
});

// Test: Input Validations
test("validateCharityInput detects blank input", async () => {
  const dom = new JSDOM(`<input id="charity-name" value="">`);
  const input = dom.window.document.getElementById("charity-name");
  expect(await validateCharityInput(input)).toBe(false);
});

test("validateHoursInput detects negative value", async () => {
  const dom = new JSDOM(`<input id="hours-volunteered" value="-5">`);
  const input = dom.window.document.getElementById("hours-volunteered");
  expect(await validateHoursInput(input)).toBe(false);
});

test("validateDateInput detects blank date", async () => {
  const dom = new JSDOM(`<input id="date-volunteered" value="">`);
  const input = dom.window.document.getElementById("date-volunteered");
  expect(await validateDateInput(input)).toBe(false);
});

test("validateRatingInput detects out-of-range rating", async () => {
  const dom = new JSDOM(`<input id="experience-rating" value="6">`);
  const input = dom.window.document.getElementById("experience-rating");
  expect(await validateRatingInput(input)).toBe(false);
});

test("validateRatingInput accepts valid rating", async () => {
  const dom = new JSDOM(`<input id="experience-rating" value="4">`);
  const input = dom.window.document.getElementById("experience-rating");
  expect(await validateRatingInput(input)).toBe(true);
});
