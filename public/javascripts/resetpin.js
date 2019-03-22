var token = sessionStorage.getItem('token');

function resetpin() {

    $("#sub").prop('disabled', true);
    var cardNo = document.getElementById("cardNo").value;
    if (cardNo.length == 0) {
        swal("Please enter valid card number");
        return;
    }

    var pin = document.getElementById("pin").value;
    if (pin.length == 0) {
        swal("Please enter valid PIN");
        return;
    }

    var data = {
        cardNo: cardNo,
        pin: pin
    }

    $.ajax({
        async: true,
        url: "/api/v2/card/updatepin",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
            "Content-Type": "application/json",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text:res.message,closeOnClickOutside:false}).then(function(){
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text:xhr.responseJSON.message,closeOnClickOutside:false}).then(function(){
                $("#sub").removeAttr('disabled');
            });
            
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
        // $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
})

$(document).ready(function () {

    if (sessionStorage.getItem("token") != null) {
        $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
    else
        return;

});
