const Store = {
    state: {
        carrinho: JSON.parse(localStorage.getItem('meuCarrinho')) || [],
        descontoAtivo: parseFloat(localStorage.getItem('meuCupom')) || 0,
        frete: parseFloat(localStorage.getItem('meuFrete')) || 0
    },
    
    listeners: [],

    subscribe(fn) {
        this.listeners.push(fn);
    },

    notify() {
        this.listeners.forEach(fn => fn(this.state));
    },

    setState(newState) {
        this.state = { ...this.state, ...newState };

        if (newState.carrinho !== undefined) {
            localStorage.setItem('meuCarrinho', JSON.stringify(this.state.carrinho));
        }
        if (newState.descontoAtivo !== undefined) {
            localStorage.setItem('meuCupom', this.state.descontoAtivo.toString());
        }
        if (newState.frete !== undefined) {
            localStorage.setItem('meuFrete', this.state.frete.toString());
        }

        this.notify();
    }
};