var token = sessionStorage.getItem('token');

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
        url: "/api/v2/vendor/getAllSales",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            $("#loading-wrapper").prop('hidden', true);
            $("#tablediv").prop('hidden', false);
            var obj = res.data;
            var data = [];
            var totalmoney = 0;
            for (let i = 0; i < obj.length; i++) {
                var cardNo = 'No Card Linked';
                var sale = 0;
                if (obj[i].cardDetails.length > 0) {
                    cardNo = obj[i].cardDetails[0].cardNo;
                    sale = obj[i].cardbalance[0].balance;
                }
                totalmoney += sale;
                var det = obj[i].userDetails[0];
                data.push([
                    det.name,
                    cardNo,
                    sale
                ]);
            }
            data.push(["~", "~", totalmoney]);
            const table = $('#example').DataTable({
                data: data,
                lengthChange: false,
                columns: [
                    { title: "Name" },
                    { title: "Card Number" },
                    { title: "Total Sale" }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv', 'print']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal({text:'Some error has occured please try again after some time',closeOnClickOutside:false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});
