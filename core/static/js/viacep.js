document.addEventListener('DOMContentLoaded', () => {
    // Pega os campos gerados pelo Django
    const cepInput = document.getElementById('id_cep');
    const enderecoInput = document.getElementById('id_endereco');
    const numeroInput = document.getElementById('id_numero');

    if (cepInput) {
        cepInput.addEventListener('blur', async (e) => {
            let cep = e.target.value.replace(/\D/g, '');
            
            if (cep.length === 8) {
                enderecoInput.value = "Buscando endereço... ⏳";
                
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();
                    
                    if (!data.erro) {
                        enderecoInput.value = `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`;
                        if(numeroInput) numeroInput.focus();
                    } else {
                        enderecoInput.value = "CEP não encontrado.";
                    }
                } catch (error) {
                    enderecoInput.value = "";
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        });
    }
});