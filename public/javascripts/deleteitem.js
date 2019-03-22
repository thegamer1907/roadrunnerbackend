// WRITE deleteitem() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');


function deleteitem() {

    $('#sub').prop('disabled', true);
    var username = $("#vendor").val();
    var itemName = $("#item").val();

    var data = {
        username: username,
        itemName: itemName
    }

    $.ajax({
        async: true,
        url: "/api/v2/vendor/deleteItem",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : "Item Deleted Successfully.",closeOnClickOutside:false}).then(function(){
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
            var itemTOUpdate = null;
            $.each(res.data, function (key, val) {

                stringToAppend += "<option value='" + val.username + "'>" + val.name + "</option>";
                if (!itemTOUpdate)
                    itemTOUpdate = val.username;

            });
            $("#vendor").html(stringToAppend);
            $("#vendor").prop('disabled', false);
            changeVal(itemTOUpdate);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text:'Some error has occured please try again after some time',closeOnClickOutside:false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });

    function changeVal(status) {
        $("#item").prop('disabled', true);
        $.ajax({
            async: true,
            url: "/api/v2/vendor/getItems/" + status,
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
                "cache-control": "no-cache",
            },
            success: function (res, textStatus, xmLHttpRequest) {
                var stringToAppend = "";
                $.each(res.data, function (key, val) {

                    stringToAppend += "<option value='" + val.itemName + "'>" + val.itemName + ' Rs: ' + val.price + "</option>";

                });
                $("#item").html(stringToAppend);
                $("#item").prop('disabled', false);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                // console.log(xhr);
                swal({text:'Some error has occured please try again after some time',closeOnClickOutside:false}).then(function(){
                    window.location.pathname = '/home';
                });
            },
        });
    }

    $("#vendor").change(function () {
        var status = this.value;
        changeVal(status);
    });

});
