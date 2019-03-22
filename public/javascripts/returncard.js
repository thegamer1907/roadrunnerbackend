// WRITE returncard() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');

function returncard() {

    var cardNo = document.getElementById('CardNo').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var pin = document.getElementById('Pin').value;
    if (pin.length != 4) {
        swal('Please Type a Pin');
        return;
    }

    var condition = $('input[name=choice]:checked').val();

    var data = {
        cardNo: cardNo,
        pin: pin,
        condition: condition
    }

    $('#sub').prop('disabled', 'disabled');
    $('#sub1').prop('disabled', 'disabled');

    $('#maincontent').prop('hidden', true);
    $('#loading-wrapper').prop('hidden', false);

    $.ajax({
        async: true,
        url: "/api/v2/card/removemoneyID",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({ text: "Card Removed Successfully. Amount to be returned : " + res.amount, closeOnClickOutside: false, icon: "success" }).then(function () {
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 417) {
                swal({ text: JSON.stringify(xhr.responseJSON.message) + ' Warning : ' + xhr.responseJSON.warning, closeOnClickOutside: false, icon: "warning" }).then(function () {
                    location.reload();
                });

            } else {
                swal({ text: xhr.responseJSON.message, closeOnClickOutside: false, icon: "error" }).then(function () {
                    if (xhr.status == 400)
                        location.reload();
                });
            }
            $('#sub').removeAttr('disabled');
            $('#sub1').removeAttr('disabled');

        }
    });



}


function returncardinit() {

    var cardNo = document.getElementById('CardNo').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var pin = document.getElementById('Pin').value;
    if (pin.length == 0) {
        swal('Please Type a Pin');
        return;
    }

    var condition = $('input[name=choice]:checked').val();

    var data = {
        cardNo: cardNo,
        pin: pin,
        condition: condition
    }

    $('#maincontent').prop('hidden', true);
    $('#loading-wrapper').prop('hidden', false);

    $.ajax({
        async: true,
        url: "/api/v2/card/getBalanceAmount",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            $('#frm1').prop('hidden', true);
            $('#fill').html('Amount to be Returned : Rs. ' + res.amount);
            $('#frm2').prop('hidden', false);
            $('#maincontent').prop('hidden', false);
            $('#loading-wrapper').prop('hidden', true);
            // location.reload();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({ text: xhr.responseJSON.message, closeOnClickOutside: false, icon: "error" }).then(function () {
                if (xhr.status == 400)
                    location.reload();
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
})