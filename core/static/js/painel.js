function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-content');
    evt.currentTarget.classList.add('active');
}

async function loadOrders() {
    const container = document.getElementById("orders-list");
    if (!container) return;
    
    container.innerHTML = "<p>Buscando seus pedidos na adega... ⏳</p>";

    try {
        const data = await API.getPedidos();
        const orders = data.pedidos || [];

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
                <p style="color: #faa307; font-weight: bold; margin-top: -5px; margin-bottom: 15px;">
                    Status: ${order.status}
                </p>
                <p><strong>Data:</strong> ${order.data}</p>
                <p><strong>Itens:</strong><br> ${itensComprados}</p>
                <p><strong>Desconto Aplicado:</strong> ${order.descontoAplicado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <p class="order-total"><strong>Total:</strong> ${order.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <hr style="border-color: #faa307; opacity: 0.3; margin: 15px 0;">
            `;
            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p style='color: #ff4d4d;'>Erro ao conectar com o servidor. Tente atualizar a página.</p>";
    }
}

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    if (!container) return;

    container.innerHTML = "<p>Buscando suas garrafas favoritas... ⏳</p>";

    try {
        const data = await API.getFavoritos();
        const favorites = data.favoritos || [];

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
                        <p style="margin: 0; color: #faa307;">${item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    </div>
                </div>
                <hr style="border-color: #6a040f; margin: 10px 0;">
            `;
            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p style='color: #ff4d4d;'>Erro ao conectar com o servidor. Tente atualizar a página.</p>";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("orders-list")) {
        loadOrders();
        loadFavorites();
    }
});