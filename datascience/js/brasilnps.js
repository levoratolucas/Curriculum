async function carregarTabelaDeSafras(caminhoCSV) {
    // Carregar o arquivo CSV via fetch
    const resposta = await fetch(caminhoCSV);
    const csvTexto = await resposta.text();

    // Dividir a string em linhas e colunas
    const linhas = csvTexto.trim().split('\n');
    const cabecalhos = linhas[0].split(';');
    const linhasDados = linhas.slice(1).map(linha => linha.split(';'));

    // Atualizar o título da tabela
    const tituloTabela = `NPS  ${caminhoCSV.split('_')[0].split('/')[1]}`;
    document.getElementById('tituloTabelabrasil').textContent = tituloTabela;

    // Selecionar a tabela
    const tabela = document.getElementById('tabelanpsbrasil');

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
}

// Event listener para a mudança de seleção e uso de switch-case
document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;
    let caminhoCSV = '';

    switch (valorSelecionado) {
        case 'csv1':
            caminhoCSV = 'data/ALL_NPS.csv';
            break;
        case 'csv2':
            caminhoCSV = 'data/BRASIL_NPS.csv';
            break;
        case '1':
            caminhoCSV = 'data/Grupo 1_nps_brasil.csv';
            break;
        case '3':
            caminhoCSV = 'data/Grupo 3_nps_brasil.csv';
            break;
        case '4':
            caminhoCSV = 'data/Grupo 4_nps_brasil.csv';
            break;
        case '6':
            caminhoCSV = 'data/Grupo 6_nps_brasil.csv';
            break;
        case '7':
            caminhoCSV = 'data/Grupo 7_nps_brasil.csv';
            break;
        case '8':
            caminhoCSV = 'data/Grupo 8_nps_brasil.csv';
            break;
        default:
            console.log('Opção inválida');
            return; // Não faz nada se a opção for inválida
    }

    // Carregar a tabela apenas se o caminho CSV foi encontrado
    if (caminhoCSV) {
        await carregarTabelaDeSafras(caminhoCSV);
    }
});
