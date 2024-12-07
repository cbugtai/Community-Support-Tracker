const { JSDOM } = require("jsdom");
const {
  onSubmit,
  collectData,
  validateCharityInput,
  validateHoursInput,
  validateDateInput,
  validateRatingInput,
  updateTable,
  saveToLocalStorage,
  loadFromLocalStorage,
  deleteRow,
  calculateTotalHours,
} = require("./VolunteerHoursScript");

describe("Volunteer Hours Tracker", () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(`
      <form id="volunteer-form">
        <input type="text" id="charity-name" />
        <input type="number" id="hours-volunteered" />
        <input type="date" id="date-volunteered" />
        <input type="number" id="experience-rating" />
        <button type="submit">Submit</button>
      </form>
       <section id="volunteer-summary-section">
        <p>Total Hours Volunteered: <span id="total-hours">0</span></p>
        <table id="volunteer-table">
          <thead>
            <tr>
              <th>Charity Name</th>
              <th>Hours Volunteered</th>
              <th>Date</th>
              <th>Experience Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </section>
    `);

    document = dom.window.document;
    global.document = document;
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
  });


  afterEach(() => {
    jest.clearAllMocks();
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

  describe("Table and Persistence Features", () => {
    test("Saves data to localStorage", () => {
      const formData = {
        "Charity Name": "Charity A",
        "Hours Volunteered": "5",
        "Date Volunteered": "2024-12-02",
        "Experience Rating": "4",
      };

      saveToLocalStorage(formData);
      const logs = JSON.stringify([formData]);
      expect(localStorage.setItem).toHaveBeenCalledWith("volunteerLogs", logs);
    });

    test("Loads data from localStorage and updates the table", () => {
      const mockLogs = [
        {
          "Charity Name": "Charity A",
          "Hours Volunteered": "5",
          "Date Volunteered": "2024-12-02",
          "Experience Rating": "4",
        },
      ];
      localStorage.getItem.mockReturnValueOnce(JSON.stringify(mockLogs));
      loadFromLocalStorage();

      const rows = document.querySelectorAll("#volunteer-table tbody tr");
      expect(rows.length).toBe(1);
      expect(rows[0].children[0].textContent).toBe("Charity A");
    });

    test("Deletes a row and updates localStorage", () => {
      const formData = {
        "Charity Name": "Charity A",
        "Hours Volunteered": "5",
        "Date Volunteered": "2024-12-02",
        "Experience Rating": "4",
      };

      updateTable(formData);
      saveToLocalStorage(formData);

      const row = document.querySelector("#volunteer-table tbody tr");
      deleteRow(row, "5");

      expect(document.querySelectorAll("#volunteer-table tbody tr").length).toBe(0);
      expect(localStorage.setItem).toHaveBeenCalledWith("volunteerLogs", JSON.stringify([]));
    });

    test("Calculates total hours correctly", () => {
      const mockLogs = [
        { "Hours Volunteered": "5" },
        { "Hours Volunteered": "10" },
      ];

      const total = calculateTotalHours(mockLogs);
      expect(total).toBe(15);
    });

    test("Updates total hours when rows are added or deleted", () => {
      const mockLogs = [
        { "Hours Volunteered": "5" },
        { "Hours Volunteered": "10" },
      ];

      saveToLocalStorage(mockLogs);
      loadFromLocalStorage();

      const totalHoursElement = document.getElementById("total-hours");
      expect(totalHoursElement.textContent).toBe("15");

      const row = document.querySelector("#volunteer-table tbody tr");
      row.querySelector(".delete-btn").click();

      expect(totalHoursElement.textContent).toBe("10");
    });
  });
});