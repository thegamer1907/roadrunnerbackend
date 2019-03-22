var token = sessionStorage.getItem('token');

//Deprecated File Update SWAL to fire the functions.

function registervendor() {

    $('#sub').prop('disabled', true);
    var name = document.getElementById("Name").value;
    if (name.length == 0) {
        swal('Please Type a Name');
        return;
    }

    var phone = document.getElementById("phonenumber").value;
    if (phone.length != 10) {
        swal('Please Type a Valid Phone Number');
        return;
    }

    var username = document.getElementById("username").value;
    if (username.length == 0) {
        swal('Please Type a Username');
        return;
    }

    var password = document.getElementById("Password").value;
    if (username.length == 0) {
        swal('Please Type a Password');
        return;
    }

    var data = {
        name: name,
        username: username,
        password: password,
        phoneNumber: phone
    }

    $.ajax({
        async: true,
        url: "/api/v2/utility/checkusername/" + username,
        method: "GET",
        headers: {
            "cache-control": "no-cache"
        },
        success: function (res, textStatus, xmLHttpRequest) {
            if (res.exists === 'true') {
                swal('Username already exists.Please Choose a different username');
            }
            else {
                $.ajax({
                    async: true,
                    url: "/api/v2/vendor/registerVendor",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                    processData: false,
                    data: JSON.stringify(data),
                    success: function (res, textStatus, xmLHttpRequest) {
                        swal("Vendor Registered Successfully.");
                        location.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        swal(xhr.responseJSON.message);
                        $('#sub').removeAttr('disabled');
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
            $('#sub').removeAttr('disabled');
        }
    });

}




// DONOT MODIFY CODE BELOW

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

if (sessionStorage.getItem("token") == null) {
    window.location.pathname = '/login'
}

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
