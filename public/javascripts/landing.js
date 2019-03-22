$(".loading").height($(window).height());
$(".loading").width($(window).width());


$(".loading img").css({
    paddingTop: ($(".loading").height() - $(".loading img").height()) / 2,
    paddingLeft: ($(".loading").width() - $(".loading img").width()) / 2
});

$(window).resize(function () {

    "use strict";

    $(".loading").height($(window).height());
    $(".loading").width($(window).width());


    $(".loading img").css({
        paddingTop: ($(".loading").height() - $(".loading img").height()) / 2,
        paddingLeft: ($(".loading").width() - $(".loading img").width()) / 2
    });

});

$(window).mousemove(function (e) {

    "use strict";

    $(".original").css({
        left: e.pageX - 16,
        top: e.pageY - 16
    });

});

$("body").on("click", function (e) {

    "use strict";

    $(".original").clone(true).appendTo("body").css({
        left: e.pageX - 16,
        top: e.pageY - 16
    }).removeClass("original");

});



$(document).ready(function () {
    if (sessionStorage.getItem("token") != null) {
        set_all();
    }

});





function set_all() {
    $("#log").text('Logout');
    $("#log").removeAttr("href");
    $("#log").on('click', function () {
        sessionStorage.removeItem("token");
        location.reload();
    });
}