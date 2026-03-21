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