const api = {
    base: "", // Relative path for same-origin
    async post(path, body) {
        const token = localStorage.getItem("token");
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
    async get(path) {
        const token = localStorage.getItem("token");
        const res = await fetch(api.base + path, {
            method: "GET",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });
        return res.json();
    },
    async put(path, body) {
        const token = localStorage.getItem("token");
        const res = await fetch(api.base + path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            },
            body: JSON.stringify(body)
        });
        return res.json();
    },
    async delete(path) {
        const token = localStorage.getItem("token");
        const res = await fetch(api.base + path, {
            method: "DELETE",
            headers: {
                ...(token ? { "Authorization": `Bearer ${token}` } : {})
            }
        });
        return res.json();
    }
};

export default api;
