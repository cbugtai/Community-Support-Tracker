/**
 * Waits for the DOM to be fully loaded, then sets up the form submission event listener.
 * It collects form data, validates it, and saves the data to localStorage.
 * After submission, the table and upcoming events sections are updated.
 */
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('event-sign-up-form');
    if (form) {
        form.addEventListener('submit', function(event) {
            // Prevent default submission
            event.preventDefault();
            // Collect form data.
            const eventName = document.getElementById('event-name').value;
            const repName = document.getElementById('rep-name').value;
            const repEMail= document.getElementById('rep-email').value;
            const role = document.getElementById('role').value;

            //Validate inputs
            if(!eventName || !repName || !repEMail || !role){
                alert('Please fill out all required fields.')
                return;
            }
            // Validate e-mail.
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(repEMail)){
                alert('Please enter a valid email address.');
                return;
            }
            // Create a store info in dat object.
            const signupData = {
                eventName,
                repName,
                repEMail,
                role
            };
            
            console.log(signupData)
            // Retrieve exixsting signups from local storage or initialize as empty array.
            let signups = JSON.parse(localStorage.getItem('signups')) || [];
            signups.push(signupData);
            localStorage.setItem('signups',JSON.stringify(signups));
            // Reload the taable and upcoming events section
            loadSignups();
            loadUpcomingEvents();
        });
    }
});

//Load signups from localStorage and display them in the table.
function loadSignups(){
    const signups = JSON.parse(localStorage.getItem('signups')) || [];
    const tableBody = document.querySelector('#signups-table tbody');
    // Clear the table.
    tableBody.innerHTML = '';

    signups.forEach((signup,index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${signup.eventName}</td>
            <td>${signup.repName}</td>
            <td>${signup.repEMail}</td>
            <td>${signup.role}</td>
            <td><button class="delete-btn" data-index="${index}">Delete</button></td>
     
        `;
        tableBody.appendChild(row);
    });

    //Add event listners for delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', deleteSignup);
    });
}

/**
 * Deletes a signup from both the table and localStorage.
 * @param {Event} event - The click event on the delete button.
 */
function deleteSignup(event) {
    const index = event.target.getAttribute('data-index');
    let signups = JSON.parse(localStorage.getItem('signups')) || [];
    // Remove the signup at the given index
    signups.splice(index, 1); 
  
    // Update localStorage with the modified data
    localStorage.setItem('signups', JSON.stringify(signups));
  
    // Remove the row from the table
    const row = event.target.closest('tr');
    row.remove();
  
    // Optionally update the upcoming events section
    loadUpcomingEvents();
  }
  

//Load and display upcoming events section, showing signup by role.
function loadUpcomingEvents(){
    const signups =JSON.parse(localStorage.getItem('signups')) || [];
    const roleCounts = {};

    // Log to check the retrieved signups data
    console.log('Signups:', signups);

    signups.forEach(signup => {
        if (!roleCounts[signup.eventName]){
            roleCounts[signup.eventName] = {sponsor:0,participant:0,organizer:0};
        }
        
        if(roleCounts[signup.eventName][signup.role] !== undefined){
            roleCounts[signup.eventName][signup.role]++;
        } else {
            console.warn(`Unknown role: ${signup.role} for event: ${signup.eventName}`);
        }

    });

    // Log the role counts to ensure they are being populated
    console.log('Role Counts:', roleCounts); 

    const upcomingEventsDiv = document.getElementById('upcoming-events');
    // Clear existing content
    upcomingEventsDiv.innerHTML = '';

    Object.keys(roleCounts).forEach(eventName => {
        const eventDiv = document.createElement('div');
        eventDiv.innerHTML = `
            <strong>${eventName}</strong><br>
            Sponsor: ${roleCounts[eventName].sponsor} |
            Participant: ${roleCounts[eventName].participant} |
            Organizer: ${roleCounts[eventName].organizer}      
        `;
        upcomingEventsDiv.appendChild(eventDiv);
    });
}

// Event listener for DOMContentLoaded to initialize the page when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadSignups();
    loadUpcomingEvents();
});

module.exports = {
    loadUpcomingEvents,
    loadSignups,
    deleteSignup
};
  


