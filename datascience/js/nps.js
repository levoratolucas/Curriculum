
// Dados simulados dos CSVs
const csvDataNps1 = `região;nps;Contagem
Centro-Oeste;detrator;39
Centro-Oeste;neutro;97
Centro-Oeste;promotor;457
Nordeste;detrator;17
Nordeste;neutro;62
Nordeste;promotor;344
Norte;detrator;11
Norte;neutro;39
Norte;promotor;168
Outro;detrator;50
Outro;neutro;137
Outro;promotor;458
Sudeste;detrator;153
Sudeste;neutro;465
Sudeste;promotor;1999
Sul;detrator;149
Sul;neutro;559
Sul;promotor;2154`;

const csvDataNps2 = `região;nps;Contagem
Centro-Oeste;detrator;35
Centro-Oeste;neutro;112
Centro-Oeste;promotor;540
Nordeste;detrator;21
Nordeste;neutro;75
Nordeste;promotor;400
Norte;detrator;13
Norte;neutro;43
Norte;promotor;195`;

let npsChart = null; // Definir o gráfico como variável global

// Função para processar o CSV
function processCSVNps(csvDataNps) {
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

    return regions;
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
function updateCSVNps(csvDataNps) {
    const regions = processCSVNps(csvDataNps);
    generateBarChart(regions);
}

// Inicializa o gráfico com o CSV 1
updateCSVNps(csvDataNps1);

// Atualiza o gráfico quando o usuário mudar a seleção
document.getElementById('csvSelect').addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'csv1':
            updateCSVNps(csvDataNps1);
            break;
        case 'csv2':
            updateCSVNps(csvDataNps2);
            break;
        case 'csv3':
            // Adicione a lógica para CSV 3 aqui, se necessário
            break;
        default:
            console.log('Opção inválida');
            break;
    }
});