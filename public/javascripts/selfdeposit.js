// WRITE collect() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');

function deposit() {

    $('#sub').prop('disabled', true);
    var amount = document.getElementById('Amount').value;
    if (amount.length == 0) {
        swal('Please Type a Amount');
        return;
    }
    var data = {
        amount: amount
    }

    $.ajax({
        async: true,
        url: "/api/v2/utility/selfdeposit",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : res.message,closeOnClickOutside:false}).then(function(){
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text : xhr.responseJSON.message,closeOnClickOutside : false}).then(function(){
                $('#sub').removeAttr('disabled');
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

});
