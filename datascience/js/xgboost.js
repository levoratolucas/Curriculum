// Função para processar os dados do CSV
function processarDados(input) {
    const linhas = input.split("\n");
    const dadosProcessados = {};

    linhas.forEach(linha => {
        const colunas = linha.split(";");
        if (colunas.length === 3) {
            const modelo = colunas[0];
            const variavel = colunas[1];
            const importancia = parseFloat(colunas[2]);

            // Se o modelo ainda não existir, cria um novo objeto
            if (!dadosProcessados[modelo]) {
                dadosProcessados[modelo] = {};
            }

            dadosProcessados[modelo][variavel] = importancia;
        }
    });
    return dadosProcessados;
}

// Função para carregar o CSV via URL e retornar os dados processados
async function carregarCSV(caminhoCSV) {
    const resposta = await fetch(caminhoCSV); // Carrega o arquivo CSV via URL
    const csvText = await resposta.text();   // Converte o conteúdo em texto
    return processarDados(csvText);          // Processa o CSV e retorna os dados processados
}

// Função para gerar o gráfico de radar com os dados processados
function gerarGraficoRadar(dadosProcessados) {
    const container = document.getElementById('chartsContainer2');

    // Remover qualquer gráfico existente antes de adicionar o novo
    container.innerHTML = '';

    // Cores vibrantes para diferentes modelos
    const coresVibrantes = [
        'rgba(54, 162, 235, 0.6)',    // Azul
        'rgba(255, 99, 132, 0.6)',    // Vermelho
        'rgba(75, 192, 192, 0.6)',    // Verde
    ];

    // Preparando os dados para o gráfico
    const labels = [];
    const dadosGrafico = {
        labels: [], // Variáveis (facilidade de operação, capacidade operacional, ...)
        datasets: [] // Dados de cada modelo (Promotor, Detrator, Neutro)
    };

    // Coletando as variáveis (labels)
    Object.keys(dadosProcessados).forEach((modelo, index) => {
        const dadosModelo = dadosProcessados[modelo];
        Object.keys(dadosModelo).forEach(variavel => {
            if (!dadosGrafico.labels.includes(variavel)) {
                dadosGrafico.labels.push(variavel);
            }
        });
    });

    // Preenchendo os datasets para cada modelo
    Object.keys(dadosProcessados).forEach((modelo, index) => {
        const dadosModelo = dadosProcessados[modelo];
        const data = dadosGrafico.labels.map(variavel => dadosModelo[variavel] || 0); // Garantir que todas as variáveis estão no gráfico

        dadosGrafico.datasets.push({
            label: modelo,
            data: data,
            backgroundColor: coresVibrantes[index % coresVibrantes.length],
            borderColor: coresVibrantes[index % coresVibrantes.length],
            borderWidth: 1,
            borderRadius: 0 // Remover bordas arredondadas
        });
    });

    // Criando o elemento canvas para o gráfico
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Criando o gráfico de radar com Chart.js
    new Chart(ctx, {
        type: 'radar',
        data: dadosGrafico,
        options: {
            responsive: true,
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
                    borderColor: coresVibrantes[0], // Define a cor da linha
                    fill: true // Permite o preenchimento abaixo da linha
                }
            }
        }
    });
}

// Função para carregar os dados e gerar o gráfico
async function carregarEGerarGrafico(caminhoCSV) {
    const dadosProcessados = await carregarCSV(caminhoCSV);
    gerarGraficoRadar(dadosProcessados);
}

document.querySelector('.csss').addEventListener('change', async (evento) => {
    const valorSelecionado = evento.target.value;

    const opcoesCSV2 = {
        csv1: 'data/Grupo 4_XGBOOST.csv',
        csv2: 'data/Grupo 4_XGBOOST.csv',
        grupo1: 'data/Grupo 1_XGBOOST.csv',
        grupo2: 'data/Grupo 2_XGBOOST.csv',
        grupo3: 'data/Grupo 3_XGBOOST.csv',
        grupo4: 'data/Grupo 4_XGBOOST.csv',
        grupo5: 'data/Grupo 5_XGBOOST.csv',
        grupo6: 'data/Grupo 6_XGBOOST.csv',
        grupo7: 'data/Grupo 7_XGBOOST.csv',
        grupo8: 'data/Grupo 8_XGBOOST.csv',
        grupo9_10: 'data/Grupo 9_10_XGBOOST.csv',
        grupo11: 'data/Grupo 11_XGBOOST.csv',
    };

    if (opcoesCSV2[valorSelecionado]) {
        await carregarEGerarGrafico(opcoesCSV2[valorSelecionado]);
    } else {
        console.log('Opção inválida');
    }
});