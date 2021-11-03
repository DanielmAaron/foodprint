jQuery(document).ready(() => {
  // Your custom js code goes here.

  $('#subscribe_form').submit((event) => {
    event.preventDefault();
    // collect the form data using Id Selector what ever data you need to send to server
    const data = {};
    data.subscribe_email = $('#subscribe_email').val();
    $.ajax({
      url: '/subscribe',
      data: JSON.stringify(data),
      processData: false,
      type: 'POST',
      contentType: 'application/json',
    }).done((res) => {
      if (res.success) {
        // $("#subscribe_form").get(0).reset() // or $('form')[0].reset()
        $('#subscribe_form').hide();
        $('#error-group').hide();
        $('#subscribe_result').html(`You have successfully subscribed as ${res.email}`);
      } else {
        $('#error-group').css('display', 'block');
				  const errors = JSON.parse(JSON.stringify(res.errors));
				  const errorsContainer = $('#errors');
				  errorsContainer.innerHTML = '';
				  let errorsList = '';

				  for (let i = 0; i < errors.length; i++) {
          errorsList += `<li>${errors[i].msg}</li>`;
				  }
				  errorsContainer.html(errorsList);
				  console.log(`error...ajax${errorsList}`);
      }
		  });
  });
});
