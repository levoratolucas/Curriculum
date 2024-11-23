
// Dados simulados dos CSVs
const csvDataNps1 = `região;nps;Contagem
completo;promotor;18251
completo;neutro;5157
completo;detrator;1766`;
const csvDataNps2 = `Região;NPS;Contagem
Brasil;promotor;17416
Brasil;neutro;4820
Brasil;detrator;1653
`;
const grupo1 = `região;nps;Contagem
Centro-Oeste;detrator;58
Centro-Oeste;neutro;197
Centro-Oeste;promotor;764
Nordeste;detrator;7
Nordeste;neutro;27
Nordeste;promotor;106
Norte;detrator;9
Norte;neutro;27
Norte;promotor;130
Outro;detrator;17
Outro;neutro;99
Outro;promotor;330
Sudeste;detrator;64
Sudeste;neutro;208
Sudeste;promotor;1115
Sul;detrator;51
Sul;neutro;236
Sul;promotor;1045
`;

const grupo2 = `região;nps;Contagem
Centro-Oeste;detrator;41
Centro-Oeste;neutro;69
Centro-Oeste;promotor;301
Nordeste;detrator;9
Nordeste;neutro;40
Nordeste;promotor;190
Norte;detrator;15
Norte;neutro;29
Norte;promotor;124
Outro;detrator;20
Outro;neutro;64
Outro;promotor;203
Sudeste;detrator;58
Sudeste;neutro;160
Sudeste;promotor;468
Sul;detrator;76
Sul;neutro;207
Sul;promotor;564
`;
const grupo3 = `região;nps;Contagem
Centro-Oeste;detrator;15
Centro-Oeste;neutro;26
Centro-Oeste;promotor;99
Nordeste;detrator;13
Nordeste;neutro;33
Nordeste;promotor;131
Norte;detrator;1
Norte;neutro;9
Norte;promotor;44
Outro;detrator;20
Outro;neutro;48
Outro;promotor;94
Sudeste;detrator;88
Sudeste;neutro;193
Sudeste;promotor;607
Sul;detrator;31
Sul;neutro;81
Sul;promotor;260
`;
const grupo4 = `região;nps;Contagem
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
Sul;promotor;2154
`;
const grupo11 = `região;nps;Contagem
Centro-Oeste;detrator;29
Centro-Oeste;neutro;60
Centro-Oeste;promotor;133
Nordeste;detrator;2
Nordeste;neutro;5
Nordeste;promotor;19
Norte;detrator;4
Norte;neutro;25
Norte;promotor;40
Outro;detrator;9
Outro;neutro;49
Outro;promotor;134
Sudeste;detrator;41
Sudeste;neutro;86
Sudeste;promotor;259
Sul;detrator;95
Sul;neutro;244
Sul;promotor;696
`;
const grupo9_10 = `região;nps;Contagem
Centro-Oeste;detrator;32
Centro-Oeste;neutro;67
Centro-Oeste;promotor;173
Nordeste;detrator;3
Nordeste;neutro;7
Nordeste;promotor;39
Norte;detrator;7
Norte;neutro;11
Norte;promotor;18
Outro;detrator;7
Outro;neutro;23
Outro;promotor;45
Sudeste;detrator;18
Sudeste;neutro;57
Sudeste;promotor;145
Sul;detrator;17
Sul;neutro;34
Sul;promotor;78
`;
const csvDataNps9 = `região;nps;Contagem`;
const csvDataNps10 = `região;nps;Contagem`;
const csvDataNps11 = `região;nps;Contagem`;

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
            updateCSVNps(csvDataNps2);
            break;
        default:
            console.log('Opção inválida');
            break;
    }
});