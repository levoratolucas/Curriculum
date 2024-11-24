// Definição da variável npsChart fora da função para evitar problemas ao destruir
let npsChart = null;

// Caminhos dos arquivos CSV
const csvPathNps1 = 'data/Grupo 11_nps_regiao.csv';
const csvPathNps2 = 'data/Grupo 11_nps_regiao.csv';
const npsPathGrupo1 = 'data/Grupo 11_nps_regiao.csv';
const npsPathGrupo2 = 'data/Grupo 11_nps_regiao.csv';
const npsPathGrupo3 = 'data/Grupo 5_nps_regiao.csv';
const npsPathGrupo4 = 'data/Grupo 6_nps_regiao.csv';
const npsPathGrupo5 = 'data/Grupo 7_nps_regiao.csv';
const npsPathGrupo6 = 'data/Grupo 8_nps_regiao.csv';
const npsPathGrupo7 = 'data/Grupo 9_10_nps_regiao.csv';
const npsPathGrupo8 = 'data/Grupo 11_nps_regiao.csv';
const npsPathGrupo9_10 = 'data/Grupo 11_nps_regiao.csv';
const npsPathGrupo11 = 'data/Grupo1 2_nps_regiao.csv';

// Função para processar o CSV
function processCSVNps(csvFilePath) {
    // Lê o conteúdo do CSV no caminho fornecido
    fetch(csvFilePath)
        .then(response => response.text())
        .then(csvDataNps => {
            const rows = csvDataNps.split('\n');
            const regions = {};

            rows.forEach((row, index) => {
                if (index > 0) { // Ignorar o cabeçalho
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

    // Se já existir um gráfico, destruí-lo antes de criar um novo
    if (npsChart) {
        npsChart.destroy();
    }

    // Criar um novo gráfico
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

// Inicializa o gráfico com o CSV 1
updateCSVNps(csvPathNps1);

// Atualiza o gráfico quando o usuário mudar a seleção
document.getElementById('csvSelect').addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'csv1':
            updateCSVNps(csvPathNps1);
            break;
        case 'csv2':
            updateCSVNps(csvPathNps2);
            break;
        case 'grupo1':
            updateCSVNps(npsPathGrupo1);
            break;
        case 'grupo2':
            updateCSVNps(npsPathGrupo2);
            break;
        case 'grupo3':
            updateCSVNps(npsPathGrupo3);
            break;
        case 'grupo4':
            updateCSVNps(npsPathGrupo4);
            break;
        case 'grupo5':
            updateCSVNps(npsPathGrupo5);
            break;
        case 'grupo6':
            updateCSVNps(npsPathGrupo6);
            break;
        case 'grupo7':
            updateCSVNps(npsPathGrupo7);
            break;
        case 'grupo8':
            updateCSVNps(npsPathGrupo8);
            break;
        case 'grupo9_10':
            updateCSVNps(npsPathGrupo9_10);
            break;
        case 'grupo11':
            updateCSVNps(npsPathGrupo11);
            break;
        default:
            console.log('Opção inválida');
            break;
    }
});
