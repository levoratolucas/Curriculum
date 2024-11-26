// Função para carregar e exibir a tabela de safra
async function carregarTabelaDeSafras(caminhoCSV) {
    try {
        // Carregar o arquivo CSV via fetch
        const resposta = await fetch(caminhoCSV);
        const csvTexto = await resposta.text();

        // Dividir a string em linhas e colunas
        const linhas = csvTexto.trim().split('\n');
        const cabecalhos = linhas[0].split(',');  // Assegura-se de que o CSV seja separado por vírgulas
        const linhasDados = linhas.slice(1).map(linha => linha.split(','));

        // Atualizar o título da tabela
        const tituloTabela = `Tabela de Safras por ${caminhoCSV.split('_')[0]}`;
        document.getElementById('tituloTabela').textContent = tituloTabela;

        // Selecionar a tabela
        const tabela = document.getElementById('tabelaSafra');

        // Limpar a tabela existente
        tabela.innerHTML = '';

        // Criar o cabeçalho da tabela
        const thead = document.createElement('thead');
        const linhaCabecalho = document.createElement('tr');
        cabecalhos.forEach(cabecalho => {
            const th = document.createElement('th');
            th.textContent = cabecalho.trim();
            linhaCabecalho.appendChild(th);
        });
        thead.appendChild(linhaCabecalho);
        tabela.appendChild(thead);

        // Criar o corpo da tabela
        const tbody = document.createElement('tbody');
        linhasDados.forEach(linha => {
            const tr = document.createElement('tr');
            linha.forEach(celula => {
                const td = document.createElement('td');
                td.textContent = celula.trim();
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        tabela.appendChild(tbody);
    } catch (error) {
        console.error('Erro ao carregar o arquivo CSV:', error);
    }
}

// Carregar e exibir a tabela para o arquivo "Grupo 4_safra.csv"
carregarTabelaDeSafras('../data/Grupo 4_safra.csv');

// Adicionar event listener para a mudança de seleção
document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;

    const opcoesCSV2 = {
        1: 'data/Grupo 1_safra.csv',
        3: 'data/Grupo 3_safra.csv',
        4: 'data/Grupo 4_safra.csv',
        6: 'data/Grupo 6_safra.csv',
        7: 'data/Grupo 7_safra.csv',
        8: 'data/Grupo 8_safra.csv',
    };

    // Verifica se a opção selecionada é válida e carrega a tabela
    if (opcoesCSV2[valorSelecionado]) {
        await carregarTabelaDeSafras(opcoesCSV2[valorSelecionado]);
    } else {
        console.log('Opção inválida');
    }
});



