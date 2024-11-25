// Caminho do arquivo CSV (por padrão, 'Grupo 11')
let caminhoCSV = 'data/Grupo 4_spearman.csv';

// Armazenando o gráfico para atualização
let grafico;

// Função para processar o CSV
function processarCSV(input) {
    const linhas = input.split("\n");
    const dadosMapeados = {
        labels: [], // Variáveis
        valores: []  // Correlação
    };

    linhas.forEach(linha => {
        const colunas = linha.split(";");
        if (colunas.length === 2) {
            const variavel = colunas[0].trim();
            const correlacao = parseFloat(colunas[1].trim());

            dadosMapeados.labels.push(variavel);
            dadosMapeados.valores.push(correlacao);
        }
    });

    return dadosMapeados;
}

// Array com 10 cores para as barras
const coresBarras = [
    'rgba(54, 162, 235, 0.6)',    // Azul
    'rgba(255, 99, 132, 0.6)',    // Vermelho
    'rgba(75, 192, 192, 0.6)',    // Verde
    'rgba(153, 102, 255, 0.6)',   // Roxo
    'rgba(255, 159, 64, 0.6)',    // Laranja
    'rgba(255, 99, 71, 0.6)',     // Tomate
    'rgba(255, 165, 0, 0.6)',     // Laranja escuro
    'rgba(0, 128, 0, 0.6)',       // Verde escuro
    'rgba(128, 0, 128, 0.6)',     // Roxo escuro
    'rgba(0, 191, 255, 0.6)'      // Azul claro
];

// Função para criar ou atualizar o gráfico de barras
function criarGraficoBarras(dadosMapeados) {
    const containerGrafico = document.getElementById('graficoCSAT');

    // Verificar se já existe um gráfico
    if (grafico) {
        grafico.destroy();  // Destruir o gráfico existente
    }

    // Preparando os dados para o gráfico
    const dadosBarras = {
        labels: dadosMapeados.labels, // Variáveis
        datasets: [{
            label: 'Correlação',
            data: dadosMapeados.valores, // Correlação
            backgroundColor: dadosMapeados.labels.map((_, index) => coresBarras[index % coresBarras.length]),  // Cores cíclicas
            borderColor: dadosMapeados.labels.map((_, index) => coresBarras[index % coresBarras.length]),
            borderWidth: 1
        }]
    };

    // Obter o canvas para o gráfico
    const canvasGrafico = document.getElementById('graficoCanvas');
    if (!canvasGrafico) {
        // Criar um novo canvas se não existir
        const newCanvas = document.createElement('canvas');
        newCanvas.id = 'graficoCanvas';
        containerGrafico.appendChild(newCanvas);
    }

    const ctx = canvasGrafico.getContext('2d');

    // Criar ou atualizar o gráfico de barras com Chart.js
    grafico = new Chart(ctx, {
        type: 'bar',  // Tipo de gráfico
        data: dadosBarras,
        options: {
            responsive: true,            
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    ticks: {
                        beginAtZero: true,
                        max: 1,
                        stepSize: 0.1
                    }
                }
            },
            elements: {
                bar: {
                    borderRadius: 5 // Bordas arredondadas nas barras
                }
            }
        }
    });
}

// Função para buscar e processar o CSV
function buscarCSV(caminho) {
    fetch(caminho)
        .then(response => response.text())  // Lê o arquivo como texto
        .then(dadosCSV => {
            const dadosMapeados = processarCSV(dadosCSV);
            criarGraficoBarras(dadosMapeados);
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo CSV:', error);
        });
}

// Adicionar event listener para o select
document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;

    // Mapeamento das opções de CSV
    const opcoesCSV = {
        'csv1': 'data/Completo_spearman.csv',
        'csv2': 'data/Brasil_spearman.csv',
        '1': 'data/Grupo 1_spearman.csv',
        '3': 'data/Grupo 3_spearman.csv',
        '4': 'data/Grupo 4_spearman.csv',
        '6': 'data/Grupo 6_spearman.csv',
        '7': 'data/Grupo 7_spearman.csv',
        '8': 'data/Grupo 8_spearman.csv',
        '9_10': 'data/Grupo 9_10_spearman.csv',
    };

    // Verifica se a opção selecionada existe no mapeamento
    if (opcoesCSV[valorSelecionado]) {
        caminhoCSV = opcoesCSV[valorSelecionado];  // Atualiza o caminho do CSV
        buscarCSV(caminhoCSV);  // Carrega o novo CSV
    }
});

// Chama a função inicial para carregar o arquivo CSV padrão
buscarCSV(caminhoCSV);
