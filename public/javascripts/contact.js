function submitform() {
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phoneNumber = document.getElementById('phoneNumber').value;
    var msg = document.getElementById('message').value;

    // Validate inputs


    var data = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        msg: msg
    }


    $.ajax({
        async: true,
        url: "/api/v2/utility/contactform",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal(res.message);
            window.location.pathname = '/';
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            swal('Some error has occured please try again after some time')
            window.location.pathname = '/';
        },
    });


}