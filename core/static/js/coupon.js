function aplicarCupom() {
    let inputCupom = document.getElementById('input-cupom').value.trim().toUpperCase();
    let totalAtual = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

    if (inputCupom === 'BIRITA10') {
        descontoAtivo = 0.10; 
        
        if (totalAtual >= 100) {
            mostrarToast("Cupom BIRITA10 aplicado! 10% OFF 🍻");
        } else {
            mostrarToast("Cupom vinculado! Adicione mais itens para ativar. ⚠️");
        }
    } else if (inputCupom === '') {
        descontoAtivo = 0; 
        mostrarToast("Cupom removido!");
    } else {
        descontoAtivo = 0;
        mostrarToast("Cupom inválido! ❌");
    }
    
    atualizarInterfaceCarrinho();
}