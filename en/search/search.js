var query = new URL(window.location).searchParams.get("q");
document.getElementById("title").innerText = "Stella - " + query;
document.getElementById("sb").value = query;
var qu = 0;

async function blockProcess() {
    const ls = window.localStorage;
    const localSettings = ls.getItem("local.settings");

    const searchBall = document.getElementById("blocks-search-ball");
    const blocksResultBox = document.getElementsByClassName("block-results")[0];
    const blocksInformation =
        document.getElementsByClassName("blocks-information")[0];
    const stripsArea = document.getElementById("rainbow-strips");
    const blocksConsentBtn = document.getElementById("blocks-consent-btn");
    const blocksAgreement =
        document.getElementsByClassName("blocks-agreement")[0];

    const consentAgree = () => {
        const ls = window.localStorage;

        let localSettings = ls.getItem("local.settings");
        if (!localSettings) {
            localSettings = JSON.stringify({});
        }
        localSettings = JSON.parse(localSettings);
        localSettings["blocks"] = true;
        ls.setItem("local.settings", JSON.stringify(localSettings));
        blocksAgreement.classList.add("hidden");
        document
            .getElementsByClassName("blocks-searching")[0]
            .classList.remove("hidden");
        blockProcess();
    };

    if (!localSettings) {
        document
            .getElementsByClassName("blocks-searching")[0]
            .classList.add("hidden");
        blocksAgreement.classList.remove("hidden");
        blocksConsentBtn.addEventListener("click", consentAgree);
        return;
    }

    const localSettingsParsed = JSON.parse(localSettings);

    if (!localSettingsParsed["blocks"]) {
        document
            .getElementsByClassName("blocks-searching")[0]
            .classList.add("hidden");

        blocksAgreement.classList.remove("hidden");
        blocksConsentBtn.addEventListener("click", consentAgree);
        return;
    }

    const data = await challenge(query);
    searchBall.classList.add("scaleOut");

    if (data == null) {
        return setTimeout(() => {
            blocksResultBox.classList.add("hidden");
        }, 800);
    }

    blocksResultBox.classList.remove("looking");

    const { title, message } = data;

    const titleElem = document.createElement("h2");
    titleElem.innerText = title;

    const messageElem = document.createElement("p");
    messageElem.innerText = message;

    blocksInformation.appendChild(titleElem);
    blocksInformation.appendChild(messageElem);

    blocksInformation.classList.remove("hidden");

    const informationSize = blocksInformation.getBoundingClientRect();

    blocksInformation.classList.add("hidden");
    const strips = (informationSize.height + 16) / 24;

    setTimeout(() => {
        document
            .getElementsByClassName("blocks-searching")[0]
            .classList.add("hidden");

        stripsArea.classList.remove("hidden");
        for (let i = 0; i < strips; i++) {
            const strip = document.createElement("div");
            strip.classList.add("rainbow-strip");
            strip.style.width = "100%";
            if (i == 0) {
                strip.style.width = `70px`;
            }

            if (i == strips - 1) {
                strip.style.width = `${Math.floor(Math.random() * 70)}%`;
            }
            strip.style.height = "16px";
            // strip.style.animationDelay = `${i * 0.1}s`;

            setTimeout(() => {
                stripsArea.appendChild(strip);
            }, i * 100);
        }

        setTimeout(() => {
            stripsArea.classList.add("fadeOut");
            setTimeout(() => {
                stripsArea.classList.remove("fadeOut");
                stripsArea.classList.add("hidden");

                blocksInformation.classList.remove("hidden");

                blocksInformation.classList.add("fadeIn");

                const disclaimerBar = document.createElement("div");
                disclaimerBar.classList.add("blocks-disclaimer-bar");

                const disclaimer = document.createElement("p");
                disclaimer.innerText = "Blocks is experimental";
                if (data.alternatives) {
                    disclaimer.innerText =
                        "Blocks Nano is experimental and member only";
                }
                disclaimer.style.fontSize = "14px";
                disclaimer.style.opacity = 0.5;

                disclaimerBar.appendChild(disclaimer);

                if (data.alternatives) {
                    const seeMoreLink = document.createElement("button");
                    seeMoreLink.classList.add("discrete-button");
                    seeMoreLink.innerText = "See an alternative";

                    data.alternatives.push(message);

                    let alternativeIndex = 0;

                    seeMoreLink.addEventListener("click", () => {
                        seeMoreLink.innerText = "See another alternative";

                        if (alternativeIndex >= data.alternatives.length) {
                            alternativeIndex = 0;
                        }

                        const alternative = data.alternatives[alternativeIndex];

                        blocksInformation.classList.add("fadeOut");

                        document.getElementById("blocks-status").innerText =
                            "Checking alternatives...";

                        setTimeout(() => {
                            blocksInformation.classList.remove("fadeOut");
                            blocksInformation.classList.add("hidden");

                            messageElem.innerText = alternative;

                            searchBall.classList.remove("scaleOut");

                            document
                                .getElementsByClassName("blocks-searching")[0]
                                .classList.remove("hidden");

                            document
                                .getElementsByClassName("blocks-searching")[0]
                                .classList.add("fadeIn");

                            setTimeout(() => {
                                document
                                    .getElementsByClassName(
                                        "blocks-searching"
                                    )[0]
                                    .classList.remove("fadeIn");

                                setTimeout(() => {
                                    searchBall.classList.add("scaleOut");

                                    setTimeout(() => {
                                        document
                                            .getElementsByClassName(
                                                "blocks-searching"
                                            )[0]
                                            .classList.add("fadeOut");

                                        setTimeout(() => {
                                            document
                                                .getElementsByClassName(
                                                    "blocks-searching"
                                                )[0]
                                                .classList.remove("fadeOut");
                                            document
                                                .getElementsByClassName(
                                                    "blocks-searching"
                                                )[0]
                                                .classList.add("hidden");

                                            blocksInformation.classList.remove(
                                                "hidden"
                                            );

                                            blocksInformation.classList.add(
                                                "fadeIn"
                                            );

                                            setTimeout(() => {
                                                blocksInformation.classList.remove(
                                                    "fadeIn"
                                                );
                                            }, 300);
                                        }, 300);
                                    }, 600);
                                }, 300);
                            }, 300);
                        }, 300);

                        alternativeIndex++;
                    });

                    disclaimerBar.appendChild(seeMoreLink);
                }

                blocksInformation.appendChild(disclaimerBar);
            }, 300);
        }, strips * 100 + 300);
    }, 600);
}

blockProcess();

// checkBlock(query);
function loadcall() {
    setTimeout("tab_location()", 300);
    // document.getElementById("resgog").setAttribute("style", "");
}

function waitForElm(selector) {
    return new Promise((resolve) => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver((mutations) => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

function tab_location() {
    var locator = window.location.toString();
    var locator = locator.split("#");
    if (locator[1].includes("gsc.tab=0") == true) {
        console.log(locator[1].includes("gsc.tab=0"));
        document
            .getElementById("text-btn")
            .setAttribute("class", "crossbar-button-active");
    }
    if (locator[1].includes("gsc.tab=1") == true) {
        console.log(locator[1].includes("gsc.tab=1"));
        document
            .getElementById("image-btn")
            .setAttribute("class", "crossbar-button-active");
    }
}
