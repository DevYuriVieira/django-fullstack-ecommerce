function abrirAba(evt, nomeAba) {
    let conteudos = document.getElementsByClassName("tab-content");
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].style.display = "none";
    }
    
    let botoes = document.getElementsByClassName("tab-btn");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].className = botoes[i].className.replace(" active", "");
    }
    
    document.getElementById(nomeAba).style.display = "block";
    evt.currentTarget.className += " active";
}

function abrirCarrinho() {
    document.getElementById('cartSidebar').classList.add('active');
    document.getElementById('cartOverlay').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function fecharCarrinho() {
    document.getElementById('cartSidebar').classList.remove('active');
    document.getElementById('cartOverlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

let carrinho = JSON.parse(localStorage.getItem("meuCarrinho")) || [];
let descontoAtivo = 0; 

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

function atualizarInterfaceCarrinho() {
    let container = document.getElementById('cart-items-container');
    let contador = document.getElementById('cart-counter');
    let totalElemento = document.getElementById('cart-total-value');
    let divDesconto = document.getElementById('cart-discount-info'); // Pega a div do desconto

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
                    <p class="item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    
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

    let valorDesconto = totalPreco * descontoAtivo;
    let precoFinal = totalPreco - valorDesconto;

    contador.innerText = totalItens;
    totalElemento.innerText = `R$ ${precoFinal.toFixed(2).replace('.', ',')}`;

    if (divDesconto) {
        if (descontoAtivo > 0 && totalPreco > 0) {
            divDesconto.innerHTML = `Desconto aplicado: <strong>- R$ ${valorDesconto.toFixed(2).replace('.', ',')}</strong>`;
            divDesconto.style.display = 'block';
        } else {
            divDesconto.style.display = 'none';
        }
    }

    localStorage.setItem("meuCarrinho", JSON.stringify(carrinho));
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

function aplicarCupom() {
    let inputCupom = document.getElementById('input-cupom').value.trim().toUpperCase();
    
    if (inputCupom === 'BIRITA10') {
        descontoAtivo = 0.10; 
        mostrarToast("Cupom BIRITA10 aplicado! 10% OFF 🍻");
    } else if (inputCupom === '') {
        descontoAtivo = 0; 
    } else {
        descontoAtivo = 0;
        mostrarToast("Cupom inválido! ❌");
    }
    
    atualizarInterfaceCarrinho();
}

function mostrarToast(mensagem = "Adicionado ao carrinho 🛒") {
    let toast = document.getElementById("toast");
    toast.innerText = mensagem; 
    toast.classList.add("show");
    
    setTimeout(function() {
        toast.classList.remove("show");
    }, 3000);
}

function debounce(func, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

function realizarBusca(termo) {
    let textoBuscado = termo.toLowerCase();
    console.log("Buscando no sistema por:", textoBuscado);
}

document.addEventListener("DOMContentLoaded", function() {
    atualizarInterfaceCarrinho();
    const inputBusca = document.getElementById('searchInput');
    if (inputBusca) {
        inputBusca.addEventListener('input', debounce(function(event) {
            realizarBusca(event.target.value);
        }, 300));
    }
});

