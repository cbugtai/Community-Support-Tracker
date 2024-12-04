const { JSDOM } = require("jsdom");
const {
  onSubmit,
  collectData,
  validateCharityInput,
  validateHoursInput,
  validateDateInput,
  validateRatingInput,
} = require("./VolunteerHoursScript");

describe("Form Submission Tests", () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <form id="volunteer-form">
        <input type="text" id="charity-name" />
        <input type="number" id="hours-volunteered" />
        <input type="date" id="date-volunteered" />
        <input type="number" id="experience-rating" />
      </form>
    `);
    document = dom.window.document;
    global.document = document;
  });

  test("Function is triggered on form submission", () => {
    const form = document.getElementById("volunteer-form");
    const submitEvent = jest.fn(onSubmit);

    form.addEventListener("submit", submitEvent);

    const event = new dom.window.Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    form.dispatchEvent(event);

    expect(submitEvent).toHaveBeenCalled();
  });

  test("Correctly collects form data", () => {
    const formData = collectData("Charity A", 10, "2024-12-02", 4);
    expect(formData).toEqual({
      "Charity Name": "Charity A",
      "Hours Volunteered": 10,
      "Date Volunteered": "2024-12-02",
      "Experience Rating": 4,
    });
  });

  describe("Input Validation Tests", () => {
    test("Validation for required fields (charity name)", async () => {
      const charityInput = document.getElementById("charity-name");
      charityInput.value = "";

      expect(await validateCharityInput(charityInput)).toBe(false);

      charityInput.value = "Charity A";
      expect(await validateCharityInput(charityInput)).toBe(true);
    });

    test("Validation for hours volunteered", async () => {
      const hoursInput = document.getElementById("hours-volunteered");

      hoursInput.value = "";
      expect(await validateHoursInput(hoursInput)).toBe(false);

      hoursInput.value = "-5";
      expect(await validateHoursInput(hoursInput)).toBe(false);

      hoursInput.value = "abc";
      expect(await validateHoursInput(hoursInput)).toBe(false);

      hoursInput.value = "10";
      expect(await validateHoursInput(hoursInput)).toBe(true);
    });

    test("Validation for date (required field)", async () => {
      const dateInput = document.getElementById("date-volunteered");

      dateInput.value = "";
      expect(await validateDateInput(dateInput)).toBe(false);

      dateInput.value = "2024-12-02";
      expect(await validateDateInput(dateInput)).toBe(true);
    });

    test("Validation for experience rating", async () => {
      const ratingInput = document.getElementById("experience-rating");

      ratingInput.value = "";
      expect(await validateRatingInput(ratingInput)).toBe(false);

      ratingInput.value = "0";
      expect(await validateRatingInput(ratingInput)).toBe(false);

      ratingInput.value = "6";
      expect(await validateRatingInput(ratingInput)).toBe(false);

      ratingInput.value = "4";
      expect(await validateRatingInput(ratingInput)).toBe(true);
    });
  });
});
