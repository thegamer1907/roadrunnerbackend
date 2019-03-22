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

    function generate(username, amount) {
        return `
        <div class="col-lg-3 col-md-12 col-sm-12">
            <div class="card new-color darken-1">
                <div class="card-content white-text">
                    <span class="card-title" id="${username}">${username}</span>
                    <p>Amount in Hand : ${amount} Rs.</p>
                </div>
            </div>
        </div>`
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
            var stringToAppend = "";
            $.each(res.list, function (key, val) {

                stringToAppend += generate(val.username, val.amount)

            });
            $("#loading-wrapper").prop('hidden', true);
            $("#hty").html(stringToAppend);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
            swal({text : 'Some error has occured please try again after some time' , closeOnClickOutside : false}).then(function(){
                window.location.pathname = '/home';
            });
        },
    });
});
