const coordenadasEstados = {
    'AC': { lat: -9.974, lng: -67.807 }, 'AL': { lat: -9.665, lng: -35.735 },
    'AP': { lat: 0.034, lng: -51.066 }, 'AM': { lat: -3.101, lng: -60.025 },
    'BA': { lat: -12.971, lng: -38.510 }, 'CE': { lat: -3.717, lng: -38.543 },
    'DF': { lat: -15.779, lng: -47.929 }, 'ES': { lat: -20.315, lng: -40.312 },
    'GO': { lat: -16.686, lng: -49.264 }, 'MA': { lat: -2.538, lng: -44.282 },
    'MT': { lat: -15.596, lng: -56.096 }, 'MS': { lat: -20.442, lng: -54.646 },
    'MG': { lat: -19.920, lng: -43.937 }, 'PA': { lat: -1.455, lng: -48.502 },
    'PB': { lat: -7.115, lng: -34.863 }, 'PR': { lat: -25.428, lng: -49.273 },
    'PE': { lat: -8.047, lng: -34.877 }, 'PI': { lat: -5.089, lng: -42.801 },
    'RJ': { lat: -22.906, lng: -43.172 }, 'RN': { lat: -5.794, lng: -35.211 },
    'RS': { lat: -30.027, lng: -51.228 }, 'RO': { lat: -8.761, lng: -63.903 },
    'RR': { lat: 2.823, lng: -60.675 }, 'SC': { lat: -27.596, lng: -48.549 },
    'SP': { lat: -23.548, lng: -46.636 }, 'SE': { lat: -10.947, lng: -37.073 },
    'TO': { lat: -10.212, lng: -48.356 }
};

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

Store.subscribe((state) => {
    renderizarCarrinho(state.carrinho, state.descontoAtivo, state.frete);
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

function renderizarCarrinho(carrinho, descontoAtivo, frete = 0) {
    const cartItemsContainer = document.getElementById("cart-items-container"); 
    const cartCount = document.getElementById("cart-counter"); 
    const cartTotal = document.getElementById("cart-total-value"); 
    const cartDiscount = document.getElementById("cart-discount-info"); 

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    
    let subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    if (cartCount) cartCount.innerText = totalItens;

    if (carrinho.length === 0) {
        cartItemsContainer.innerHTML = "<p style='text-align:center; padding: 20px;'>Seu carrinho está vazio 🍷</p>";
        if (cartTotal) cartTotal.innerText = "R$ 0,00";
        if (cartDiscount) cartDiscount.innerText = "";
        return;
    }

    carrinho.forEach(item => {
        let div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.imagem}" alt="${item.titulo}" style="width: 50px; border-radius: 5px;">
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
    
    if (descontoAtivo > 0 && subtotal >= 100) {
        valorDesconto = subtotal * descontoAtivo;
        if (cartDiscount) {
            cartDiscount.innerText = `Desconto aplicado: - ${valorDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`;
        }
    } else {
        if (cartDiscount) cartDiscount.innerText = "";
    }

    let totalFinal = subtotal - valorDesconto + (frete || 0);
    
    if (cartTotal) {
        cartTotal.innerText = totalFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
    }
}

async function calcularFrete(cepAutomatico = null) {
    const cepInput = document.getElementById("input-cep");
    const infoText = document.getElementById("shipping-info");
    
    if (cepAutomatico && cepInput) {
        cepInput.value = cepAutomatico;
    }

    const rawCep = cepInput ? cepInput.value : (cepAutomatico || "");
    const cep = rawCep.replace(/\D/g, '');

    if (cep.length !== 8) {
        if (!cepAutomatico) mostrarToast("CEP inválido! Digite 8 números.");
        return;
    }

    infoText.style.display = "block";
    infoText.textContent = "Calculando logística... ⏳";

    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (data.erro) throw new Error("CEP não encontrado");

        const latOrigem = -22.2828; 
        const lonOrigem = -42.5364;

        let valorFrete = 15.00; 
        let distanciaKm = 0;

        if (data.localidade === "Nova Friburgo") {
            valorFrete = 8.00; 
            infoText.innerHTML = `🛵 Entrega Expressa em <strong>${data.localidade}</strong><br>Frete: R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
        } else if (coordenadasEstados[data.uf]) {
            const dest = coordenadasEstados[data.uf];
            distanciaKm = calcularDistancia(latOrigem, lonOrigem, dest.lat, dest.lng);
            
            valorFrete = 15.00 + (distanciaKm * 0.02);
            
            if (valorFrete > 150) valorFrete = 150;

            infoText.innerHTML = `🚚 Entrega em <strong>${data.localidade}/${data.uf}</strong> (~${Math.round(distanciaKm)} km)<br>Frete: R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
        }

        Store.setState({ frete: valorFrete });

    } catch (error) {
        infoText.textContent = "Erro ao calcular frete. Verifique o CEP.";
        Store.setState({ frete: 0 });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    Store.notify(); 

    if (window.CLIENT_DATA && window.CLIENT_DATA.logado && window.CLIENT_DATA.cep) {
        calcularFrete(window.CLIENT_DATA.cep);
    }
});