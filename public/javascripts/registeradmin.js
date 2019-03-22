// WRITE registeradmin() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');



function registeradmin() {

    $('#sub').prop('disabled', true);
    $('#maincontent').prop('hidden', true);
    $('#loading-wrapper').prop('hidden', false);
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

    var data = {
        name: name,
        username: username,
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
                    url: "/api/v2/utility/registeradmin",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        "cache-control": "no-cache",
                    },
                    processData: false,
                    data: JSON.stringify(data),
                    success: function (res, textStatus, xmLHttpRequest) {
                        $('#loading-wrapper').prop('hidden', true);
                        swal({text : "Admin Registered Successfully.",closeOnClickOutside:false}).then(function(){
                            location.reload();
                        });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        swal({text : xhr.responseJSON.message,closeOnClickOutside : false}).then(function(){
                            $('#sub').removeAttr('disabled');
                            $('#maincontent').prop('hidden', false);
                            $('#loading-wrapper').prop('hidden', true);
                        });
                    }
                });
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
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
