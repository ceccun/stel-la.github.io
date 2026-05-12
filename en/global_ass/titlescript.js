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

// `filla()` and `checkInternalStatus()` both rely on the user's IP/network,
// so they only run when the user has opted into the "functional" cookie
// category via the consent banner. The check is centralised here so adding
// new IP-derived features later only needs the same gate.
function hasFunctionalConsent() {
    return typeof window.hasConsent === "function"
        ? window.hasConsent("functional")
        : false;
}

function filla() {
    if (!hasFunctionalConsent()) return;

    if (readCookie("country") == null) {
        var s = new XMLHttpRequest();
        s.open("GET", "https://ipapi.co/json");
        s.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var t = JSON.parse(this.responseText);
                createCookie("country", t.country, 4);
            }
        };
        s.send();
    }
    var r = new XMLHttpRequest();
    r.open("GET", "/en/global_ass/titlescript.json");
    r.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = JSON.parse(this.responseText);
            var co = readCookie("country");
            if (resp[co] != undefined) {
                document.getElementById("local-area").innerHTML = resp[co];
            }
        }
    };
    r.send();
}

const buildingNotice = document.getElementsByClassName(
    "ceccunbuildingnotice"
)[0];

const checkInternalStatus = async () => {
    if (!hasFunctionalConsent()) return;

    const internalReq = await fetch(
        "https://prem.zen-platform.ceccun.com/site.json"
    );

    if (!internalReq.ok) return;

    const internalReqJSON = await internalReq.json();

    if (internalReqJSON.type == "highspeed") {
        buildingNotice.style.display = "flex";
    }
};

checkInternalStatus();
