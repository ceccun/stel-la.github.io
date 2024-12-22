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

            blocksLogs.push(data);
            ls.setItem("blocksLogs", JSON.stringify(blocksLogs));

            return data;
        }

        return null;
    } catch (err) {
        return null;
    }
}
