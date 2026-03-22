function adicionarAoCarrinho(id, titulo, preco, imagem) {
    let precoNumerico = parseFloat(preco.toString().replace(',', '.'));
    let itemExistente = carrinho.find(item => item.id === id);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            titulo: titulo,
            preco: precoNumerico,
            imagem: imagem,
            quantidade: 1
        });
    }

    atualizarInterfaceCarrinho();
    mostrarToast(); 
}

function aumentarQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade += 1;
        atualizarInterfaceCarrinho();
    }
}

function diminuirQuantidade(id) {
    let item = carrinho.find(item => item.id === id);
    if (item) {
        item.quantidade -= 1;
        if (item.quantidade === 0) {
            removerDoCarrinho(id); 
        } else {
            atualizarInterfaceCarrinho();
        }
    }
}

function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    let container = document.getElementById('cart-items-container');
    let contador = document.getElementById('cart-counter');
    let totalElemento = document.getElementById('cart-total-value');
    let divDesconto = document.getElementById('cart-discount-info');
    let inputCupom = document.getElementById('input-cupom');

    if (!container) return; 

    container.innerHTML = ''; 
    let totalPreco = 0;
    let totalItens = 0;

    carrinho.forEach(item => {
        totalPreco += item.preco * item.quantidade;
        totalItens += item.quantidade;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.titulo}">
                <div class="item-info">
                    <h4>${item.titulo}</h4>
                    <p class="item-price">${item.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</p>
                    
                    <div class="cart-controls">
                        <button onclick="diminuirQuantidade('${item.id}')">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="aumentarQuantidade('${item.id}')">+</button>
                        <button class="btn-remove" onclick="removerDoCarrinho('${item.id}')">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    });

    let valorDesconto = 0;
    
    if (descontoAtivo > 0 && totalPreco >= 100) {
        valorDesconto = totalPreco * descontoAtivo;
    }
    
    let precoFinal = totalPreco - valorDesconto;

    contador.innerText = totalItens;
    totalElemento.innerText = precoFinal.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

    if (divDesconto) {
        if (descontoAtivo > 0 && totalPreco >= 100) {
            divDesconto.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>Subtotal:</span>
                    <span>${totalPreco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Desconto:</span>
                    <strong>- ${valorDesconto.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</strong>
                </div>
            `;
            divDesconto.style.color = '#faa307'; 
            divDesconto.style.display = 'block';
            if(inputCupom) inputCupom.value = 'BIRITA10'; 
        } else if (descontoAtivo > 0 && totalPreco > 0 && totalPreco < 100) {
            let falta = 100 - totalPreco;
            divDesconto.innerHTML = `⚠️ Faltam ${falta.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} para ativar o cupom!`;
            divDesconto.style.color = '#ff4d4d'; 
            divDesconto.style.display = 'block';
            if(inputCupom) inputCupom.value = 'BIRITA10'; 
        } else {
            divDesconto.style.display = 'none';
        }
    }

    localStorage.setItem("meuCarrinho", JSON.stringify(carrinho));
    localStorage.setItem("meuCupom", descontoAtivo.toString());
}