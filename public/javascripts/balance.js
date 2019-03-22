function checkBalance() {
    $("#sub").prop('disabled', true);

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


    var data = {
        cardNo: cardNo,
        pin: pin
    }
    $.ajax({
        async: true,
        url: "/api/v2/card/balance",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            balance = res.balance;
            document.getElementById("CardNo").value = '';
            document.getElementById("Pin").value = '';
            swal({text : "Current Balance : " + balance.toString(), closeOnClickOutside : false}).then(function(){
                $("#sub").prop('disabled', false);
            });  
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal("Message : " + xhr.responseJSON.message);
            $("#sub").prop('disabled', false);
        },
    });

}

function set_all() {
    $("#log").text('Logout');
    $("#log").removeAttr("href");
    $("#log").on('click', function () {
        sessionStorage.removeItem("token");
        location.reload();
    });
    $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)

}


if (sessionStorage.getItem("token") != null) {
    set_all();
}