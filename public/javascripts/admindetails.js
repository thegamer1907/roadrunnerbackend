var token = sessionStorage.getItem('token');
var selecteduserdetails = [];


function query(input) {
    selecteduserdetails = [];
    $(input).find('td').each(function () {
        var t = $(this).text();
        selecteduserdetails.push(t);
    });

    $.ajax({
        async: true,
        url: "/api/v2/utility/gettransactionforadmin/" + selecteduserdetails[0],
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $('#summaryText').empty();
            var p = document.createElement("p");
            var txt = `The following transactions were made by this admin`;
            p.innerHTML = txt;
            $("#summaryText").append(p);
            var list = $("#summaryText").append('<ul class="list-group"></ul>').find('ul');
            var data = [];
            var obj = res.tlist;
            for (let i = 0; i < obj.length; i++) {
                var from = obj[i].fromCardNo.split('$###$')[1];
                var to = obj[i].toCardNo.split('$###$')[1];
                var len = obj[i].date.length - 5;
                data.push(`${obj[i].amount} was given to ${to} from ${from} - ${obj[i].date.substring(0, len)}`);
                list.append('<li class="list-group-item">' + data[i] + '</li>');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
        }
    });
}

function resetpassword() {
    var data = { username: selecteduserdetails[0] };
    $.ajax({
        async: true,
        url: "/api/v2/utility/resetpassword",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({text : 'Password Reset Successfully', closeOnClickOutside : false}).then(function(){
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
        }
    });
}


function deleteadmin() {
    $('#summaryText').empty();
    var p = document.createElement("p");
    var txt = `Are you sure to delete the user permanently?`;
    p.innerHTML = txt;
    $("#summaryText").append(p);
    $('#buttons').empty();
    var b1 = document.createElement("button");
    b1.setAttribute("type", "button");
    b1.setAttribute("class", "btn btn-default");
    b1.setAttribute("data-dismiss", "modal");
    b1.innerText = "Close";
    $("#buttons").append(b1);
    var b2 = document.createElement("button");
    b2.setAttribute("type", "button");
    b2.setAttribute("class", "btn btn-default");
    b2.setAttribute("data-dismiss", "modal");
    b2.setAttribute("onclick", "deleteUserPermanently()");
    b2.innerText = "Confirm";
    $("#buttons").append(b2);
}

function deleteUserPermanently() {
    var data = { username: selecteduserdetails[0] };
    $.ajax({
        async: true,
        url: "/api/v2/utility/deleteadmin",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({ text : res.message, closeOnClickOutside : false}).then(function(){
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

    $.ajax({
        async: true,
        url: "/api/v2/utility/getalluserhardcash",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $('#example').DataTable({
                data: res.data,
                columns: [
                    { title: "Roll Number" },
                    { title: "Name" },
                    { title: "Amount In Hand" },
                    { title: "Phone Number" },
                    { title: "Password" }
                ]
            });
            for (let i = 0; i < res.fdata.length; i++) {
                var qe = $('#example td:contains(' + res.fdata[i] + ')');
                qe.parent().removeAttr('onclick');
                qe.parent().removeAttr('data-toggle');
                qe.parent().removeAttr('data-target');
            }

        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
        }
    });

    $("#myModal").on('shown.bs.modal', function (event) {
        $("#closeButton").focus();
    });

});
