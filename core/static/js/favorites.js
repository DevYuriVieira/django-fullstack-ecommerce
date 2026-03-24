async function alternarFavorito(id) {
    let botaoCoracao = document.getElementById(`fav-${id}`);
    if (!botaoCoracao) return;

    let estadoAnterior = botaoCoracao.innerText;
    let coracaoFicouVermelho = estadoAnterior === "🤍";

    botaoCoracao.innerText = coracaoFicouVermelho ? "❤️" : "🤍";

    try {
        await API.toggleFavorito(id);
        mostrarToast(coracaoFicouVermelho ? "Adicionado aos favoritos ❤️" : "Removido dos favoritos 💔");

    } catch (error) {
        console.error("Erro de comunicação com a API:", error);
        botaoCoracao.innerText = estadoAnterior; 
        mostrarToast("Você precisa fazer login para favoritar! 🔒");
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