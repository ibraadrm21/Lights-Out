const api = {
    base: "", // Relative path since served from same origin
    async post(path, body, token) {
        const headers = {
            "Content-Type": "application/json"
        };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(api.base + path, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        });
        return res.json();
    },
    async get(path, token) {
        const headers = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(api.base + path, {
            method: "GET",
            headers: headers
        });
        return res.json();
    }
};

export default api;
