// Dados simulados dos dois CSVs
const csvData1 = `Variável;XGBoost (Detrator)
Disponibilidade e confiabilidade mecânica;0.4226497
Adequação às diversas operações e implementos;0.109258726
Adaptabilidade às mais diversas condições de trabalho;0.095814064
Conforto e ergonomia;0.082228996
Facilidade de operação;0.0502939
Facilidade para realização de manutenções;0.04864706
Capacidade operacional (hectares por hora);0.048640095
Custo de manutenção;0.044471357
Consumo de combustível (litros por hectare);0.026491044
Geração e transmissão de dados para gestão da frota;0.024934202`;

const csvData2 = `Variável;XGBoost (Detrator)
Disponibilidade e confiabilidade mecânica;0.4226497
Adequaçã;0.109258726
Adaptabili;0.095814064
Conforto ;0.082228996
Facilidade;0.0502939
Facilidade;0.04864706
Capacidade;0.048640095
Custo de ;0.044471357
Consumo de ;0.026491044
Geração e ;0.024934202`;

// Função para processar o CSV
function processCSV(csvData) {
    const rows = csvData.split('\n');
    const labels = [];
    const dataValues = [];
    const backgroundColors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
        '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#16a085'
    ];

    rows.forEach((row, index) => {
        if (index > 0) { // Ignorar o cabeçalho
            const cols = row.split(';');
            if (cols.length === 2) {
                labels.push(cols[0].trim());
                dataValues.push(parseFloat(cols[1].trim()));
            }
        }
    });

    return { labels, dataValues, backgroundColors };
}

// Função para atualizar o gráfico com o CSV selecionado
function updateCSV(csvData) {
    const { labels, dataValues, backgroundColors } = processCSV(csvData);

    const dataWithLabels = labels.map((label, index) => ({
        label: label,
        value: dataValues[index],
        backgroundColor: backgroundColors[index]
    }));

    dataWithLabels.sort((a, b) => b.value - a.value);

    const newLabels = dataWithLabels.map(item => item.label);
    const newDataValues = dataWithLabels.map(item => item.value);
    const newBackgroundColors = dataWithLabels.map(item => item.backgroundColor);

    // Atualizar os dados do gráfico
    csatChart.data.labels = newLabels;
    csatChart.data.datasets[0].data = newDataValues;
    csatChart.data.datasets[0].backgroundColor = newBackgroundColors;

    // Atualizar o gráfico
    csatChart.update();
}

// Inicializa o gráfico
const ctx = document.getElementById('csatChart').getContext('2d');
const csatChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Variáveis XGBoost',
            data: [],
            backgroundColor: [],
            borderColor: '#333',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        indexAxis: 'y', // Barra horizontal
        scales: {
            x: {
                beginAtZero: true,
                max: 0.5
            },
            y: {
                ticks: {
                    beginAtZero: true
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// Carregar o CSV inicial (CSV 1 por padrão)
updateCSV(csvData1);

// Atualiza o gráfico quando o usuário mudar a seleção
document.getElementById('csvSelect').addEventListener('change', (event) => {
    if (event.target.value === 'csv1') {
        updateCSV(csvData1);
    } else {
        updateCSV(csvData2);
    }
});
