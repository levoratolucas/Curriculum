
const xgrupo4 = `feature;value
capacidade operacional (hectares por hora) (csat);0.2567445
disponibilidade e confiabilidade mecânica  (csat);0.1285877
adaptabilidade as mais diversas condições de trabalho (csat);0.11437393
facilidade de operação (csat);0.098550394
facilidade para realização de manutenções (csat);0.06936837
conforto e ergonomia (csat);0.060427
adequação as diversas operações e implementos (csat);0.0530217
geração e transmissão de dados para gestão agrícola (csat);0.0495675
custo de manutenção (csat);0.0493211
consumo de combustível (litros por hectares) (csat);0.043264672
facilidade de uso do piloto automático (csat);0.03984992
geração e transmissão de dados para gestão da frota (csat);0.036923155
`;

const xgrupo1 = `feature;value`;

const xgrupo2 = `feature;value
`;
const xgrupo3 = `feature;value
`;
const xgrupo41 = `feature;value
`;
const xgrupo6 = `feature;value
`;
const xgrupo7 = `feature;value`;
const xgrupo8 = `feature;value
`;
const xgrupo9_10 = `
`;
const xgrupo11 = ``;

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
function updateCSVxNP(csvData) {
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
    xnpromotor.data.labels = newLabels;
    xnpromotor.data.datasets[0].data = newDataValues;
    xnpromotor.data.datasets[0].backgroundColor = newBackgroundColors;

    // Atualizar o gráfico
    xnpromotor.update();
}

// Inicializa o gráfico
const ctx2 = document.getElementById('teste').getContext('2d');
const xnpromotor = new Chart(ctx2, {
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
                max: 0.4
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
updateCSVxNP(xgrupo4);

// Atualiza o gráfico quando o usuário mudar a seleção
document.getElementsByClassName('x_n_promotor')[0].addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'grupo4':
            updateCSVxNP(xgrupo4);
            break;
        
        case 'grupo1':
            updateCSVxNP(xgrupo1);
            break;
        case 'grupo2':
            updateCSVxNP(xgrupo2);
            break;
        case 'grupo3':
            updateCSVxNP(xgrupo3);
            break;
        case 'grupo4':
            updateCSVxNP(xgrupo4);
            break;
        
        case 'grupo6':
            updateCSVxNP(xgrupo6);
            break;
        case 'grupo7':
            updateCSVxNP(xgrupo7);
            break;
        case 'grupo8':
            updateCSVxNP(xgrupo8);
            break;
        case 'grupo9_10':
            updateCSVxNP(xgrupo9_10);
            break;
        case 'grupo11':
            updateCSVxNP(xgrupo11);
            break;
    }
});

