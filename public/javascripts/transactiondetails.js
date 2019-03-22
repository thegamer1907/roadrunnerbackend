// WRITE transactiondetails() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function transactiondetails() {

    var tid = document.getElementById("TID").value;
    if (tid.length === 0) {
        swal("Please type a TID");
        return;
    }
    $.ajax({
        async: true,
        url: "/api/v2/utility/tdetails/" + tid,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache"
        },
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : res.details.orderDetails,closeOnClickOutside:false}).then(function(){
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
        },
    });
}


// DONOT MODIFY CODE BELOW


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
