
// A string fornecida
const grupo4xr = `Random_Promotor_BRASIL;facilidade de operação (csat);0.15756461370804217
Random_Promotor_BRASIL;facilidade para realização de manutenções (csat);0.1385576718560016
Random_Promotor_BRASIL;capacidade operacional (hectares por hora) (csat);0.11081675111496583
Random_Promotor_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.1096938675088258
Random_Promotor_BRASIL;custo de manutenção (csat);0.09679323998180009
Random_Promotor_BRASIL;adequação as diversas operações e implementos (csat);0.07790590787479768
Random_Promotor_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.07255787064962353
Random_Promotor_BRASIL;consumo de combustível (litros por hectares) (csat);0.057605455291775506
Random_Promotor_BRASIL;conforto e ergonomia (csat);0.05053408113681946
Random_Promotor_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.049463273019138485
Random_Detrator_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.17674905559258655
Random_Detrator_BRASIL;facilidade de operação (csat);0.1576345237966788
Random_Detrator_BRASIL;facilidade para realização de manutenções (csat);0.1500301109509458
Random_Detrator_BRASIL;adequação as diversas operações e implementos (csat);0.09903731942821607
Random_Detrator_BRASIL;custo de manutenção (csat);0.09841204041842513
Random_Detrator_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.06622539483431575
Random_Detrator_BRASIL;capacidade operacional (hectares por hora) (csat);0.06574572587320598
Random_Detrator_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.04414927666665304
Random_Detrator_BRASIL;geração e transmissão de dados para gestão agrícola (csat);0.04300294515031089
Random_Detrator_BRASIL;conforto e ergonomia (csat);0.04126594707565963
Random_Neutro_BRASIL;facilidade para realização de manutenções (csat);0.11998407589386748
Random_Neutro_BRASIL;custo de manutenção (csat);0.11774778965309235
Random_Neutro_BRASIL;facilidade de operação (csat);0.11114106813662654
Random_Neutro_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.104728221641006
Random_Neutro_BRASIL;capacidade operacional (hectares por hora) (csat);0.10401667448220794
Random_Neutro_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.0747484589801349
Random_Neutro_BRASIL;consumo de combustível (litros por hectares) (csat);0.07463220100358169
Random_Neutro_BRASIL;adequação as diversas operações e implementos (csat);0.06970047135660763
Random_Neutro_BRASIL;conforto e ergonomia (csat);0.06350621581954892
Random_Neutro_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.05945964665551206`;

// Função para processar a string
function processData(input) {
    const rows = input.split("\n");
    const datasets = {};

    rows.forEach(row => {
        const columns = row.split(";");
        if (columns.length === 3) {
            const modelo = columns[0];
            const variavel = columns[1];
            const importancia = parseFloat(columns[2]);

            // Se o modelo ainda não existir, cria um novo array
            if (!datasets[modelo]) {
                datasets[modelo] = {};
            }

            datasets[modelo][variavel] = importancia;
        }
    });
    return datasets;
}

// Processando os dados
const datasets = processData(grupo4xr);

// Função para gerar gráfico de radar
function generateRadarChart(datasets) {
    const container = document.getElementById('chartsContainer');

    // Cores mais vibrantes para diferentes modelos
    const vibrantColors = [
        'rgba(54, 162, 235, 0.6)',    // Azul
        'rgba(255, 99, 132, 0.6)',    // Vermelho
        'rgba(75, 192, 192, 0.6)',    // Verde
    ];

    // Preparando os dados para o gráfico
    const labels = [];
    const chartData = {
        labels: [], // Variáveis (facilidade de operação, capacidade operacional, ...)
        datasets: [] // Dados de cada modelo (Promotor, Detrator, Neutro)
    };

    // Coletando as variáveis (labels)
    Object.keys(datasets).forEach((modelo, index) => {
        const modeloData = datasets[modelo];
        Object.keys(modeloData).forEach(variavel => {
            if (!chartData.labels.includes(variavel)) {
                chartData.labels.push(variavel);
            }
        });
    });

    // Preenchendo os datasets para cada modelo
    Object.keys(datasets).forEach((modelo, index) => {
        const modeloData = datasets[modelo];
        const data = chartData.labels.map(variavel => modeloData[variavel] || 0); // Garantir que todas as variáveis estão no gráfico

        chartData.datasets.push({
            label: modelo,
            data: data,
            backgroundColor: vibrantColors[index % vibrantColors.length],
            borderColor: vibrantColors[index % vibrantColors.length],
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
        data: chartData,
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
                    borderColor: vibrantColors[0], // Define a cor da linha
                    fill: true // Permite o preenchimento abaixo da linha
                }
            }
        }
    });
}

// Gerar o gráfico de radar
generateRadarChart(datasets);

