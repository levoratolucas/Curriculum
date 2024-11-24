// A string fornecida
const dadosOriginais = `
xgboost;disponibilidade e confiabilidade mecânica  (csat);0.7378918499468972
xgboost;facilidade para realização de manutenções (csat);0.7253540840408099
xgboost;capacidade operacional (hectares por hora) (csat);0.7059640494620543
xgboost;facilidade de operação (csat);0.6122026226862847
xgboost;adaptabilidade as mais diversas condições de trabalho (csat);0.5821879038905754
xgboost;geração e transmissão de dados para gestão da frota (csat);0.5453035657674895
xgboost;geração e transmissão de dados para gestão agrícola (csat);0.5265641917174638
xgboost;custo de manutenção (csat);0.5115687856170917
xgboost;safra;0.09363220466885248
xgboost;adequação as diversas operações e implementos (csat);
xgboost;conforto e ergonomia (csat);
xgboost;consumo de combustível (litros por hectares) (csat);
xgboost;facilidade de uso do piloto automático (csat);
random;consumo de combustível (litros por hectares) (csat);1.0
random;adequação as diversas operações e implementos (csat);0.8333333333333335
random;adaptabilidade as mais diversas condições de trabalho (csat);0.6717229377096724
random;geração e transmissão de dados para gestão da frota (csat);0.6413889981649106
random;facilidade de operação (csat);0.6171138968832144
random;capacidade operacional (hectares por hora) (csat);0.61484250039754
random;disponibilidade e confiabilidade mecânica  (csat);0.58002441844803
random;facilidade para realização de manutenções (csat);0.5695789496485559
random;geração e transmissão de dados para gestão agrícola (csat);0.5384310145042395
random;custo de manutenção (csat);0.49324832768216087
random;safra;0.11453146694093808
random;conforto e ergonomia (csat);
random;facilidade de uso do piloto automático (csat);`;

// Função para processar a string
function processarDadosNovos(input) {
    const linhas = input.split("\n");
    const dadosMapeados = {};

    linhas.forEach(linha => {
        const colunas = linha.split(";");
        if (colunas.length === 3) {
            const tipoModelo = colunas[0];
            const atributo = colunas[1];
            const valorImportancia = parseFloat(colunas[2]);

            // Se o tipoModelo ainda não existir, cria um novo objeto
            if (!dadosMapeados[tipoModelo]) {
                dadosMapeados[tipoModelo] = {};
            }

            dadosMapeados[tipoModelo][atributo] = valorImportancia;
        }
    });
    return dadosMapeados;
}

// Processando os dados
const dadosMapeados = processarDadosNovos(dadosOriginais);

// Função para gerar gráfico de radar
function criarGraficoRadar(dadosMapeados) {
    const containerGrafico = document.getElementById('graficoCSAT');

    // Cores para diferentes modelos
    const coresGrafico = [
        'rgba(54, 162, 235, 0.6)',    // Azul
        'rgba(255, 99, 132, 0.6)',    // Vermelho
        'rgba(75, 192, 192, 0.6)',    // Verde
    ];

    // Preparando os dados para o gráfico
    const labelsGrafico = [];
    const dadosRadar = {
        labels: [], // Variáveis (facilidade de operação, capacidade operacional, ...)
        datasets: [] // Dados de cada modelo (Promotor, Detrator, Neutro)
    };

    // Coletando as variáveis (labels)
    Object.keys(dadosMapeados).forEach((tipoModelo, index) => {
        const dadosModelo = dadosMapeados[tipoModelo];
        Object.keys(dadosModelo).forEach(atributo => {
            if (!dadosRadar.labels.includes(atributo)) {
                dadosRadar.labels.push(atributo);
            }
        });
    });

    // Preenchendo os datasets para cada modelo
    Object.keys(dadosMapeados).forEach((tipoModelo, index) => {
        const dadosModelo = dadosMapeados[tipoModelo];
        const dadosPorModelo = dadosRadar.labels.map(atributo => dadosModelo[atributo] || 0); // Garantir que todas as variáveis estão no gráfico

        dadosRadar.datasets.push({
            label: tipoModelo,
            data: dadosPorModelo,
            backgroundColor: coresGrafico[index % coresGrafico.length],
            borderColor: coresGrafico[index % coresGrafico.length],
            borderWidth: 1,
            borderRadius: 0 // Remover bordas arredondadas
        });
    });

    // Criando o elemento canvas para o gráfico
    const canvasGrafico = document.createElement('canvas');
    containerGrafico.appendChild(canvasGrafico);

    const ctx = canvasGrafico.getContext('2d');

    // Criando o gráfico de radar com Chart.js
    new Chart(ctx, {
        type: 'bar',
        data: dadosRadar,
        options: {
            responsive: true,
            indexAxis: 'y',
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
                    borderColor: coresGrafico[0], // Define a cor da linha
                    fill: true // Permite o preenchimento abaixo da linha
                }
            }
        }
    });
}

// Gerar o gráfico de radar
criarGraficoRadar(dadosMapeados);
