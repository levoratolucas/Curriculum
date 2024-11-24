// Dados simulados dos dois CSVs
const csvData1 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.6589723614647454
adequação as diversas operações e implementos (csat);0.6341150005190309
adaptabilidade as mais diversas condições de trabalho (csat);0.627401052132904
capacidade operacional (hectares por hora) (csat);0.6244063351104361
facilidade de operação (csat);0.6083120310409686
geração e transmissão de dados para gestão agrícola (csat);0.6048903889140609
facilidade para realização de manutenções (csat);0.6006593169646149
geração e transmissão de dados para gestão da frota (csat);0.5994186247400497
conforto e ergonomia (csat);0.5545290678010565
facilidade de uso do piloto automático (csat);0.5358482924284513
custo de manutenção (csat);0.47740827327980245
consumo de combustível (litros por hectares) (csat);0.4695381961496609
safra;0.0053643364434938666`;

const brasil = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.6558163893872658
adequação as diversas operações e implementos (csat);0.6321976253990529
adaptabilidade as mais diversas condições de trabalho (csat);0.6258112179004556
capacidade operacional (hectares por hora) (csat);0.6234204278853661
facilidade de operação (csat);0.6083468064900486
geração e transmissão de dados para gestão agrícola (csat);0.6036963595632717
facilidade para realização de manutenções (csat);0.5983486113169727
geração e transmissão de dados para gestão da frota (csat);0.5979753802213893
conforto e ergonomia (csat);0.5527584056235967
facilidade de uso do piloto automático (csat);0.5343771867106711
custo de manutenção (csat);0.47599145725043346
consumo de combustível (litros por hectares) (csat);0.4679462364649053
safra;0.010478174825315769
`;
const grupo1 = `feature;value
capacidade operacional (hectares por hora) (csat);0.643146206205076
adequação as diversas operações e implementos (csat);0.6426357104023152
disponibilidade e confiabilidade mecânica  (csat);0.6380756948068459
adaptabilidade as mais diversas condições de trabalho (csat);0.6217714231134639
facilidade de operação (csat);0.6110589780616479
geração e transmissão de dados para gestão agrícola (csat);0.5973337136615723
facilidade para realização de manutenções (csat);0.5972578963843188
geração e transmissão de dados para gestão da frota (csat);0.5962648212624136
conforto e ergonomia (csat);0.5598931651474428
facilidade de uso do piloto automático (csat);0.49436169301269733
consumo de combustível (litros por hectares) (csat);0.46540933955239777
custo de manutenção (csat);0.4559393437671276
safra;0.014308070372749143`;
const grupo2 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.6875736123748266
capacidade operacional (hectares por hora) (csat);0.6499634106969563
facilidade de operação (csat);0.6344138907479079
adequação as diversas operações e implementos (csat);0.6265068213167588
adaptabilidade as mais diversas condições de trabalho (csat);0.6195716222595202
facilidade para realização de manutenções (csat);0.6098015833394649
geração e transmissão de dados para gestão da frota (csat);0.6069030241175111
geração e transmissão de dados para gestão agrícola (csat);0.6028164892613546
facilidade de uso do piloto automático (csat);0.5563746444682928
conforto e ergonomia (csat);0.5446014253546987
custo de manutenção (csat);0.47715627112433046
consumo de combustível (litros por hectares) (csat);0.4635700892852815
safra;0.1160070017626632
`;
const grupo3 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.6935213549708898
facilidade para realização de manutenções (csat);0.6356601074892296
geração e transmissão de dados para gestão agrícola (csat);0.6288575345333625
adaptabilidade as mais diversas condições de trabalho (csat);0.6217205903690832
adequação as diversas operações e implementos (csat);0.6211831959285267
geração e transmissão de dados para gestão da frota (csat);0.6101664002841513
facilidade de operação (csat);0.592918343648953
facilidade de uso do piloto automático (csat);0.5911506393045003
capacidade operacional (hectares por hora) (csat);0.5760998506694672
conforto e ergonomia (csat);0.5460189365822847
custo de manutenção (csat);0.5280134502283536
consumo de combustível (litros por hectares) (csat);0.47551917551514533
safra;0.01493665466275236
`;
const grupo4 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.6459228928767957
adequação as diversas operações e implementos (csat);0.6274946908726177
adaptabilidade as mais diversas condições de trabalho (csat);0.6263806788030586
geração e transmissão de dados para gestão agrícola (csat);0.6224557891074022
capacidade operacional (hectares por hora) (csat);0.6208506189738884
facilidade de operação (csat);0.6113999372685184
geração e transmissão de dados para gestão da frota (csat);0.6077139888954142
facilidade para realização de manutenções (csat);0.6060890983861716
conforto e ergonomia (csat);0.5622040232211963
facilidade de uso do piloto automático (csat);0.5436527558271476
consumo de combustível (litros por hectares) (csat);0.47160321654429366
custo de manutenção (csat);0.46908797353039333
safra;0.019409982375569932
`;
const grupo6 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.7312987464227193
capacidade operacional (hectares por hora) (csat);0.6877485496189142
adequação as diversas operações e implementos (csat);0.6594655070335111
conforto e ergonomia (csat);0.652469906705851
facilidade de operação (csat);0.6473864764929396
adaptabilidade as mais diversas condições de trabalho (csat);0.6421070278714323
facilidade para realização de manutenções (csat);0.6417245145107827
facilidade de uso do piloto automático (csat);0.5945204277668481
geração e transmissão de dados para gestão da frota (csat);0.5750916307098459
geração e transmissão de dados para gestão agrícola (csat);0.5648602936198385
custo de manutenção (csat);0.5579899311083514
consumo de combustível (litros por hectares) (csat);0.5518188896741206
safra;0.02504693887022175
`;
const grupo7 = `feature;value
consumo de combustível (litros por hectares) (csat);1.0
adequação as diversas operações e implementos (csat);0.8333333333333335
adaptabilidade as mais diversas condições de trabalho (csat);0.6717229377096724
geração e transmissão de dados para gestão da frota (csat);0.6413889981649106
facilidade de operação (csat);0.6171138968832144
capacidade operacional (hectares por hora) (csat);0.61484250039754
disponibilidade e confiabilidade mecânica  (csat);0.58002441844803
facilidade para realização de manutenções (csat);0.5695789496485559
geração e transmissão de dados para gestão agrícola (csat);0.5384310145042395
custo de manutenção (csat);0.49324832768216087
safra;0.11453146694093808
conforto e ergonomia (csat);
facilidade de uso do piloto automático (csat);`;
const grupo8 = `feature;value
disponibilidade e confiabilidade mecânica  (csat);0.7378918499468972
facilidade para realização de manutenções (csat);0.7253540840408099
capacidade operacional (hectares por hora) (csat);0.7059640494620543
facilidade de operação (csat);0.6122026226862847
adaptabilidade as mais diversas condições de trabalho (csat);0.5821879038905754
geração e transmissão de dados para gestão da frota (csat);0.5453035657674895
geração e transmissão de dados para gestão agrícola (csat);0.5265641917174638
custo de manutenção (csat);0.5115687856170917
safra;0.09363220466885248
adequação as diversas operações e implementos (csat);
conforto e ergonomia (csat);
consumo de combustível (litros por hectares) (csat);
facilidade de uso do piloto automático (csat);
`;
const grupo9_10 = `feature;value
facilidade de operação (csat);0.6429222491352587
geração e transmissão de dados para gestão da frota (csat);0.6265142870582913
geração e transmissão de dados para gestão agrícola (csat);0.6243604223202771
capacidade operacional (hectares por hora) (csat);0.598642338353782
adaptabilidade as mais diversas condições de trabalho (csat);0.5968130040806056
conforto e ergonomia (csat);0.5789300684491947
facilidade para realização de manutenções (csat);0.5716117282752629
consumo de combustível (litros por hectares) (csat);0.5292539013136391
disponibilidade e confiabilidade mecânica  (csat);0.5059183132466705
custo de manutenção (csat);0.48905082030913233
adequação as diversas operações e implementos (csat);0.3533870022152117
facilidade de uso do piloto automático (csat);0.058281550515019605
safra;0.0021400431369321756
`;
const grupo11 = `feature;value
facilidade de operação (csat);0.5873847621108991
facilidade para realização de manutenções (csat);0.5846703636434724
geração e transmissão de dados para gestão agrícola (csat);0.5532615252031808
geração e transmissão de dados para gestão da frota (csat);0.548094967694566
custo de manutenção (csat);0.48019361093919816
safra;0.06536684055592935
capacidade operacional (hectares por hora) (csat);
adequação as diversas operações e implementos (csat);
conforto e ergonomia (csat);
disponibilidade e confiabilidade mecânica  (csat);
consumo de combustível (litros por hectares) (csat);
adaptabilidade as mais diversas condições de trabalho (csat);
facilidade de uso do piloto automático (csat);`;

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
                max: 1
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
document.getElementsByClassName('csss')[0].addEventListener('change', (event) => {
    switch (event.target.value) {
        case 'csv1':
            updateCSV(csvData1);
            break;
        case 'brasil':
            updateCSV(brasil);
            break;
        case 'grupo1':
            updateCSV(grupo1);
            break;
        case 'grupo2':
            updateCSV(grupo2);
            break;
        case 'grupo3':
            updateCSV(grupo3);
            break;
        case 'grupo4':
            updateCSV(grupo4);
            break;
        
        case 'grupo6':
            updateCSV(grupo6);
            break;
        case 'grupo7':
            updateCSV(grupo7);
            break;
        case 'grupo8':
            updateCSV(grupo8);
            break;
        case 'grupo9_10':
            updateCSV(grupo9_10);
            break;
        case 'grupo11':
            updateCSV(grupo11);
            break;
    }
});

