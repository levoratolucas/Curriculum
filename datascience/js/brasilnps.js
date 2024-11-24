async function carregarTabelaDeSafras(caminhoCSV) {
    // Carregar o arquivo CSV via fetch
    const resposta = await fetch(caminhoCSV);
    const csvTexto = await resposta.text();

    // Dividir a string em linhas e colunas
    const linhas = csvTexto.trim().split('\n');
    const cabecalhos = linhas[0].split(',');
    const linhasDados = linhas.slice(1).map(linha => linha.split(','));

    // Atualizar o título da tabela
    const tituloTabela = `Tabela de Safras por ${caminhoCSV.split('_')[0]}`;
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


document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;

    const opcoesCSV2 = {
        csv1: 'data/Grupo 1_nps_brasil.csv',
        csv2: 'data/Grupo 1_nps_brasil.csv',
        grupo1: 'data/Grupo 1_nps_brasil.csv',
        grupo2: 'data/Grupo 2_nps_brasil.csv',
        grupo3: 'data/Grupo 3_nps_brasil.csv',
        grupo4: 'data/Grupo 4_nps_brasil.csv',
        grupo6: 'data/Grupo 6_nps_brasil.csv',
        grupo7: 'data/Grupo 7_nps_brasil.csv',
        grupo8: 'data/Grupo 8_nps_brasil.csv',
        grupo9_10: 'data/Grupo 9_10_nps_brasil.csv',
        grupo11: 'data/Grupo 11_nps_brasil.csv',
    };

    if (opcoesCSV2[valorSelecionado]) {
        await carregarTabelaDeSafras(opcoesCSV2[valorSelecionado]);
    } else {
        console.log('Opção inválida');
    }
});