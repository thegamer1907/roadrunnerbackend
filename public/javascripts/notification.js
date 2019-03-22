var token = sessionStorage.getItem('token');

function send() {
    var title = document.getElementById('title').value;
    if (title.length == 0) {
        swal('Please Type a title');
        return;
    }

    var body = document.getElementById('body').value;
    if (body.length == 0) {
        swal('Please Type a body');
        return;
    }

    var data = {
        title: title,
        body: body
    }

    $.ajax({
        async: true,
        url: "/api/v2/utility/sendnotification",
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        data: JSON.stringify(data),
        success: function (res, textStatus, xmLHttpRequest) {

            swal(res.message).then(function () {
                location.reload()
            })

        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal(xhr.responseJSON.message);
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
})