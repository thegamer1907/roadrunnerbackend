
var token = sessionStorage.getItem('token');


function registerVendor() {
    var shopname = document.getElementById("shopname").value;
    if (shopname.length == 0) {
        swal('Please Type a Shop Name');
        return;
    }

    var name = document.getElementById("personname").value;
    if (name.length == 0) {
        swal('Please Type a Name');
        return;
    }

    var phone = document.getElementById("phone").value;
    if (phone.length != 10) {
        swal('Please Type a Valid Phone Number');
        return;
    }

    var email = document.getElementById("email").value;
    if (email.length == 0) {
        swal('Please Type a Email');
        return;
    }

    var user = document.getElementById("user").value;
    if (user.length == 0) {
        swal('Please Type a Username');
        return;
    }

    var password = document.getElementById("password").value;
    if (password.length == 0) {
        swal('Please Type a Password');
        return;
    }

    var cardNo = document.getElementById("cardNo").value;
    if (cardNo.length == 0) {
        swal('Please Type a CardNo');
        return;
    }

    var pin = document.getElementById("pin").value;
    if (pin.length != 4) {
        swal('Please Type a Valid Pin');
        return;
    }


    var data = {
        shopname: shopname,
        name: name,
        user: user,
        email: email,
        password: password,
        phone: phone,
        cardNo: cardNo,
        pin: pin,
        amount: "0"
    }

    $.ajax({
        async: true,
        url: "/api/v2/card/registerwithdiscount",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text:res.message,closeOnClickOutside:false}).then(function(){
                location.reload();
            });
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
