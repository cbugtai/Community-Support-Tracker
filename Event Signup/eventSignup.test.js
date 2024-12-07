const { loadUpcomingEvents, loadSignups, deleteSignup } = require('./event-signup');

test('form submits correctly and collects data',() => {
    //Mock form elements
    document.body.innerHTML = `
        <form id="event-sign-up-form">
            <input type ="text" id="event-name" value="Charity Gala" required>
            <input type ="text" id="rep-name" value="John Doe" required>
            <input type ="email" id="rep-email" value="john.doe@example.com" required>
            <select id="role" required> 
                <option value="sponsor">Sponsor</option>
            </select>
            <button type="submit">Sign Up</button>
        </form>
    `;

    //Mock handle Submit function
    const handleSubmit = jest.fn((event) => {
        //Prevent default submission behaviour
        event.preventDefault(); 
        //Collect form data
        const formData = {
            eventName:document.getElementById('event-name').value,
            repName: document.getElementById('rep-name').value,
            repEmail:document.getElementById('rep-email').value,
            role:document.getElementById('role').value,
        };
        
        console.log(formData);
        // Return the form data from the mock function
        return formData;
    });

    
    // Add event listner to form
    const form = document.getElementById('event-sign-up-form');
    form.addEventListener('submit',handleSubmit);

    //Simulate form submission
    form.dispatchEvent(new Event('submit'));
    
    //Check if form data was collected correctlty
    expect(handleSubmit).toHaveBeenCalled();

    //
    const eventArg = handleSubmit.mock.calls[0][0];
    const formData = {
        eventName:document.getElementById('event-name').value,
        repName: document.getElementById('rep-name').value,
        repEmail:document.getElementById('rep-email').value,
        role:document.getElementById('role').value,
    };

    expect(formData).toEqual(expect.objectContaining({
        eventName: 'Charity Gala',
        repName: 'John Doe',
        repEmail: 'john.doe@example.com',
        role: 'sponsor'
    }));
});

//Test that the upcoming events section correctly displays signups by role.
describe('Upcoming Events', () => {
    beforeEach(() => {
        // Clear localStorage before each test to ensure no lingering data
        global.localStorage.clear();
    });

    test('should correctly display signups by role', () => {
        // Mock data for signups
        const signups = [
            { eventName: 'Event 1', repName: 'Rep 1', repEMail: 'rep1@example.com', role: 'sponsor' },
            { eventName: 'Event 1', repName: 'Rep 2', repEMail: 'rep2@example.com', role: 'participant' },
            { eventName: 'Event 1', repName: 'Rep 3', repEMail: 'rep3@example.com', role: 'organizer' },
            { eventName: 'Event 2', repName: 'Rep 4', repEMail: 'rep4@example.com', role: 'sponsor' },
            { eventName: 'Event 2', repName: 'Rep 5', repEMail: 'rep5@example.com', role: 'participant' },
            { eventName: 'Event 2', repName: 'Rep 6', repEMail: 'rep6@example.com', role: 'participant' }
        ];

        // Mock localStorage to return the above signups data
        console.log('Mocking localStorage signups:', signups); // Log the mocked data
        global.localStorage.setItem('signups', JSON.stringify(signups));

        // Simulate the DOM environment
        document.body.innerHTML = `
            <div id="upcoming-events"></div>
        `;
        console.log('Before calling loadUpcomingEvents, DOM:', document.body.innerHTML); // Log the initial DOM state
        // Call the function to update the DOM
        loadUpcomingEvents(); 

        // Log the DOM after the function runs
        console.log('After calling loadUpcomingEvents, DOM:', document.body.innerHTML);

        // Get the content of the #upcoming-events div
        const upcomingEventsDiv = document.getElementById('upcoming-events');
        console.log('Upcoming Events Div:', upcomingEventsDiv); 

        const event1 = upcomingEventsDiv.querySelector('div:nth-child(1)').innerHTML;
        const event2 = upcomingEventsDiv.querySelector('div:nth-child(2)').innerHTML;

        // Log the event content for verification
        console.log('Event 1 content:', event1);
        console.log('Event 2 content:', event2);

        // Assertions to check if the upcoming events are correctly displayed
        expect(event1).toContain('Sponsor: 1');
        expect(event1).toContain('Participant: 1');
        expect(event1).toContain('Organizer: 1');

        expect(event2).toContain('Sponsor: 1');
        expect(event2).toContain('Participant: 2');
        expect(event2).toContain('Organizer: 0');
    });
});



//Tests that the  delete button removes record.

describe('Delete Button Functionality', () => {
    beforeEach(() => {
      // Mock the localStorage methods using jest.spyOn
      jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify([
        { eventName: 'Event A', repName: 'Alice', repEmail: 'alice@example.com', role: 'sponsor' },
      ]));
      jest.spyOn(Storage.prototype, 'setItem');
      jest.spyOn(Storage.prototype, 'removeItem');
  
      // Set up the DOM structure for the table
      document.body.innerHTML = `
        <table id="signups-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Participant Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Event A</td>
              <td>Alice</td>
              <td>alice@example.com</td>
              <td>sponsor</td>
              <td><button class="delete-btn">Delete</button></td>
            </tr>
          </tbody>
        </table>
        <div id="upcoming-events"></div>
      `;
  
      // Simulate the initial load of signups into the table
      loadSignups();
    });
  
    test('removes the record from the table on delete button click', () => {
      // Simulate clicking the delete button
      const deleteButton = document.querySelector('.delete-btn');
      const rowBeforeDelete = document.querySelector('#signups-table tbody').children.length;
      deleteButton.click();
  
      // Check that the row is removed from the table
      const rowAfterDelete = document.querySelector('#signups-table tbody').children.length;
      expect(rowAfterDelete).toBe(rowBeforeDelete - 1);  // One row should be removed
    });
  });
  
// Test that the delete button removes a record from localStorage.
beforeEach(() => {
    // Clears localStorage before each test
    localStorage.clear();  
  
    // Set up initial mock signups.
    const mockSignups = [
      { eventName: 'Event 1', repName: 'Rep 2', repEmail: 'rep2@example.com', role: 'participant' },
      { eventName: 'Event 1', repName: 'Rep 3', repEmail: 'rep3@example.com', role: 'organizer' },
      { eventName: 'Event 2', repName: 'Rep 4', repEmail: 'rep4@example.com', role: 'sponsor' },
      { eventName: 'Event 2', repName: 'Rep 5', repEmail: 'rep5@example.com', role: 'participant' },
      { eventName: 'Event 2', repName: 'Rep 6', repEmail: 'rep6@example.com', role: 'participant' }
    ];
  
    // Mock localStorage methods
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValueOnce(JSON.stringify(mockSignups));
    jest.spyOn(Storage.prototype, 'setItem');
  
    // Set up DOM for the test
    document.body.innerHTML = `
      <table id="signups-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Participant Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Event 1</td>
            <td>Rep 2</td>
            <td>rep2@example.com</td>
            <td>participant</td>
            <td><button class="delete-btn" data-index="0">Delete</button></td>
          </tr>
          <!-- More rows... -->
        </tbody>
      </table>
      <div id="upcoming-events"></div>  <!-- Add this missing div -->
    `;
  
    // Load signups into table 
    loadSignups();
  });
  