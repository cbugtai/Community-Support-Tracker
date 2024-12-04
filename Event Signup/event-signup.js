document.getElementById('event-sign-up-form').addEventListener('submit',function(event){
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


});