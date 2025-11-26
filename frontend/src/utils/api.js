const api = {
    base: "", // Relative path for same-origin
    async post(path, body, token) {
        const res = await fetch(api.base + path, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        });
        return res.json();
    },
    async get(path, token) {
        const res = await fetch(api.base + path, {
            method: "GET",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });
        return res.json();
    }
};

export default api;
