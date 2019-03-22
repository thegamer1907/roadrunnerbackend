function getsumcards() {
    var token = sessionStorage.getItem('token');

    $.ajax({
        async: true,
        url: "/api/v2/card/vendorBalance",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            var disp;
            if (res.totalAmount === 0) {
                disp = "Vendor : 0\n";
            }
            else {
                disp = `Vendor : ${res[0].sum}\n`;
            }
            $.ajax({
                async: true,
                url: "/api/v2/card/userBalance",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "cache-control": "no-cache",
                },
                success: function (res, textStatus, xmLHttpRequest) {
                    disp += `User : ${res.amount}`;
                    swal(disp);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                },
            });

        },
        error: function (xhr, ajaxOptions, thrownError) {
        },
    });
}