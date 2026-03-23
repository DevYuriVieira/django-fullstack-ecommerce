function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function alternarFavorito(id, titulo, preco, imagem) {
    let botaoCoracao = document.getElementById(`fav-${id}`);

    try {
        let response = await fetch('/api/favoritos/toggle/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken') 
            },
            body: JSON.stringify({ id: id })
        });

        let data = await response.json();

        if (data.status === "adicionado") {
            mostrarToast("Adicionado aos favoritos ❤️");
            if (botaoCoracao) botaoCoracao.innerText = "❤️"; 
        } else if (data.status === "removido") {
            mostrarToast("Removido dos favoritos 💔");
            if (botaoCoracao) botaoCoracao.innerText = "🤍"; 
        } else {
            mostrarToast("Você precisa estar logado! 🔒");
        }
    } catch (error) {
        console.error("Erro de comunicação com a API:", error);
        mostrarToast("Erro de conexão. Tente novamente.");
    }
}

async function pintarCoracoes() {
    try {
        let response = await fetch('/api/favoritos/');
        if (response.ok) {
            let data = await response.json();
            let favoritos = data.favoritos || [];
            
            favoritos.forEach(item => {
                let botaoCoracao = document.getElementById(`fav-${item.id}`);
                if (botaoCoracao) {
                    botaoCoracao.innerText = "❤️";
                }
            });
        }
    } catch (error) {
        console.log("Usuário visitante ou erro ao buscar favoritos.");
    }
}

document.addEventListener("DOMContentLoaded", pintarCoracoes);