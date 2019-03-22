function getsumadmin() {
   var token = sessionStorage.getItem('token');

    $.ajax({
        async: true,
        url: "/api/v2/card/getAdminAmount",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            document.getElementById("totalcash").textContent = res.amount;
        },
        error: function (xhr, ajaxOptions, thrownError) {
        },
    });
}