async function finalizarCompra() {
    let carrinhoAtual = Store.state.carrinho;
    let desconto = Store.state.descontoAtivo;

    if (carrinhoAtual.length === 0) {
        mostrarToast("Seu carrinho está vazio! Adicione uma birita. 🛒");
        return; 
    }

    let totalAtual = carrinhoAtual.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let valorDesconto = (desconto > 0 && totalAtual >= 100) ? (totalAtual * desconto) : 0;
    let precoFinal = totalAtual - valorDesconto;
    let numeroPedido = 'PED-' + Math.floor(Math.random() * 1000000); 

    let payload = {
        numero: numeroPedido,
        total: precoFinal,
        desconto: valorDesconto,
        itens: carrinhoAtual.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            preco: item.preco
        }))
    };

    try {
        let data = await API.criarPedido(payload);

        if (data.status === "sucesso") {
            Store.setState({ carrinho: [], descontoAtivo: 0 });
            fecharCarrinho();
            mostrarToast(`Sucesso! Pedido ${numeroPedido} salvo no banco! 🎉`);
            setTimeout(() => { window.location.href = '/minha-conta/'; }, 1500);
        } else {
            mostrarToast("Erro ao processar: " + data.mensagem);
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        mostrarToast("Você precisa fazer login para finalizar a compra! 🔒");
    }
}