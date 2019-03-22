// WRITE registersuser() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function changepassword() {
    var username = document.getElementById("username").value;
    if (username.length == 0) {
        swal('Please Type a Username');
        return;
    }
    var oldPassword = document.getElementById("oldPassword").value;
    if (oldPassword.length == 0) {
        swal('Please Type a Password');
        return;
    }

    var newPassword = document.getElementById("newPassword").value;
    if (newPassword.length == 0) {
        swal('Please Type a Password');
        return;
    }

    var cnewPassword = document.getElementById("cnewPassword").value;
    if (cnewPassword.length == 0) {
        swal('Please Type a Password');
        return;
    }

    if (cnewPassword != newPassword) {
        swal('New Password and Confirm Password Don\'t Match');
        return;
    }
    var data = {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword
    }

    $.ajax({
        async: true,
        url: "/api/auth/changepassword",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : "Password Changed Succesfully", closeOnClickOutside : false}).then(function(){
                document.location.href = "/login";
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text :xhr.responseJSON.message, closeOnClickOutside : false}).then(function(){
                document.location.href = "/login";
            });
        }
    });


}


// DONOT MODIFY CODE BELOW

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

function set_all() {
    $("#log").text('Logout');
    $("#log").removeAttr("href");
    $("#log").on('click', function () {
        sessionStorage.removeItem("token");
        location.reload();
    });

}

$(document).ready(function () {
    if (sessionStorage.getItem("token") != null) {
        $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
})
