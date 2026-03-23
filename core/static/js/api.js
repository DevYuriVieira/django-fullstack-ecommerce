function getCSRFToken() {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
                cookieValue = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const API = {
    criarPedido: async (payload) => {
        const res = await fetch("/api/v1/criar-pedido/", {  
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Não autorizado ou erro no servidor");
        return res.json();
    },

    getPedidos: async () => {
        const res = await fetch("/api/v1/pedidos/"); 
        if (!res.ok) throw new Error("Erro ao buscar pedidos");
        return res.json();
    },

    getFavoritos: async () => {
        const res = await fetch("/api/v1/favoritos/"); 
        if (!res.ok) throw new Error("Erro ao buscar favoritos");
        return res.json();
    },

    toggleFavorito: async (id) => {
        const res = await fetch("/api/v1/favoritos/toggle/", { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({ id: id })
        });
        if (!res.ok) throw new Error("Erro ao favoritar");
        return res.json();
    }
};