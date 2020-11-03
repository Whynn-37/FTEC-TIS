const CONVERSION = (() => {
    let this_conversion = {};

    this_conversion.ConvertTimeToSeconds = (time) => {
        var split_time = time.split(':'),
            seconds = 0,
            minutes = 1;

        while (split_time.length > 0) {
            seconds += minutes * parseInt(split_time.pop(), 10);
            minutes *= 60;
        }

        return seconds;
    };

    this_conversion.ConvertSecondsToTime = (seconds) => {
        var hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;
        var minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;
        return hours + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
    };

    return this_conversion;
})();
