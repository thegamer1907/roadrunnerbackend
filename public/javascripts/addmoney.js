// WRITE addmoney() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function addmoney() {

    var cardNo = document.getElementById('CardNo').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var pin = document.getElementById('Pin').value;
    if (pin.length != 4) {
        swal('Please Type a valid Pin');
        return;
    }

    var amount = document.getElementById('Amount').value;
    if (amount.length == 0) {
        swal('Please Type a Amount');
        return;
    }
    var data = {
        cardNo: cardNo,
        pin: pin,
        amount: amount
    }

    $('#sub').prop('disabled', 'disabled');
    $('#maincontent').prop('hidden', true);
    $('#loading-wrapper').prop('hidden', false);


    $.ajax({
        async: true,
        url: "/api/v2/card/addmoneyID",
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
            swal({ text: "Money Added Successfully! Current Balance : " + res.balance + ' Rs.', closeOnClickOutside: false, icon: "success", }).then(function () {
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#maincontent').prop('hidden', false);
            $('#loading-wrapper').prop('hidden', true);
            swal(xhr.responseJSON.message, '', "error");
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