// Definição da variável npsChart fora da função para evitar problemas ao destruir
let npsChart = null;

// Caminhos dos arquivos CSV
const csvPathNps1 = 'data/ALL_NPS.csv';
const csvPathNps2 = 'data/BRASIL_NPS.csv';
const npsPathGrupo1 = 'data/Grupo 1_nps_regiao.csv';
const npsPathGrupo2 = 'data/Grupo 2_nps_regiao.csv'; // Adicionado
const npsPathGrupo3 = 'data/Grupo 3_nps_regiao.csv';
const npsPathGrupo4 = 'data/Grupo 4_nps_regiao.csv';
const npsPathGrupo6 = 'data/Grupo 6_nps_regiao.csv';
const npsPathGrupo7 = 'data/Grupo 7_nps_regiao.csv';
const npsPathGrupo8 = 'data/Grupo 8_nps_regiao.csv';
const npsPathGrupo9_10 = 'data/Grupo 9_10_nps_regiao.csv'; // Adicionado
const npsPathGrupo11 = 'data/Grupo 11_nps_regiao.csv'; // Adicionado

// Função para processar o CSV
function processCSVNps(csvFilePath) {
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvDataNps => {
            const rows = csvDataNps.split('\n');
            const regions = {};

            rows.forEach((row, index) => {
                if (index > 0) {
                    const cols = row.split(';');
                    if (cols.length === 3) {
                        const region = cols[0].trim();
                        const nps = cols[1].trim();
                        const count = parseInt(cols[2].trim(), 10);

                        if (!regions[region]) {
                            regions[region] = { detrator: 0, neutro: 0, promotor: 0 };
                        }
                        regions[region][nps] += count;
                    }
                }
            });

            generateBarChart(regions);
        })
        .catch(error => console.error('Erro ao ler o arquivo CSV:', error));
}

// Função para gerar o gráfico de barras
function generateBarChart(regions) {
    const regionLabels = Object.keys(regions);
    const detratorData = regionLabels.map(region => regions[region].detrator);
    const neutroData = regionLabels.map(region => regions[region].neutro);
    const promotorData = regionLabels.map(region => regions[region].promotor);

    const ctx = document.getElementById('npsChart').getContext('2d');

    if (npsChart) {
        npsChart.destroy();
    }

    npsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regionLabels,
            datasets: [
                {
                    label: 'Detrator',
                    data: detratorData,
                    backgroundColor: '#e74c3c',
                    borderColor: '#c0392b',
                    borderWidth: 1
                },
                {
                    label: 'Neutro',
                    data: neutroData,
                    backgroundColor: '#f39c12',
                    borderColor: '#e67e22',
                    borderWidth: 1
                },
                {
                    label: 'Promotor',
                    data: promotorData,
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                }
            }
        }
    });
}

// Função para atualizar o gráfico com o CSV selecionado
function updateCSVNps(csvFilePath) {
    processCSVNps(csvFilePath);
}

// Evento de mudança para o select
document.getElementsByClassName('csss')[0].addEventListener('change', (event) => {
// document.getElementById('csvSelect').addEventListener('change', (event) => {
    let selectedValue = event.target.value;

    switch (selectedValue) {
        case 'csv1':
            updateCSVNps(csvPathNps1);
            break;
        case 'csv2':
            updateCSVNps(csvPathNps2);
            break;
        case '1':
            updateCSVNps(npsPathGrupo1);
            break;
        case '2':
            updateCSVNps(npsPathGrupo2);
            break;
        case '3':
            updateCSVNps(npsPathGrupo3);
            break;
        case '4':
            updateCSVNps(npsPathGrupo4);
            break;
        case '6':
            updateCSVNps(npsPathGrupo6);
            break;
        case '7':
            updateCSVNps(npsPathGrupo7);
            break;
        case '8':
            updateCSVNps(npsPathGrupo8);
            break;
        case '9_10':
            updateCSVNps(npsPathGrupo9_10);
            break;
        case '11':
            updateCSVNps(npsPathGrupo11);
            break;
        default:
            console.log('Seleção inválida');
            break;
    }
});
