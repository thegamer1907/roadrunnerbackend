// WRITE linkcard() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');
//Deprecated file update swal in this.


function linkcard() {

    var username = $("#vendor").val();

    var cardNo = document.getElementById('CardNo').value;
    if (cardNo.length == 0) {
        swal('Please Type a Card No');
        return;
    }

    var data = {
        cardNo: cardNo,
        username: username
    }

    $('#sub').prop('disabled', true);



    $.ajax({
        async: true,
        url: "/api/v2/vendor/linkUserCard",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal("Card Linked Successfully.");
            $('#sub').removeAttr('disabled');
            $('#CardNo').val("");
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
            var stringToAppend = "";

            $.each(res.data, function (key, val) {
                var bch = document.createElement("option");
                bch.innerHTML = val.name;
                bch.setAttribute("value", val.username);
                $("#vendor").append(bch);

            });
            $("#vendor").prop('disabled', false);

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            swal('Some error has occured please try again after some time')
            window.location.pathname = '/home';
        },
    });


});
