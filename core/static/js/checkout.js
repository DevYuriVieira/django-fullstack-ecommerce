async function finalizarCompra() {
    let carrinhoAtual = Store.state.carrinho;
    let desconto = Store.state.descontoAtivo;
    let freteAtual = Store.state.frete || 0;

    if (carrinhoAtual.length === 0) {
        mostrarToast("Seu carrinho está vazio! Adicione uma birita. 🛒");
        return; 
    }

    let totalAtual = carrinhoAtual.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    let valorDesconto = (desconto > 0 && totalAtual >= 100) ? (totalAtual * desconto) : 0;
    let precoFinal = totalAtual - valorDesconto + freteAtual;
    let numeroPedido = 'PED-' + Math.floor(Math.random() * 1000000); 

    let payload = {
        numero: numeroPedido,
        total: precoFinal,
        desconto: valorDesconto,
        frete: freteAtual,
        itens: carrinhoAtual.map(item => ({
            id: item.id,
            quantidade: item.quantidade,
            preco: item.preco
        }))
    };

    try {
        let data = await API.criarPedido(payload);

        if (data.status === "sucesso") {
            Store.setState({ carrinho: [], descontoAtivo: 0, frete: 0 });

            const cartItemsContainer = document.getElementById("cart-items-container");
            const cartFooter = document.querySelector(".cart-footer"); 
            
            if (cartFooter) cartFooter.style.display = "none";

            cartItemsContainer.innerHTML = "";

            const template = document.getElementById("pagamento-template");
            if (!template) {
                console.error("Template de pagamento não encontrado no HTML!");
                return;
            }
            const clone = template.content.cloneNode(true);

            clone.querySelector(".pedido-numero").textContent = data.numero_pedido;

            const radioPix = clone.querySelector(".radio-pix");
            const radioCartao = clone.querySelector(".radio-cartao");
            const abaPix = clone.querySelector(".aba-pix");
            const abaCartao = clone.querySelector(".aba-cartao");

            radioPix.addEventListener("change", () => {
                abaPix.style.display = "block";
                abaCartao.style.display = "none";
            });

            radioCartao.addEventListener("change", () => {
                abaPix.style.display = "none";
                abaCartao.style.display = "block";
            });

            clone.querySelector(".btn-copiar").addEventListener("click", () => mostrarToast('Código copiado! 📋'));

            const btnConfirmar = clone.querySelector(".btn-simular-webhook");
            btnConfirmar.addEventListener("click", async function() {
                this.innerText = "Processando...";
                this.style.opacity = "0.7";
                this.disabled = true;

                try {
                    await API.simularWebhookPix(data.pedido_id);
                    
                    const sucessoTemplate = document.getElementById("sucesso-template");
                    const sucessoClone = sucessoTemplate.content.cloneNode(true);
                    
                    cartItemsContainer.innerHTML = "";
                    cartItemsContainer.appendChild(sucessoClone);
                    
                    setTimeout(() => { window.location.href = '/minha-conta/'; }, 2500);
                    
                } catch (err) {
                    mostrarToast("Erro ao processar o webhook: " + err.message);
                    this.innerText = "Tentar novamente";
                    this.style.opacity = "1";
                    this.disabled = false;
                }
            });

            cartItemsContainer.appendChild(clone);

        } else {
            mostrarToast("Erro ao processar: " + data.mensagem);
        }

    } catch (error) {
        console.error("Erro na comunicação com a API:", error);
        mostrarToast(error.message);
    }
}