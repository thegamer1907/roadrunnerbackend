var token = sessionStorage.getItem('token');


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
    }
    else
        return;


    // REWRITE ACCORDING TO INCOMING DATA - 1
    function generate(cardNo, phoneNumber, emailId) {
        return `
        <div class="col-lg-3 col-md-12 col-sm-12">
            <div class="card new-color darken-1">
                <div class="card-content white-text">
                    <span class="card-title" id="${cardNo}">${cardNo}</span>
                    <p>Phone Number : ${phoneNumber}</p>
                    <p>Email ID : ${emailId} </p>
                </div>
            </div>
        </div>`
    }


    $.ajax({
        async: true,
        url: "/api/v2/utility/getallc",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            var obj = res.details;
            var data = [];
            for (let i = 0; i < obj.length; i++) {
                data.push([
                    obj[i].cardNo,
                    obj[i].name,
                    obj[i].email,
                    obj[i].phoneNumber,
                    obj[i].cardBalance.balance]);
            }
            const table = $('#example').DataTable({
                data: data,
                lengthChange: false,
                columns: [
                    { title: "Card No" },
                    { title: "Name" },
                    { title: "Email" },
                    { title: "Phone Number" },
                    { title: "Balance" }
                ],
                dom: 'Bfrtip',
                buttons: ['copy', 'excel', 'pdf', 'csv', 'print']
            });
            table.buttons().container()
                .insertBefore('#example_filter');
            $("#loading-wrapper").prop('hidden', true);
            $('#tablediv').prop('hidden', false);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            swal({ text : 'Some error has occured please try again after some time' , closeOnClickOutside : false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});
