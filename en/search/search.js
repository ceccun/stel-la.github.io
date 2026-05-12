// query, title and search-box value are set up by the inline script in
// search/index.html. The inline script also calls window.runBlocks(query,
// results) once SearXNG results are in, so we can feed them to the LLM.

var query = new URL(window.location).searchParams.get("q");

// Holds {query, results} when the user hasn't consented yet — replayed once
// they accept the consent prompt.
var pendingBlocksArgs = null;
// Active stream handle so a new search can cancel the previous one.
var activeBlocksStream = null;

function getBlocksDOM() {
    return {
        box: document.getElementsByClassName("block-results")[0],
        searching: document.getElementsByClassName("blocks-searching")[0],
        info: document.getElementsByClassName("blocks-information")[0],
        agreement: document.getElementsByClassName("blocks-agreement")[0],
        consentBtn: document.getElementById("blocks-consent-btn"),
        strips: document.getElementById("rainbow-strips"),
        ball: document.getElementById("blocks-search-ball"),
    };
}

function hasBlocksConsent() {
    var settings = window.localStorage.getItem("local.settings");
    if (!settings) return false;
    try {
        return JSON.parse(settings).blocks === true;
    } catch (_) {
        return false;
    }
}

function setBlocksConsent() {
    var ls = window.localStorage;
    var settings = ls.getItem("local.settings");
    settings = settings ? JSON.parse(settings) : {};
    settings.blocks = true;
    ls.setItem("local.settings", JSON.stringify(settings));
}

function showConsentPrompt(dom) {
    dom.searching.classList.add("hidden");
    dom.info.classList.add("hidden");
    dom.strips.classList.add("hidden");
    dom.agreement.classList.remove("hidden");

    // The "I agree" button replays whatever query/results are queued.
    var btn = dom.consentBtn;
    // Replace the node to clear any prior listeners — keeps replays clean
    // when several searches happen before consent is granted.
    var fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);
    fresh.addEventListener("click", function () {
        setBlocksConsent();
        dom.agreement.classList.add("hidden");
        dom.searching.classList.remove("hidden");
        if (pendingBlocksArgs) {
            var args = pendingBlocksArgs;
            pendingBlocksArgs = null;
            window.runBlocks(args.query, args.results);
        }
    });
}

function resetBlocksUI(dom) {
    dom.agreement.classList.add("hidden");
    dom.info.classList.add("hidden");
    dom.info.innerHTML = "";
    dom.strips.classList.add("hidden");
    dom.strips.innerHTML = "";
    dom.ball.classList.remove("scaleOut");
    dom.searching.classList.remove("hidden", "fadeOut", "fadeIn");
    dom.box.classList.remove("hidden");
    dom.box.classList.add("looking");
    document.getElementById("blocks-status").innerText = "Blocks is thinking...";
}

// === Streaming LLM path (logged-in users) ===
// Rainbow palette mirrors .rainbow-strip — works the same in light + dark.
var BLOCKS_RAINBOW = [
    "#ff0000",
    "#ff1493",
    "#ff8c00",
    "#00ff00",
    "#00bfff",
    "#0000ff",
    "#8a2be2",
];

function runBlocksStream(query, results, dom) {
    if (activeBlocksStream && activeBlocksStream.cancel) {
        activeBlocksStream.cancel();
    }
    resetBlocksUI(dom);

    var messageElem = document.createElement("p");
    dom.info.appendChild(messageElem);

    var buffer = "";
    var revealed = false;
    var colorIdx = 0;

    activeBlocksStream = streamChallenge(
        query,
        results,
        function onChunk(chunk) {
            // Append each token as its own span so the per-chunk rainbow→
            // text-color animation can run independently. We never touch
            // existing spans, so already-faded text stays put.
            var span = document.createElement("span");
            span.className = "blocks-stream-chunk";
            span.style.setProperty(
                "--bs-color",
                BLOCKS_RAINBOW[colorIdx % BLOCKS_RAINBOW.length]
            );
            span.textContent = chunk;
            messageElem.appendChild(span);
            colorIdx++;

            buffer += chunk;

            if (!revealed) {
                revealed = true;
                dom.ball.classList.add("scaleOut");
                dom.searching.classList.add("hidden");
                dom.info.classList.remove("hidden");
                dom.info.classList.add("fadeIn");
                dom.box.classList.remove("looking");
            }
        },
        function onDone() {
            activeBlocksStream = null;

            if (!revealed) {
                // Stream finished without emitting any tokens — treat like
                // the legacy "no answer" case and hide the box.
                dom.box.classList.add("hidden");
                return;
            }

            var disclaimerBar = document.createElement("div");
            disclaimerBar.classList.add("blocks-disclaimer-bar");

            var disclaimer = document.createElement("p");
            disclaimer.innerText = "Blocks Pro is experimental";
            disclaimer.style.fontSize = "14px";
            disclaimer.style.opacity = 0.5;
            disclaimerBar.appendChild(disclaimer);

            dom.info.appendChild(disclaimerBar);

            // Mirror what the legacy path did: cache the result for the
            // Blocks history shown on tabs.html. Tagged with `version` so
            // the history page can label entries correctly instead of
            // inferring from the (legacy-only) `alternatives` field.
            try {
                var ls = window.localStorage;
                var logs = ls.getItem("blocksLogs");
                logs = logs ? JSON.parse(logs) : [];
                if (logs.length >= 100) logs.shift();
                logs.push({
                    title: "Answer",
                    message: buffer,
                    query: query,
                    ts: Date.now(),
                    version: "Pro",
                });
                ls.setItem("blocksLogs", JSON.stringify(logs));
            } catch (_) {}
        },
        function onError(err) {
            activeBlocksStream = null;
            console.warn("Blocks stream error:", err);
            if (!revealed) {
                dom.box.classList.add("hidden");
            }
        }
    );
}

