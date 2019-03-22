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
        url: "/api/v2/utility/couponwinners",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            var stringToAppend = [];

            for (let i = 0; i < res.data.length; i++) {
                let val = res.data[i];
                let date = new Date(val.date);
                stringToAppend.push([
                    val.cardNo, 
                    val.amount, 
                    val.details, 
                    date.toDateString(), 
                    date.toTimeString().split(' ')[0]]);
            }


            const table = $('#example').DataTable({
                data: stringToAppend,
                lengthChange: false,
                columns: [
                    { title: "Card Number" },
                    { title: "Amount" },
                    { title: "Details" },
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
            swal(xhr.responseJSON.message);
        }
    });

    $("#myModal").on('shown.bs.modal', function (event) {
        $("#closeButton").focus();
    });

});
