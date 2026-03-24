function openTab(evt, tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active-content');
    evt.currentTarget.classList.add('active');
}

async function loadOrders() {
    const container = document.getElementById("orders-list");
    if (!container) return;
    
    container.textContent = "Buscando seus pedidos na adega... ⏳";

    try {
        const data = await API.getPedidos();
        const orders = data.pedidos || [];

        container.textContent = ""; 

        if (orders.length === 0) {
            container.textContent = "Você ainda não fez nenhum pedido na Casa da Birita. 🍻";
            return;
        }

        const template = document.getElementById("order-card-template");

        orders.forEach(order => {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector(".order-id").textContent = order.id;
            clone.querySelector(".order-status").textContent = `Status: ${order.status}`;
            clone.querySelector(".date-val").textContent = order.data;
            
            const itemsList = clone.querySelector(".order-items-list");
            order.itens.forEach(item => {
                const li = document.createElement("li");
                li.textContent = `${item.quantidade}x ${item.titulo}`;
                itemsList.appendChild(li);
            });

            clone.querySelector(".discount-val").textContent = order.descontoAplicado.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
            clone.querySelector(".total-val").textContent = order.total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

            container.appendChild(clone);
        });
    } catch (error) {
        container.textContent = "Erro ao conectar com o servidor. Tente atualizar a página.";
        container.classList.add("error-text");
    }
}

async function loadFavorites() {
    const container = document.getElementById("favorites-list");
    if (!container) return;

    container.textContent = "Buscando suas garrafas favoritas... ⏳";

    try {
        const data = await API.getFavoritos();
        const favorites = data.favoritos || [];

        container.textContent = "";

        if (favorites.length === 0) {
            container.textContent = "Você ainda não favoritou nenhuma garrafa. ❤️";
            return;
        }

        const template = document.getElementById("favorite-card-template");

        favorites.forEach(item => {
            const clone = template.content.cloneNode(true);
            
            const img = clone.querySelector(".favorite-img");
            img.src = item.imagem;
            img.alt = item.titulo;
            
            clone.querySelector(".favorite-title").textContent = item.titulo;
            clone.querySelector(".favorite-price").textContent = item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

            container.appendChild(clone);
        });
    } catch (error) {
        container.textContent = "Erro ao conectar com o servidor. Tente atualizar a página.";
        container.classList.add("error-text");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("orders-list")) {
        loadOrders();
        loadFavorites();
    }
});