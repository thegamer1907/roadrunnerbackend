var token = sessionStorage.getItem('token');


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

function transactionofacard() {

    $("#frm01").prop('hidden', true);
    $("#loading-wrapper").prop('hidden', false);

    var data = {
        cardNo: document.getElementById("cardNo").value
    }


    $.ajax({
        async: true,
        url: "/api/v2/utility/alltranscard",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
            "Content-Type": "application/json",
        },
        processData: false,
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {

            var stringToAppend = [];

            for (let i = 0; i < res.list.length; i++) {
                let val = res.list[i];
                let date = new Date(val.date);
                stringToAppend.push([
                    val.transactionID, 
                    val.amount, 
                    val.fromCardNo, 
                    val.toCardNo, 
                    date.toDateString(), 
                    date.toTimeString().split(' ')[0],
                    val.status[0].orderDetails.trim()]);
            }


            const table = $('#example').DataTable({
                data: stringToAppend,
                lengthChange: false,
                "order": [],
                columns: [
                    { title: "Transaction ID" },
                    { title: "Amount" },
                    { title: "From CardNo" },
                    { title: "To CardNo" },
                    { title: "Date" },
                    { title: "Time" },
                    { title: "Order Details"}
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
            swal({text:'Some error has occured please try again after some time',closeOnClickOutside:false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
}


// DONOT MODIFY CODE BELOW

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

});