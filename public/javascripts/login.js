var animating = false;

$(document).ready(function () {


    function ripple(elem, e) {
        $(".ripple").remove();
        var elTop = elem.offset().top,
            elLeft = elem.offset().left,
            x = e.pageX - elLeft,
            y = e.pageY - elTop;
        var $ripple = $("<div id='ripple' class='ripple'></div>");
        $ripple.css({ top: y, left: x });
        elem.append($ripple);
    };


});

if (sessionStorage.getItem("token") != null) {
    window.location.pathname = '/home'
}

//tried with enter key
$(document).on("keypress", function (e) {
    if (e.keyCode == 13) {
        $("#loginsubmit").click();
    }
});


function login(e) {

    if (animating) return;
        animating = true;
        var that = this;
        // ripple($(that), e);
        $(that).addClass("processing");

        var data = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value
        }

        $.ajax({
            async: true,
            url: "/api/auth/login",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "cache-control": "no-cache",
            },
            processData: false,
            data: JSON.stringify(data),
            success: function (res, textStatus, xmLHttpRequest) {
                if (res.auth === false) {
                    animating = false;
                    $(that).removeClass("processing");
                    $('#warn').prop('hidden', false);
                } else {
                    sessionStorage.setItem('token', res.token);
                    window.location.href = '/home'
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                animating = false;
                $(that).removeClass("processing");
                $('#warn').prop('hidden', false);
            },
        });

}