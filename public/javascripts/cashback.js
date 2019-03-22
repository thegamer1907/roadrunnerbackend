// WRITE additem() --> This gets triggered when button is clicked
var token = sessionStorage.getItem('token');

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

function process() {

    $('#sub').prop('disabled', 'disabled');
    var transactionID = $('#instid').html();
    var data = {
        TID: transactionID
    };

    $.ajax({
        async: true,
        url: "/api/v2/utility/cashbackprocess",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            swal({ text: res.message, closeOnClickOutside: false }).then(function () {
                location.reload();
            });
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({ text: xhr.responseJSON.message, closeOnClickOutside: false }).then(function () {
                location.reload();
            });
        }
    });

}

function generatedetails() {
    $("#form1").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', false);

    var fromtime = $("#fromdate").val();
    var totime = $("#todate").val();
    var maxCashback = $('#maxAmount').val();
    var minCashback = $('#minAmount').val();
    var fromtimecmp = new Date(fromtime);
    var totimecmp = new Date(totime);
    var validate = fromtimecmp.getTime() < totimecmp.getTime();
    if (!validate) {
        swal('To time should be greater than from time');
        $("#form1").prop('hidden', false);
        $("#loading-wrapper").prop('hidden', true);
        return;
    }

    if(minCashback < 0 || maxCashback < 0)
    {
        swal("Amounts are invalid");
        return;
    }
    var data = {
        startDate: fromtime + ":00",
        endDate: totime + ":00",
        maxCashback: maxCashback,
        minCashback : minCashback
    };
    // console.log('Start');

    $.ajax({
        async: true,
        url: "/api/v2/utility/cashback",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {
            console.log(res.message);
            if (res.message === 'done') {
                $('#instid').html(res.transactionID)
                $('#insfrm').html(res.fromCardNo)
                $('#instoc').html(res.toCardNo)
                $('#insdt').html(res.date)
                $('#insamt').html(res.amount)
                $('#insodd').html(res.orderDetails);
            } else {
                swal({ text: res.message, closeOnClickOutside: false }).then(function () {
                    location.reload();
                });
            }

            $("#loading-wrapper").prop('hidden', true);
            $("#form2").prop('hidden', false);

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
    if (sessionStorage.getItem("token") != null) {
        $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
    var da = new Date();
    $("#fromdate").val(da.yyyymmdd());
    $("#todate").val(da.yyyymmdd());


});
