// Streams a Blocks answer from the LLM-backed endpoint. Only works when the
// user is logged in (the endpoint requires auth). Calls onChunk(text) for each
// content token, onDone() when finished, onError(err) on failure.
//
// Returns an AbortController-like object with .cancel() so the caller can stop
// the stream early (e.g. when navigating away).
function streamChallenge(query, results, onChunk, onDone, onError) {
    const ls = window.localStorage;
    const token = ls.getItem("token");

    if (!token) {
        if (onError) onError(new Error("Not authenticated"));
        return { cancel: () => {} };
    }

    const controller =
        typeof AbortController !== "undefined" ? new AbortController() : null;

    (async function run() {
        try {
            const response = await fetch(`${API_DOMAIN}/blocks/stream`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify({
                    query,
                    results: (results || []).map((r) => ({
                        title: r.title,
                        url: r.url,
                        content: r.content,
                    })),
                }),
                signal: controller ? controller.signal : undefined,
            });

            if (!response.ok || !response.body) {
                if (onError) onError(new Error("HTTP " + response.status));
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });

                // SSE frames are separated by blank lines.
                const frames = buffer.split("\n\n");
                buffer = frames.pop() || "";

                for (const frame of frames) {
                    const line = frame.trim();
                    if (!line.startsWith("data:")) continue;
                    const payload = line.slice(5).trim();
                    if (!payload) continue;
                    if (payload === "[DONE]") {
                        if (onDone) onDone();
                        return;
                    }
                    try {
                        const parsed = JSON.parse(payload);
                        if (typeof parsed.content === "string") {
                            if (onChunk) onChunk(parsed.content);
                        }
                    } catch {
                        // ignore malformed frames
                    }
                }
            }

            if (onDone) onDone();
        } catch (err) {
            if (err && err.name === "AbortError") return;
            if (onError) onError(err);
        }
    })();

    return {
        cancel: () => {
            if (controller) controller.abort();
        },
    };
}

async function challenge(query) {
    const ls = window.localStorage;
    let blocksLogs = ls.getItem("blocksLogs");

    const token = ls.getItem("token");

    if (!blocksLogs) {
        blocksLogs = JSON.stringify([]);
        ls.setItem("blocksLogs", blocksLogs);
    }

    blocksLogs = JSON.parse(blocksLogs);

    try {
        const queryReq = await fetch(`${API_DOMAIN}/blocks/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? token : null,
            },
            body: JSON.stringify({ query }),
        });

        if (queryReq.status == 200) {
            const data = await queryReq.json();

            if (blocksLogs.length >= 100) {
                blocksLogs.shift();
            }

            // Tag entries with the Blocks variant that produced them so
            // tabs.html can label them correctly. Nano is the
            // member-only variant which is what hands back `alternatives`.
            blocksLogs.push({
                ...data,
                query,
                ts: Date.now(),
                version: data.alternatives ? "Nano" : "Free",
            });
            ls.setItem("blocksLogs", JSON.stringify(blocksLogs));

            return data;
        }

        return null;
    } catch (err) {
        return null;
    }
}
