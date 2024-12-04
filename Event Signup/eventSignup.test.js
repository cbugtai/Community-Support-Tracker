test('form submits correctly and collects data',() =>{
    //Mock form elements
    document.body.innerHTML = `
        <form id="event-signup-form">
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
        // You could log this for debugging:
        console.log(formData);
        // Return the form data from the mock function
        return formData;
    });

    // Add event listner to form
    document.getElementById('event-signup-form').addEventListener('submit',handleSubmit);

    //Simulate form submission
    document.getElementById('event-signup-form').dispatchEvent(new Event('submit'));

    
    
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