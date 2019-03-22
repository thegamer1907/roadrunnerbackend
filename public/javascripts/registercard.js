var token = sessionStorage.getItem('token');

function fetchdetails() {
    var cardNo = document.getElementById('AID').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var data = {
        username: cardNo
    }

    $('#maincontent').prop('hidden', true);
    $('#sub').prop('disabled', 'disabled');
    $('#fetch').prop('disabled', 'disabled');
    $('#loading-wrapper').prop('hidden', false);


    $.ajax({
        async: true,
        url: "/api/v2/utility/getcmsdata",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            document.getElementById('name').value = res.name;
            document.getElementById('EmailID').value = res.email;
            document.getElementById('PhoneNumber').value = res.phone_number;
            $('#sub').removeAttr('disabled');
            $('#fetch').removeAttr('disabled');
            $('#loading-wrapper').prop('hidden', true);
            $('#maincontent').prop('hidden', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $('#loading-wrapper').prop('hidden', true);
            swal({ text: xhr.responseJSON.message, closeOnClickOutside: false, icon: "error" }).then(function () {
                $('#sub').removeAttr('disabled');
                $('#fetch').removeAttr('disabled');
                $('#maincontent').prop('hidden', false);
            });
        }
    });


}

function registercard() {

    var cardNo = document.getElementById('CardNo').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var name = document.getElementById('name').value;
    if (name.length == 0) {
        swal('Please Type a Name');
        return;
    }

    var pin = document.getElementById('Pin').value;
    if (pin.length != 4) {
        swal('Please Type a Pin');
        return;
    }

    var amount = document.getElementById('Amount').value;
    if (amount.length == 0) {
        swal('Please Type a Amount');
        return;
    }

    var phoneNumber = document.getElementById('PhoneNumber').value;
    if (phoneNumber.length != 10) {
        swal('Please Type a Valid Phone No');
        return;
    }

    var email = document.getElementById('EmailID').value;
    if (email.length == 0) {
        swal('Please Type a Valid Email');
        return;
    }

    var aid = document.getElementById('AID').value;
    if (aid.length != 8) {
        swal('Please Type a Valid AID');
        return;
    }

    var data = {
        cardNo: cardNo,
        name: name,
        pin: pin,
        amount: amount,
        phoneNumber: phoneNumber,
        email: email,
        id: aid
    }



    $('#loading-wrapper').prop('hidden', false);
    $('#sub').prop('disabled', 'disabled');
    $('#maincontent').prop('hidden', true);

    $.ajax({
        async: true,
        url: "/api/v2/card/registerID",
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
            swal({ text: "Card Registered Successfully. Current Balance : " + res.amount, closeOnClickOutside: false, icon: "success" }).then(function () {
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.status === 417) {
                $('#loading-wrapper').prop('hidden', true);
                swal({ text: "Card Registered Successfully. Current Balance : " + xhr.responseJSON.message.amount + ' Warning : Mail was not sent', closeOnClickOutside: false, icon: "warning" }).then(function () {
                    location.reload();
                });
            } else {
                swal(xhr.responseJSON.message, '', "error")
            }
            $('#sub').removeAttr('disabled');
            $('#loading-wrapper').prop('hidden', true);
            $('#maincontent').prop('hidden', false);
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