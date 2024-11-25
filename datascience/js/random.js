// Função para processar os dados do CSV
function processarDadosCSV(conteudoCSV) {
    const linhasCSV = conteudoCSV.split("\n");
    const dadosFormatados = {};

    linhasCSV.forEach(linha => {
        const colunas = linha.split(";");
        if (colunas.length === 3) {
            const modeloCategoria = colunas[0];
            const nomeVariavel = colunas[1];
            const valorImportancia = parseFloat(colunas[2]);

            // Se o modelo ainda não existir, cria um novo objeto
            if (!dadosFormatados[modeloCategoria]) {
                dadosFormatados[modeloCategoria] = {};
            }

            dadosFormatados[modeloCategoria][nomeVariavel] = valorImportancia;
        }
    });
    return dadosFormatados;
}

// Função para carregar o CSV via URL e retornar os dados processados
async function carregarArquivoCSV(urlArquivoCSV) {
    const resposta = await fetch(urlArquivoCSV); // Carrega o arquivo CSV via URL
    const textoCSV = await resposta.text();     // Converte o conteúdo em texto
    return processarDadosCSV(textoCSV);         // Processa o CSV e retorna os dados formatados
}

// Função para gerar o gráfico de radar com os dados processados
function criarGraficoRadar(dadosRadar) {
    const containerGrafico = document.getElementById('chartsContainer');

    // Remover qualquer gráfico existente antes de adicionar o novo
    containerGrafico.innerHTML = '';

    // Cores vibrantes para diferentes modelos
    const coresGrafico = [
        'rgba(54, 162, 235, 0.6)',    // Azul
        'rgba(255, 99, 132, 0.6)',    // Vermelho
        'rgba(75, 192, 192, 0.6)',    // Verde
    ];

    // Preparando os dados para o gráfico
    const configuracaoGrafico = {
        labels: [], // Variáveis (facilidade de operação, capacidade operacional, ...)
        datasets: [] // Dados de cada modelo (Promotor, Detrator, Neutro)
    };

    // Coletando as variáveis (labels)
    Object.keys(dadosRadar).forEach((categoriaModelo) => {
        const dadosModelo = dadosRadar[categoriaModelo];
        Object.keys(dadosModelo).forEach(nomeVariavel => {
            if (!configuracaoGrafico.labels.includes(nomeVariavel)) {
                configuracaoGrafico.labels.push(nomeVariavel);
            }
        });
    });

    // Preenchendo os datasets para cada modelo
    Object.keys(dadosRadar).forEach((categoriaModelo, indice) => {
        const dadosModelo = dadosRadar[categoriaModelo];
        const valoresModelo = configuracaoGrafico.labels.map(nomeVariavel => dadosModelo[nomeVariavel] || 0);

        configuracaoGrafico.datasets.push({
            label: categoriaModelo,
            data: valoresModelo,
            backgroundColor: coresGrafico[indice % coresGrafico.length],
            borderColor: coresGrafico[indice % coresGrafico.length],
            borderWidth: 1,
            borderRadius: 0 // Remover bordas arredondadas
        });
    });

    // Criando o elemento canvas para o gráfico
    const canvasGrafico = document.createElement('canvas');
    containerGrafico.appendChild(canvasGrafico);

    const contextoGrafico = canvasGrafico.getContext('2d');

    // Criando o gráfico de radar com Chart.js
    new Chart(contextoGrafico, {
        type: 'radar',
        data: configuracaoGrafico,
        options: {
            responsive: true,                       
            // indexAxis: 'y',
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 1,
                    stepSize: 0.02
                },
                pointLabels: {
                    fontSize: 14
                }
            },
            elements: {
                line: {
                    tension: 0.1, // Deixa as linhas mais suaves
                    borderWidth: 2, // Define a largura da borda da linha
                    borderColor: coresGrafico[0], // Define a cor da linha
                    fill: true // Permite o preenchimento abaixo da linha
                }
            }
        }
    });
}

// Função para carregar os dados e gerar o gráfico
async function carregarDadosEGerarGrafico(urlCSV) {
    const dadosFormatados = await carregarArquivoCSV(urlCSV);
    criarGraficoRadar(dadosFormatados);
}

// Evento para alterar o gráfico com base na seleção
document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;

    const opcoesCSV = {
        1: 'data/Grupo 1_RANDOM.csv',
        3: 'data/Grupo 3_RANDOM.csv',
        4: 'data/Grupo 4_RANDOM.csv',
        6: 'data/Grupo 6_RANDOM.csv',
        7: 'data/Grupo 7_RANDOM.csv',
        8: 'data/Grupo 8_RANDOM.csv',
    };

    if (opcoesCSV[valorSelecionado]) {
        await carregarDadosEGerarGrafico(opcoesCSV[valorSelecionado]);
    } else {
        console.log('Opção inválida');
    }
});
