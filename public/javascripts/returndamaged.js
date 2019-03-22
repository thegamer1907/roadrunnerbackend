var token = sessionStorage.getItem('token');

function returncard() {

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



    var data = {
        cardNo: cardNo,
        pin: pin
    }

    $('#sub').prop('disabled', 'disabled');

    $.ajax({
        async: true,
        url: "/api/v2/card/takebackcard",
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
})
