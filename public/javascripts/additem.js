// WRITE additem() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function additem() {

    $('#sub').prop('disabled', true);
    var username = $("#vendor").val();
    var itemName = document.getElementById("itemName").value;
    if (itemName.length == 0) {
        swal('Please Type a Item Name');
        return;
    }
    var amount = document.getElementById('Amount').value;
    if (amount.length == 0) {
        swal('Please Type a Amount');
        return;
    }

    var data = {
        username: username,
        itemName: itemName,
        price: amount
    }

    $.ajax({
        async: true,
        url: "/api/v2/vendor/addItem",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : "Item Added Successfully." , closeOnClickOutside : false}).then(function(){
                $('#sub').removeAttr('disabled');
                $('#itemName').val("");
                $('#Amount').val("");
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
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

    $("#vendor").prop('disabled', true);


    $.ajax({
        async: true,
        url: "/api/v2/vendor/getAllVendors",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $.each(res.data, function (key, val) {
                var bch = document.createElement("option");
                bch.innerHTML = val.name;
                bch.setAttribute("value", val.username);
                $("#vendor").append(bch);
            });

            $("#vendor").prop('disabled', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // console.log(xhr);
            swal({ text : 'Some error has occured please try again after some time',
            closeOnClickOutside : false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});
