function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarToast("Seu carrinho está vazio! Adicione uma birita. 🛒");
        return; 
    }

    let totalAtual = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let valorDesconto = (descontoAtivo > 0 && totalAtual >= 100) ? (totalAtual * descontoAtivo) : 0;
    let precoFinal = totalAtual - valorDesconto;

    let numeroPedido = 'PED-' + Math.floor(Math.random() * 1000000); 
    
    let dataAtual = new Date();
    let dataFormatada = dataAtual.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    }).replace(',', ' -');

    let novoPedido = {
        id: numeroPedido,
        data: dataFormatada,
        itens: [...carrinho], 
        total: precoFinal,
        descontoAplicado: valorDesconto
    };

    let historicoPedidos = JSON.parse(localStorage.getItem("meusPedidos")) || [];
    historicoPedidos.unshift(novoPedido); 
    localStorage.setItem("meusPedidos", JSON.stringify(historicoPedidos));

    carrinho = [];
    descontoAtivo = 0;
    localStorage.removeItem("meuCarrinho");
    localStorage.removeItem("meuCupom");

    atualizarInterfaceCarrinho();
    fecharCarrinho();

    mostrarToast(`Sucesso! Pedido ${numeroPedido} salvo. 🎉`);
}