// === Legacy Wikipedia path (logged-out users) ===
// Largely the original blockProcess body, kept for users without a token.
async function runBlocksLegacy(query, dom) {
    resetBlocksUI(dom);

    var data = await challenge(query);
    dom.ball.classList.add("scaleOut");

    if (data == null) {
        return setTimeout(function () {
            dom.box.classList.add("hidden");
        }, 800);
    }

    dom.box.classList.remove("looking");

    var titleElem = document.createElement("h2");
    titleElem.innerText = data.title;

    var messageElem = document.createElement("p");
    messageElem.innerText = data.message;

    dom.info.appendChild(titleElem);
    dom.info.appendChild(messageElem);

    dom.info.classList.remove("hidden");
    var informationSize = dom.info.getBoundingClientRect();
    dom.info.classList.add("hidden");
    var strips = Math.max(1, (informationSize.height + 16) / 24);

    setTimeout(function () {
        dom.searching.classList.add("hidden");
        dom.strips.classList.remove("hidden");

        for (var i = 0; i < strips; i++) {
            var strip = document.createElement("div");
            strip.classList.add("rainbow-strip");
            strip.style.width = "100%";
            if (i === 0) strip.style.width = "70px";
            if (i === strips - 1) {
                strip.style.width = Math.floor(Math.random() * 70) + "%";
            }
            strip.style.height = "16px";

            (function (idx) {
                setTimeout(function () {
                    dom.strips.appendChild(strip);
                }, idx * 100);
            })(i);
        }

        setTimeout(function () {
            dom.strips.classList.add("fadeOut");
            setTimeout(function () {
                dom.strips.classList.remove("fadeOut");
                dom.strips.classList.add("hidden");
                dom.info.classList.remove("hidden");
                dom.info.classList.add("fadeIn");

                var disclaimerBar = document.createElement("div");
                disclaimerBar.classList.add("blocks-disclaimer-bar");

                var disclaimer = document.createElement("p");
                disclaimer.innerText = data.alternatives
                    ? "Blocks Nano is experimental and member only"
                    : "Blocks is experimental";
                disclaimer.style.fontSize = "14px";
                disclaimer.style.opacity = 0.5;
                disclaimerBar.appendChild(disclaimer);

                dom.info.appendChild(disclaimerBar);
            }, 300);
        }, strips * 100 + 300);
    }, 600);
}

// === Entry point — called from the search/index.html inline script after
// SearXNG returns text results. ===
window.runBlocks = function (query, results) {
    var dom = getBlocksDOM();
    if (!dom.box) return;

    if (!hasBlocksConsent()) {
        pendingBlocksArgs = { query: query, results: results };
        showConsentPrompt(dom);
        return;
    }

    var token = window.localStorage.getItem("token");
    if (token) {
        runBlocksStream(query, results, dom);
    } else {
        runBlocksLegacy(query, dom);
    }
};

// Called by the inline script when an infobox arrives — aborts any in-flight
// LLM stream and clears the pending queue so Blocks won't replay later.
window.cancelBlocks = function () {
    pendingBlocksArgs = null;
    if (activeBlocksStream && activeBlocksStream.cancel) {
        activeBlocksStream.cancel();
        activeBlocksStream = null;
    }
};

// On page load, if the user already consented and there are no results yet,
// keep the "thinking" indicator visible. Otherwise, surface the consent
// prompt right away so the user isn't staring at a frozen spinner.
(function init() {
    var dom = getBlocksDOM();
    if (!dom.box) return;
    if (!hasBlocksConsent()) {
        showConsentPrompt(dom);
    }
})();

function waitForElm(selector) {
    return new Promise(function (resolve) {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        var observer = new MutationObserver(function () {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
}
