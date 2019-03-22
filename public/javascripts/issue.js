// WRITE issue() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function issue() {

    $('#sub').prop('disabled', true);
    $('#maincontent').prop('hidden', true);
    $('#loading-wrapper').prop('hidden', false);
    var username = $("#admin").val();
    var amount = document.getElementById('Amount').value;
    if (amount.length == 0) {
        swal('Please Type a Amount');
        return;
    }
    var data = {
        username: username,
        amount: amount
    }

    $.ajax({
        async: true,
        url: "/api/v2/utility/issue",
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
            swal({text : "Money Issue Updated Successfully!",closeOnClickOutside : false}).then(function(){
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

    $("#admin").prop('disabled', true);
    $("#sub").prop('disabled', true);


    $.ajax({
        async: true,
        url: "/api/v2/utility/getalluserhardcashusername",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $.ajax({
                async: true,
                url: "/api/auth/me",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "cache-control": "no-cache",
                },
                success: function (res2, textStatus, xmLHttpRequest) {
                    var stringToAppend = "";
                    $.each(res.list, function (key, val) {
                        if (val.username != res2.data.username)
                            stringToAppend += "<option value='" + val.username + "'>" + val.username + "</option>";
                    });
                    $("#admin").html(stringToAppend);
                    $("#admin").prop('disabled', false);
                    $("#sub").prop('disabled', false);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    swal(xhr.responseJSON.message);
                }
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text : 'Some error has occured please try again after some time',closeOnClickOutside : false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});
