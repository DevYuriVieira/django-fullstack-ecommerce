function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-content');
    evt.currentTarget.classList.add('active');
}

function loadOrders() {
    const orders = JSON.parse(localStorage.getItem("meusPedidos")) || [];
    const container = document.getElementById("orders-list");

    container.innerHTML = "";

    if (orders.length === 0) {
        container.innerHTML = "<p>Você ainda não fez nenhum pedido na Casa da Birita. 🍻</p>";
        return;
    }

    orders.forEach(order => {
        let itensComprados = order.itens.map(item => `${item.quantidade}x ${item.titulo}`).join('<br>');

        const div = document.createElement("div");
        div.className = "order-card"; 
        div.innerHTML = `
            <h3>Pedido <span>${order.id}</span></h3>
            <p><strong>Data:</strong> ${order.data}</p>
            <p><strong>Itens:</strong><br> ${itensComprados}</p>
            <p><strong>Desconto Aplicado:</strong> R$ ${order.descontoAplicado.toFixed(2).replace('.', ',')}</p>
            <p class="order-total"><strong>Total:</strong> R$ ${order.total.toFixed(2).replace('.', ',')}</p>
            <hr style="border-color: #faa307; opacity: 0.3; margin: 15px 0;">
        `;
        container.appendChild(div);
    });
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
    const container = document.getElementById("favorites-list");

    container.innerHTML = "";

    if (favorites.length === 0) {
        container.innerHTML = "<p>Você ainda não favoritou nenhuma garrafa. ❤️</p>";
        return;
    }

    favorites.forEach(item => {
        const div = document.createElement("div");
        div.className = "favorite-card";
        div.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <img src="${item.imagem}" alt="${item.titulo}" style="width: 50px; border-radius: 8px;">
                <div>
                    <p style="margin: 0; font-weight: bold;">${item.titulo}</p>
                    <p style="margin: 0; color: #faa307;">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
            <hr style="border-color: #6a040f; margin: 10px 0;">
        `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("orders-list")) {
        loadOrders();
        loadFavorites();
    }
});