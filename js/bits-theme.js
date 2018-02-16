////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function bitsTheme(thm) {
    //get theme

    var p = thm;
    //console.log(thm);

    if (p == "" || p == undefined) {
        console.log("cant find theme colour");
        p = "#0f5f76";
    }


    var bits_theme = $('.bits').css('background-color');
    $('.bits').css('background-color', p);

    //gradient fade
    var w = convertHex(p, 24);
    var q = convertHex(p, 13);

    var bits_theme_min = $('.min-card').css('background');
    $('.min-card').css('background', '-webkit-linear-gradient(top,  rgba(255,255,255,0) 0%,' + q + ' 5%,' + w + '15%,' + p + ' 93%)');



}

function convertHex(hex, opacity) {
    hex = hex.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    result = 'rgba(' + r + ',' + g + ',' + b + ',' + opacity / 100 + ')';
    return result;
}
