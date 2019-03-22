// WRITE additem() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');
var choice = 0;
var cardNo;


function query(input) {

    if (choice == 0) {
        cardNo = $(input).find("td:eq(0)").text();
    }
    else {
        cardNo = $(input).find("td:eq(1)").text();
    }
    document.getElementById("cardNo").textContent = "Selected card number is " + cardNo;
    $("#myModal").on('shown.bs.modal', function (event) {
        $("#closeButton").focus();
    });
}


function sendMail() {
    var amount = document.getElementById("worth").value;
    if (amount <= 0) {
        swal({ text: "Amount is invalid.", closeOnClickOutside: false });
        return;
    }
    var data = {
        amount: amount,
        cardNo: cardNo
    }

    $.ajax({
        async: true,
        url: "/api/v2/utility/sendcouponmail",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({ text: "Mail sent", closeOnClickOutside: false, icon: "success", }).then(function () {
                // location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message, '', "error").then(function () {
                // location.reload();
            });
        }
    });
}

function setSelection(a) {
    if (a == 1) {
        // $('.select-hide').slideDown(300);
        choice = 1;
    }
    else {
        // $('.select-hide').slideUp(300);
        choice = 0;
    }
}

function decide() {
    if (choice == 1)
        kth();
    else
        perUser();
}

function filter() {
    var k = document.getElementById("k").value;
    if (k <= 0) {
        swal({ text: "Invalid value of K", closeOnClickOutside: false });
        return;
    }
    $("#loading-wrapper").prop('hidden', false);
    $("#tablediv2").prop('hidden', true);
    var data = $("#example2").DataTable().rows().data();
    $("#example2").DataTable().clear().draw()
    data.each(function (value, index) {
        if ((index + 1) % k == 0) {
            // console.log(value);
            $('#example2').DataTable().row.add(value).draw();
        }
    });

    $("#kdiv").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', true);
    $("#tablediv2").prop('hidden', false);
}



Date.prototype.yyyymmdd = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();
    var hh = this.getHours();
    var min = this.getMinutes();
    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-') + 'T' + (hh > 9 ? '' : '0') + hh + ":" + (min > 9 ? '' : '0') + min;
};


//change route for kth
function kth() {
    $("#form1").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', false);
    $("#k").prop('hidden', false);
    var fromtime = $("#fromdate").val();
    var totime = $("#todate").val();
    var fromtimecmp = new Date(fromtime);
    var totimecmp = new Date(totime);
    var validate = fromtimecmp.getTime() < totimecmp.getTime();
    if (!validate) {
        swal('To time should be greater than from time');
        location.reload();
        return;
    }

    var data = {
        startDate: fromtime + ":00",
        endDate: totime + ":00",
    };

    $.ajax({
        async: true,
        url: "/api/v2/utility/transactionbytime",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            $("#loading-wrapper").prop('hidden', true);
            $("#tablediv2").prop('hidden', false);
            var obj = res.data;
            // console.log(obj)
            var data = [];
            let cnt = 1;
            for (let i = 0; i < obj.length; i++) {
                data.push([
                    cnt,
                    obj[i].fromCardNo,
                    obj[i].toCardNo,
                    obj[i].amount
                ]);
                cnt += 1;
            }
            const table = $('#example2').DataTable({
                data: data,
                lengthChange: false,
                columns: [
                    { title: "S.No" },
                    { title: "From CardNo" },
                    { title: "To CardNo" },
                    { title: "Amount" }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv', 'print']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({ text: xhr.responseJSON.message, closeOnClickOutside: false }).then(function () {
                location.reload();
            });
        }
    });


}

function perUser() {
    $("#form1").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', false);
    var fromtime = $("#fromdate").val();
    var totime = $("#todate").val();
    var fromtimecmp = new Date(fromtime);
    var totimecmp = new Date(totime);
    var validate = fromtimecmp.getTime() < totimecmp.getTime();
    if (!validate) {
        swal('To time should be greater than from time');
        location.reload();
        return;
    }

    var data = {
        startDate: fromtime + ":00",
        endDate: totime + ":00",
    };

    $.ajax({
        async: true,
        url: "/api/v2/utility/peruserstat",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            $("#loading-wrapper").prop('hidden', true);
            $("#tablediv").prop('hidden', false);
            var obj = res.data;
            // console.log(obj)
            var data = [];
            for (let i = 0; i < obj.length; i++) {
                data.push([
                    obj[i]._id,
                    obj[i].totalAmount
                ]);
            }
            const table = $('#example').DataTable({
                data: data,
                lengthChange: false,
                columns: [
                    { title: "Card Number" },
                    { title: "Total Money Spent" }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv', 'print']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({ text: xhr.responseJSON.message, closeOnClickOutside: false }).then(function () {
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
    // $('.select-hide').slideUp(300);
    if (sessionStorage.getItem("token") != null) {
        $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
    var da = new Date();
    $("#fromdate").val(da.yyyymmdd());
    $("#todate").val(da.yyyymmdd());

});
