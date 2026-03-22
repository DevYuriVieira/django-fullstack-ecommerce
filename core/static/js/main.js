let carrinho = JSON.parse(localStorage.getItem("meuCarrinho")) || [];
let descontoAtivo = parseFloat(localStorage.getItem("meuCupom")) || 0; 

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
    if (document.getElementById('cart-items-container')) {
        atualizarInterfaceCarrinho();
    }
    
    const inputBusca = document.getElementById('searchInput');
    if (inputBusca) {
        inputBusca.addEventListener('input', debounce(function(event) {
            realizarBusca(event.target.value);
        }, 300));
    }
});