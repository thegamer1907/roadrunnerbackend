if (sessionStorage.getItem("token") == null) {
    window.location.pathname = '/login'
}

history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

var page_ = undefined;

function UI() {
    var token = sessionStorage.getItem('token');
    $.ajax({
        async: true,
        url: "/getui",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "cache-control": "no-cache",
        },
        success: function (res, textStatus, xmLHttpRequest) {
            page_ = res;
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // console.log(xhr);
            // window.location.pathname = '/login';
            sessionStorage.removeItem("token");
            window.location.pathname = '/';
        },
    });

}

UI();

function setUI() {
    if (page_) {
        $("#loading-wrapper").prop('hidden', true);
        $("#maincontent").html(page_);
    } else {
        return
    }
}

$(document).ready(function () {
    setTimeout(setUI, 1000)
});