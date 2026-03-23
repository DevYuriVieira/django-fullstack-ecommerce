async function alternarFavorito(id, titulo, preco, imagem) {
    let botaoCoracao = document.getElementById(`fav-${id}`);

    try {
        let data = await API.toggleFavorito(id);

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
        mostrarToast("Faça login para favoritar! 🔒");
    }
}

async function pintarCoracoes() {
    try {
        let data = await API.getFavoritos();
        let favoritos = data.favoritos || [];
        
        favoritos.forEach(item => {
            let botaoCoracao = document.getElementById(`fav-${item.id}`);
            if (botaoCoracao) {
                botaoCoracao.innerText = "❤️";
            }
        });
    } catch (error) {
        console.log("Usuário visitante ou erro ao buscar favoritos.");
    }
}

document.addEventListener("DOMContentLoaded", pintarCoracoes);