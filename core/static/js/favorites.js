function alternarFavorito(id, titulo, preco, imagem) {
    let favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
    let index = favoritos.findIndex(item => item.id === id);
    let botaoCoracao = document.getElementById(`fav-${id}`);

    if (index !== -1) {
        favoritos.splice(index, 1);
        mostrarToast("Removido dos favoritos 💔");
        if (botaoCoracao) botaoCoracao.innerText = "🤍"; 
    } else {
        favoritos.push({
            id: id,
            titulo: titulo,
            preco: parseFloat(preco.toString().replace(',', '.')),
            imagem: imagem
        });
        mostrarToast("Adicionado aos favoritos ❤️");
        if (botaoCoracao) botaoCoracao.innerText = "❤️"; 
    }

    localStorage.setItem("meusFavoritos", JSON.stringify(favoritos));
}

document.addEventListener("DOMContentLoaded", function() {
    let favoritos = JSON.parse(localStorage.getItem("meusFavoritos")) || [];
    favoritos.forEach(item => {
        let botaoCoracao = document.getElementById(`fav-${item.id}`);
        if (botaoCoracao) {
            botaoCoracao.innerText = "❤️";
        }
    });
});