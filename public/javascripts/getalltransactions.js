var token = sessionStorage.getItem('token');


// DONOT MODIFY CODE BELOW

function query(input) {
    const tid = $(input).find("td:eq(0)").text();
    $.ajax({
        async: true,
        url: "/api/v2/utility/tdetails/" + tid,
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache"
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $('#summaryText').empty();
            var p = document.createElement("p");
            var txt = res.details.orderDetails
            p.innerHTML = txt;
            $("#summaryText").append(p);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
        },
    });

    $("#myModal").on('shown.bs.modal', function (event) {
        $("#closeButton").focus();
    });
}

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
    } else
        return;


    // REWRITE ACCORDING TO INCOMING DATA - 1
    function generate(id, amount, from, to, time) {
        return `
        <div class="col-lg-3 col-md-12 col-sm-12">
            <div class="card new-color darken-1">
                <div class="card-content white-text">
                    <span class="card-title" id="${id}">${id}</span>
                    <p>Amount : ${amount} Rs.</p>
                    <p>From : ${from} </p>
                    <p>To : ${to} </p>
                    <p>Date Time : ${time} </p>
                </div>
            </div>
        </div>`
    }


    $.ajax({
        async: true,
        url: "/api/v2/utility/alltransactions",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            var stringToAppend = [];
            for (let i = 0; i < res.list.length; i++) {
                var val = res.list[i];
                var date = new Date(val.date);
                stringToAppend.push(
                    [val.transactionID,
                    val.fromCardNo,
                    val.toCardNo,
                    val.amount,
                    date.toDateString(),
                    date.toTimeString().split(' ')[0]]);
            }
            const table = $('#example').DataTable({
                data: stringToAppend,
                lengthChange: false,
                "order" : [],
                columns: [
                    { title: "Transaction ID" },
                    { title: "From Card" },
                    { title: "To Card" },
                    { title: "Amount" },
                    { title: "Date" },
                    { title: "Time" }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv', 'print']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
            $("#loading-wrapper").prop('hidden', true);
            $("#tablediv").prop('hidden', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text : 'Some error has occured please try again after some time',closeOnClickOutside : false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});