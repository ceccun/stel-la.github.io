console.log(
    "Usage of Stella ID and Stella Kit is bound to the Stella Developer & User License Terms. These terms can be found at https://stella.hs.vc/en/terms"
);

function authenticate(serviceid, servicename) {
    if (readCookie("devid") == null) {
        createCookie("devid", Math.random().toString().replace(".", ""), 999);
    }
    // var authenticatereq =
}

function createCookie(name, valued, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        var expires = "; expires=" + date.toGMTString();
    } else var expires = "";
    document.cookie = name + "=" + valued + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}
