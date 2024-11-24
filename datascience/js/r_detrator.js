// // Dados simulados dos dois CSVs
// const grupo4 = `feature;value
// capacidade operacional (hectares por hora) (csat);0.2567445
// disponibilidade e confiabilidade mecânica  (csat);0.1285877
// adaptabilidade as mais diversas condições de trabalho (csat);0.11437393
// facilidade de operação (csat);0.098550394
// facilidade para realização de manutenções (csat);0.06936837
// conforto e ergonomia (csat);0.060427
// adequação as diversas operações e implementos (csat);0.0530217
// geração e transmissão de dados para gestão agrícola (csat);0.0495675
// custo de manutenção (csat);0.0493211
// consumo de combustível (litros por hectares) (csat);0.043264672
// facilidade de uso do piloto automático (csat);0.03984992
// geração e transmissão de dados para gestão da frota (csat);0.036923155
// `;


// // Função para processar o CSV
// function processCSV(csvData) {
//     const rows = csvData.split('\n');
//     const labels = [];
//     const dataValues = [];
//     const backgroundColors = [
//         '#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6',
//         '#1abc9c', '#34495e', '#e67e22', '#7f8c8d', '#16a085'
//     ];

//     rows.forEach((row, index) => {
//         if (index > 0) { // Ignorar o cabeçalho
//             const cols = row.split(';');
//             if (cols.length === 2) {
//                 labels.push(cols[0].trim());
//                 dataValues.push(parseFloat(cols[1].trim()));
//             }
//         }
//     });

//     return { labels, dataValues, backgroundColors };
// }

// // Função para atualizar o gráfico com o CSV selecionado
// function updateCSV(csvData) {
//     const { labels, dataValues, backgroundColors } = processCSV(csvData);

//     const dataWithLabels = labels.map((label, index) => ({
//         label: label,
//         value: dataValues[index],
//         backgroundColor: backgroundColors[index]
//     }));

//     dataWithLabels.sort((a, b) => b.value - a.value);

//     const newLabels = dataWithLabels.map(item => item.label);
//     const newDataValues = dataWithLabels.map(item => item.value);
//     const newBackgroundColors = dataWithLabels.map(item => item.backgroundColor);

//     // Atualizar os dados do gráfico
//     csatChart.data.labels = newLabels;
//     csatChart.data.datasets[0].data = newDataValues;
//     csatChart.data.datasets[0].backgroundColor = newBackgroundColors;

//     // Atualizar o gráfico
//     csatChart.update();
// }

// // Inicializa o gráfico
// const ctx = document.getElementById('rfDetrator').getContext('2d');
// const csatChart = new Chart(ctx, {
//     type: 'bar',
//     data: {
//         labels: [],
//         datasets: [{
//             label: 'Variáveis XGBoost',
//             data: [],
//             backgroundColor: [],
//             borderColor: '#333',
//             borderWidth: 1
//         }]
//     },
//     options: {
//         responsive: true,
//         indexAxis: 'y', // Barra horizontal
//         scales: {
//             x: {
//                 beginAtZero: true,
//                 max: 1
//             },
//             y: {
//                 ticks: {
//                     beginAtZero: true
//                 }
//             }
//         },
//         plugins: {
//             legend: {
//                 position: 'top',
//             }
//         }
//     }
// });

// // Carregar o CSV inicial (CSV 1 por padrão)
// updateCSV(csvData1);

// // Atualiza o gráfico quando o usuário mudar a seleção
// document.getElementsByClassName('csss')[0].addEventListener('change', (event) => {
//     switch (event.target.value) {
//         case 'csv1':
//             updateCSV(csvData1);
//             break;
//         case 'brasil':
//             updateCSV(brasil);
//             break;
//         case 'grupo1':
//             updateCSV(grupo1);
//             break;
//         case 'grupo2':
//             updateCSV(grupo2);
//             break;
//         case 'grupo3':
//             updateCSV(grupo3);
//             break;
//         case 'grupo4':
//             updateCSV(grupo4);
//             break;
        
//         case 'grupo6':
//             updateCSV(grupo6);
//             break;
//         case 'grupo7':
//             updateCSV(grupo7);
//             break;
//         case 'grupo8':
//             updateCSV(grupo8);
//             break;
//         case 'grupo9_10':
//             updateCSV(grupo9_10);
//             break;
//         case 'grupo11':
//             updateCSV(grupo11);
//             break;
//     }
// });
