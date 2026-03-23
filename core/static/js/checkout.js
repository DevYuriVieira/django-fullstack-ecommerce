async function finalizarCompra() {
    if (carrinho.length === 0) {
        mostrarToast("Seu carrinho está vazio! Adicione uma birita. 🛒");
        return; 
    }

    let totalAtual = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let valorDesconto = (descontoAtivo > 0 && totalAtual >= 100) ? (totalAtual * descontoAtivo) : 0;
    let precoFinal = totalAtual - valorDesconto;
    let numeroPedido = 'PED-' + Math.floor(Math.random() * 1000000); 

    let payload = {
        numero: numeroPedido,
        total: precoFinal,
        desconto: valorDesconto,
        itens: carrinho.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            preco: item.preco
        }))
    };

    try {
        let data = await API.criarPedido(payload);

        if (data.status === "sucesso") {
            carrinho = [];
            descontoAtivo = 0;
            localStorage.removeItem("meuCarrinho");
            localStorage.removeItem("meuCupom");

            atualizarInterfaceCarrinho();
            fecharCarrinho();

            mostrarToast(`Sucesso! Pedido ${numeroPedido} salvo no banco! 🎉`);
        } else {
            mostrarToast("Erro ao processar: " + data.mensagem);
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        mostrarToast("Você precisa fazer login para finalizar a compra! 🔒");
    }
}