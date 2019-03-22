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

function generatevdetails() {
    $("#form1").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', false);
    var vendorname = $("#vendor").val();
    if (vendorname === 'Select Vendor') {
        swal('Select a vendor');
        return;
    }
    var fromtime = $("#fromdate").val();
    var totime = $("#todate").val();
    var fromtimecmp = new Date(fromtime);
    var totimecmp = new Date(totime);
    var validate = fromtimecmp.getTime() < totimecmp.getTime();
    if (!validate) {
        swal('To time should be greater than from time');
        $("#form1").prop('hidden', false);
        $("#loading-wrapper").prop('hidden', true);
        // location.reload();
        return;
    }

    var data = {
        startDate: fromtime + ":00",
        endDate: totime + ":00",
        vendor: vendorname
    };

    $.ajax({
        async: true,
        url: "/api/v2/utility/vendortransactiondaterange",
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
            $("#totalslot").prop('hidden', false);
            var obj = res.tlist;
            var data = [];
            var totalmoney = 0;
            for (let i = 0; i < obj.length; i++) {
                if (obj[i].fromCardNo != '0' && obj[i].fromCardNo != '1' && obj[i].fromCardNo != '2' && obj[i].fromCardNo != '3') {
                    var date = new Date(obj[i].date);
                    data.push(
                        [obj[i].fromCardNo,
                        obj[i].amount,
                        date.toDateString(),
                        date.toTimeString().split(' ')[0],
                        obj[i].transactionID,
                        obj[i].status[0].orderDetails.trim()]);
                    totalmoney += parseFloat(obj[i].amount);
                }
            }
            var ref = res.refundlist;
            // console.log(ref[ref.length -1]);
            for (let i = 0; i < ref.length; i++) {
                var date = new Date(ref[i].date);
                data.push([
                    ref[i].fromCardNo,
                    "-" + ref[i].amount.toString(),
                    date.toDateString(),
                    date.toTimeString().split(' ')[0],
                    ref[i].transactionID,
                    ref[i].status[0].orderDetails.trim()]);
                totalmoney -= parseFloat(ref[i].amount);
            }
            data.push(['~', totalmoney, '~', '~','~','~']);
            document.getElementById("money").textContent = totalmoney;
            const table = $('#example').DataTable({
                data: data,
                lengthChange: false,
                "order" : [],
                columns: [
                    { title: "From Card" },
                    { title: "Amount" },
                    { title: "Date" },
                    { title: "Time" },
                    { title: "Transaction ID" },
                    { title: "Transaction Details"}
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
    if (sessionStorage.getItem("token") != null) {
        $("#nanc").append(`<li><a href="/home" id="log" onmouseover="this.style.cursor='pointer';" style="font-size: 16px;">Dashboard</a></li>`)
        set_all();
    }
    var da = new Date();
    $("#fromdate").val(da.yyyymmdd());
    $("#todate").val(da.yyyymmdd());

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
            swal({ text: 'Some error has occured please try again after some time', closeOnClickOutside: false }).then(function () {
                window.location.pathname = '/home';
            });
        },
    });
});
