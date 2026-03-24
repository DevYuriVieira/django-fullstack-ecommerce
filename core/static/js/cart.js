Store.subscribe((state) => {
    renderizarCarrinho(state.carrinho, state.descontoAtivo);
});

function adicionarAoCarrinho(id, titulo, preco, imagem) {
    let carrinhoAtual = [...Store.state.carrinho];
    let itemExistente = carrinhoAtual.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinhoAtual.push({ id, titulo, preco, imagem, quantidade: 1 });
    }

    Store.setState({ carrinho: carrinhoAtual });
    
    mostrarToast("Adicionado ao carrinho 🛒");
    abrirCarrinho();
}

function removerDoCarrinho(id) {
    let carrinhoAtual = Store.state.carrinho.filter(item => item.id !== id);
    Store.setState({ carrinho: carrinhoAtual });
}

function alterarQuantidade(id, mudanca) {
    let carrinhoAtual = [...Store.state.carrinho];
    let item = carrinhoAtual.find(item => item.id === id);
    
    if (item) {
        item.quantidade += mudanca;
        if (item.quantidade <= 0) {
            carrinhoAtual = carrinhoAtual.filter(i => i.id !== id);
        }
        Store.setState({ carrinho: carrinhoAtual });
    }
}

function renderizarCarrinho(carrinho, descontoAtivo) {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");
    const cartDiscount = document.getElementById("cart-discount");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    
    let total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    if (cartCount) cartCount.innerText = totalItens;

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center; padding: 20px;'>Seu carrinho está vazio 🍷</p>";
        cartTotal.innerText = "R$ 0,00";
        if (cartDiscount) cartDiscount.innerText = "";
        return;
    }

    carrinho.forEach(item => {
        let subtotal = item.preco * item.quantidade;
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.titulo}">
            <div class="cart-item-info">
                <h4>${item.titulo}</h4>
                <p>${item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                <div class="cart-item-actions">
                    <button onclick="alterarQuantidade(${item.id}, -1)">-</button>
                    <span>${item.quantidade}</span>
                    <button onclick="alterarQuantidade(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removerDoCarrinho(${item.id})">🗑️</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    let valorDesconto = 0;
    if (descontoAtivo > 0 && total >= 100) {
        valorDesconto = total * descontoAtivo;
        let precoComDesconto = total - valorDesconto;
        cartTotal.innerText = precoComDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        if (cartDiscount) {
            cartDiscount.innerText = `Desconto aplicado: - ${valorDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        }
    } else {
        cartTotal.innerText = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
        if (cartDiscount) cartDiscount.innerText = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Store.notify(); 
});