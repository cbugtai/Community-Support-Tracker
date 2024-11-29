
function handleSubmit(event) {
    event.preventDefault();
  
    const charityName = document.getElementById("charity-name").value.trim();
    const hoursVolunteered = Number(document.getElementById("hours-volunteered").value.trim());
    const dateVolunteered = document.getElementById("date-volunteered").value.trim();
    const experienceRating = Number(document.getElementById("experience-rating").value.trim());
  
    const formData = {
      charityName,
      hoursVolunteered,
      dateVolunteered,
      experienceRating,
    };
  
    if (!charityName) {
      alert("Charity name is required.");
      return;
    }
  
    if (!hoursVolunteered || isNaN(hoursVolunteered) || hoursVolunteered <= 0) {
      alert("Please enter a valid number of hours volunteered (greater than 0).");
      return;
    }
  
    if (!dateVolunteered) {
      alert("Date of volunteering is required.");
      return;
    }
  
    if (!experienceRating || isNaN(experienceRating) || experienceRating < 1 || experienceRating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }
  
    console.log("Form data submitted successfully:", formData);
  
    return formData; 
  }
  
  document.getElementById("volunteer-form").addEventListener("submit", handleSubmit);
  
  module.exports = { handleSubmit };
  