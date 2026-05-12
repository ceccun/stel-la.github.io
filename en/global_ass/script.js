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

const API_DOMAIN = "https://deprecated-accounts.zen-platform.ceccun.com";

// === Cookie / consent management ===
// Consent is stored as a single JSON cookie so we can read all categories
// in one place. Schema:
//   { essential: true, functional: bool, version: 2, ts: number }
// Essential is always true; the user only chooses functional. We bump
// `version` whenever the categories change so we can re-prompt.
const COOKIE_CONSENT_KEY = "cookieConsent";
const COOKIE_CONSENT_VERSION = 2;

function readCookieConsent() {
    var raw = readCookie(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    try {
        var parsed = JSON.parse(decodeURIComponent(raw));
        if (parsed && parsed.version === COOKIE_CONSENT_VERSION) return parsed;
        return null;
    } catch (e) {
        return null;
    }
}

function saveCookieConsent(prefs) {
    var value = {
        essential: true,
        functional: !!prefs.functional,
        version: COOKIE_CONSENT_VERSION,
        ts: Date.now(),
    };
    // 365 days — under GDPR, consent should be refreshed periodically; one
    // year is a common middle ground. Encoded as URI-safe JSON.
    createCookie(COOKIE_CONSENT_KEY, encodeURIComponent(JSON.stringify(value)), 365);
    return value;
}

// Exposed so callers (e.g. titlescript.js) can gate optional features:
//   if (window.hasConsent("functional")) { ... }
window.hasConsent = function (category) {
    var c = readCookieConsent();
    if (!c) return false;
    if (category === "essential") return true;
    return c[category] === true;
};

window.openCookieBanner = function () {
    showCookieBanner(readCookieConsent());
};

function showCookieBanner(existing) {
    // If the banner is already mounted, surface it (don't duplicate).
    var existingEl = document.getElementById("cookienotfs");
    if (existingEl) {
        existingEl.setAttribute("class", "cookienotfs");
        return;
    }

    // Lazily load the banner stylesheet on first prompt.
    if (!document.getElementById("cookie-banner-css")) {
        var link = document.createElement("link");
        link.id = "cookie-banner-css";
        link.rel = "stylesheet";
        link.href = "/en/cookie-d.css";
        document.head.appendChild(link);
    }

    var wrap = document.createElement("div");
    wrap.id = "cookienotfs";
    wrap.className = "b-cookienotfs";

    var panel = document.createElement("div");
    panel.id = "cookienot";
    panel.className = "b-cookienot";

    var functionalChecked =
        existing && typeof existing.functional === "boolean"
            ? existing.functional
            : true;

    panel.innerHTML =
        '<div class="cookie-banner-header">' +
        '<img src="/images/privacy.svg" alt="" />' +
        "<h2>Cookies &amp; Privacy</h2>" +
        "</div>" +
        '<p class="cookie-banner-intro">' +
        "We use cookies and your browser's local storage to make Stella work. " +
        "Essential items (sign-in, sync, your preferences) are always on. " +
        "Optional items — like detecting your region to show local information " +
        "— only run if you opt in. " +
        '<a class="a" href="/en/id/privacy.html">Privacy Policy</a>.' +
        "</p>" +
        '<div class="cookie-category">' +
        "<label>" +
        '<input type="checkbox" checked disabled />' +
        "<span><strong>Essential</strong> — required to keep you signed in, " +
        "sync your Tabs and remember your settings. Always on.</span>" +
        "</label>" +
        "</div>" +
        '<div class="cookie-category">' +
        "<label>" +
        '<input type="checkbox" id="cookie-cat-functional"' +
        (functionalChecked ? " checked" : "") +
        " />" +
        "<span><strong>Functional</strong> — detect your region for local " +
        "information, and detect when you're connected to a Ceccun building " +
        "network.</span>" +
        "</label>" +
        "</div>" +
        '<div class="cookie-banner-actions">' +
        '<button class="cookie-btn cookie-btn-secondary" id="cookie-reject-all">Reject all</button>' +
        '<button class="cookie-btn cookie-btn-secondary" id="cookie-save-selected">Save choices</button>' +
        '<button class="cookie-btn cookie-btn-primary" id="cookie-accept-all">Accept all</button>' +
        "</div>";

    wrap.appendChild(panel);
    document.body.appendChild(wrap);

    var hide = function () {
        wrap.setAttribute("class", "b-cookienotfs");
        panel.setAttribute("class", "b-cookienot");
        setTimeout(function () {
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
        }, 400);
    };

    document
        .getElementById("cookie-accept-all")
        .addEventListener("click", function () {
            saveCookieConsent({ functional: true });
            hide();
        });

    document
        .getElementById("cookie-reject-all")
        .addEventListener("click", function () {
            saveCookieConsent({ functional: false });
            hide();
        });

    document
        .getElementById("cookie-save-selected")
        .addEventListener("click", function () {
            var functional = document.getElementById(
                "cookie-cat-functional"
            ).checked;
            saveCookieConsent({ functional: functional });
            hide();
        });

    // Fade + slide in on the next frame.
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            wrap.setAttribute("class", "cookienotfs");
            panel.setAttribute("class", "cookienot");
        });
    });
}

// Show the banner once per browser if the user hasn't recorded a choice yet
// (or their stored choice is from an older schema version). Available on
// every page that loads script.js — not gated on -d.html.
if (!readCookieConsent()) {
    if (document.body) {
        showCookieBanner(null);
    } else {
        document.addEventListener("DOMContentLoaded", function () {
            showCookieBanner(null);
        });
    }
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

const syncCats = ["tabs"];

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

    try {
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
                        ls.setItem(
                            "udownload",
                            JSON.stringify(unfinishedDownload)
                        );
                    }
                }
            }
        }

        ls.removeItem("local.deattached");
    } catch (error) {
        ls.setItem("local.deattached", "failure");
        done();
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
