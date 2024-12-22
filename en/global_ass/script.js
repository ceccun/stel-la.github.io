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

const API_DOMAIN = "https://deprecated-accounts.zen-platform.ceccun.com/";

if (
    readCookie("cookiecons") == null &&
    document.URL.split("?")[0].endsWith("d.html")
) {
    document.body.innerHTML =
        document.body.innerHTML +
        '<div id="cookienotfs" class="b-cookienotfs"><div id="cookienot" class="b-cookienot"><center><image src="/images/privacy.svg" style="width: 40%;"><h2>Before you continue</h2><p>Stella utilises technologies such as cookies (e.g web beacons, flash cookies, .etc)("cookies") to refine your experience and maximise performance on their sites. These cookies are collected when necessary and do not contain information that can uniquely identify you as an individual user. If you agree, Stella and their partners can use cookies to store, cache and control your session while using their sites.<br>Due to the technical limitations, if you do not consent to the usage of cookies, you should not visit any Stella site, including this one, for the next 30 days to confirm all cookies have been removed from your device.</p><button class="agreebtn" onclick="acceptcookienot()">I agree</button></center></div></div><link href="/en/cookie-d.css" rel="stylesheet"/>';
    setTimeout(function () {
        document
            .getElementById("cookienotfs")
            .setAttribute("class", "cookienotfs");
        document.getElementById("cookienot").setAttribute("class", "cookienot");
    }, 300);
}

function acceptcookienot() {
    createCookie("cookiecons", "1", 30);
    setTimeout(() => {
        document
            .getElementById("cookienotfs")
            .setAttribute("class", "b-cookienotfs");
        document
            .getElementById("cookienot")
            .setAttribute("class", "b-cookienot");
    }, 300);
    setTimeout(() => {
        document
            .getElementById("cookienotfs")
            .setAttribute("style", "display: none");
        document
            .getElementById("cookienot")
            .setAttribute("style", "display: none;");
        window.location.replace("");
    }, 500);
}

function updateTabs() {
    // Check for clients using Tabs 1.0 and update them to the new Tabs experience.
    const tabs = readCookie("tabs");

    if (tabs == null) {
        return;
    }

    const url = document.location.href;

    return window.location.replace(
        `/en/upgrade-tabs.html?next=${encodeURIComponent(url)}`
    );
}

updateTabs();

async function checkSettingsExist() {
    const ls = window.localStorage;
    const token = ls.getItem("token");

    if (!token) {
        return;
    }

    let localSettings = ls.getItem("local.settings");

    if (!localSettings) {
        return window.location.replace(
            `/en/id/sync-notice?cb=${encodeURIComponent(window.location.href)}`
        );
    }

    localSettings = JSON.parse(localSettings);

    if (!localSettings["sync"]) {
        return window.location.replace(
            `/en/id/sync-notice?cb=${encodeURIComponent(window.location.href)}`
        );
    }

    // const f = await fetch(`${API_DOMAIN}/user/get`, {
    //     method: "GET",
    //     headers: {
    //         Authorization: token,
    //     },
    // });
}

async function sync(done = () => {}) {
    // Check if the user is logged in
    const ls = window.localStorage;
    const token = ls.getItem("token");

    if (!token) return done();

    // Check if the user has settings

    let localSettings = ls.getItem("local.settings");

    if (!localSettings) return done();

    // Check if the user is syncing
    localSettings = JSON.parse(localSettings);

    if (!localSettings.sync) return done();

    // Get unfinished syncs
    let unfinishedUpload = ls.getItem("uupload");
    let unfinishedDownload = ls.getItem("udownload");
    let unfinishedRemove = ls.getItem("uremove");

    if (unfinishedRemove) {
        unfinishedRemove = JSON.parse(unfinishedRemove);

        for (let i = 0; i < unfinishedRemove.length; i++) {
            const item = unfinishedRemove[i];

            if (item == "tabs") {
                let removedTabs = ls.getItem("removedTabs");

                if (!removedTabs) {
                    continue;
                } else {
                    removedTabs = JSON.parse(removedTabs);
                }

                const sanitisedTabs = removedTabs.filter((tab) => {
                    return tab.query != null && tab.type != undefined;
                });

                const f = await fetch(`${API_DOMAIN}/tabs/remove`, {
                    method: "POST",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sanitisedTabs),
                });

                if (f.status == 200) {
                    unfinishedRemove.splice(i, 1);
                    ls.setItem("uremove", JSON.stringify(unfinishedRemove));
                    ls.removeItem("removedTabs");
                }
            }
        }
    }

    if (unfinishedUpload) {
        unfinishedUpload = JSON.parse(unfinishedUpload);

        for (let i = 0; i < unfinishedUpload.length; i++) {
            const item = unfinishedUpload[i];

            if (item == "tabs") {
                let tabs = ls.getItem("tabs");

                if (!tabs) {
                    continue;
                }

                tabs = JSON.parse(tabs);

                const f = await fetch(`${API_DOMAIN}/tabs/sync`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                    body: JSON.stringify(tabs),
                });

                if (f.status == 200) {
                    unfinishedUpload.splice(i, 1);
                    ls.setItem("uupload", JSON.stringify(unfinishedUpload));
                }
            }
        }
    }

    if (unfinishedDownload) {
        unfinishedDownload = JSON.parse(unfinishedDownload);

        for (let i = 0; i < unfinishedDownload.length; i++) {
            const item = unfinishedDownload[i];

            if (item == "tabs") {
                const f = await fetch(`${API_DOMAIN}/tabs/get`, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                if (f.status == 200) {
                    const data = await f.json();

                    ls.setItem("tabs", JSON.stringify(data));
                    unfinishedDownload.splice(i, 1);
                    ls.setItem("udownload", JSON.stringify(unfinishedDownload));
                }
            }
        }
    }

    done();
}

function addSyncTask(type, task) {
    const ls = window.localStorage;

    let unfinished = ls.getItem(`u${type}`);

    if (!unfinished) {
        unfinished = [];
    } else {
        unfinished = JSON.parse(unfinished);
    }

    if (unfinished.includes(task)) {
        return;
    }

    unfinished.push(task);

    ls.setItem(`u${type}`, JSON.stringify(unfinished));
}

checkSettingsExist();
sync();
