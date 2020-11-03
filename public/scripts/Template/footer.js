$(document).ready(function () {
    FOOTER.LoadNavbarDateTimeInterval();
});

const FOOTER = (() => {
    var this_footer = {};

    this_footer.LoadNavbarDateTime = () => {
        var date = new Date();
        var txt_date = date.toLocaleDateString();
        var txt_time = date.toLocaleTimeString();
        document.getElementById("txt_date_time").innerHTML = txt_date + ' ' + txt_time;
    };

    this_footer.LoadNavbarDateTimeInterval = () => {
        setInterval(function () {
            FOOTER.LoadNavbarDateTime();
        }, 1000);
    };

    return this_footer;
})();
