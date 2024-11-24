// A string fornecida
const dados = `XGBoost_Detrator_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.27945417
XGBoost_Detrator_BRASIL;facilidade de operação (csat);0.18375741
XGBoost_Detrator_BRASIL;facilidade para realização de manutenções (csat);0.17542207
XGBoost_Detrator_BRASIL;capacidade operacional (hectares por hora) (csat);0.08613092
XGBoost_Detrator_BRASIL;adequação as diversas operações e implementos (csat);0.05344875
XGBoost_Detrator_BRASIL;custo de manutenção (csat);0.042951062
XGBoost_Detrator_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.0387706
XGBoost_Detrator_BRASIL;conforto e ergonomia (csat);0.03214221
XGBoost_Detrator_BRASIL;geração e transmissão de dados para gestão agrícola (csat);0.029979581
XGBoost_Detrator_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.029180322
XGBoost_Neutro_BRASIL;capacidade operacional (hectares por hora) (csat);0.23239039
XGBoost_Neutro_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.17708378
XGBoost_Neutro_BRASIL;facilidade para realização de manutenções (csat);0.14970835
XGBoost_Neutro_BRASIL;facilidade de operação (csat);0.11503503
XGBoost_Neutro_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.056255434
XGBoost_Neutro_BRASIL;adequação as diversas operações e implementos (csat);0.04591634
XGBoost_Neutro_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.04032155
XGBoost_Neutro_BRASIL;conforto e ergonomia (csat);0.039574705
XGBoost_Neutro_BRASIL;custo de manutenção (csat);0.039375093
XGBoost_Neutro_BRASIL;facilidade de uso do piloto automático (csat);0.035113927
XGBoost_Promotor_BRASIL;facilidade de operação (csat);0.4433135
XGBoost_Promotor_BRASIL;facilidade para realização de manutenções (csat);0.119210474
XGBoost_Promotor_BRASIL;disponibilidade e confiabilidade mecânica  (csat);0.11777223
XGBoost_Promotor_BRASIL;capacidade operacional (hectares por hora) (csat);0.09786024
XGBoost_Promotor_BRASIL;adequação as diversas operações e implementos (csat);0.043290626
XGBoost_Promotor_BRASIL;adaptabilidade as mais diversas condições de trabalho (csat);0.030720685
XGBoost_Promotor_BRASIL;geração e transmissão de dados para gestão da frota (csat);0.028084185
XGBoost_Promotor_BRASIL;conforto e ergonomia (csat);0.026360322
XGBoost_Promotor_BRASIL;geração e transmissão de dados para gestão agrícola (csat);0.026302315
XGBoost_Promotor_BRASIL;custo de manutenção (csat);0.023882715`;

// Função para processar a string
function processarDados(input) {
    const linhas = input.split("\n");
    const dadosProcessados = {};

    linhas.forEach(linha => {
        const colunas = linha.split(";");
        if (colunas.length === 3) {
            const modelo = colunas[0];
            const variavel = colunas[1];
            const importancia = parseFloat(colunas[2]);

            // Se o modelo ainda não existir, cria um novo objeto
            if (!dadosProcessados[modelo]) {
                dadosProcessados[modelo] = {};
            }

            dadosProcessados[modelo][variavel] = importancia;
        }
    });
    return dadosProcessados;
}

// Processando os dados
const dadosProcessados = processarDados(dados);

// Função para gerar gráfico de radar
function gerarGraficoRadar(dadosProcessados) {
    const container = document.getElementById('chartsContainer2');

    // Cores vibrantes para diferentes modelos
    const coresVibrantes = [
        'rgba(54, 162, 235, 0.6)',    // Azul
        'rgba(255, 99, 132, 0.6)',    // Vermelho
        'rgba(75, 192, 192, 0.6)',    // Verde
    ];

    // Preparando os dados para o gráfico
    const labels = [];
    const dadosGrafico = {
        labels: [], // Variáveis (facilidade de operação, capacidade operacional, ...)
        datasets: [] // Dados de cada modelo (Promotor, Detrator, Neutro)
    };

    // Coletando as variáveis (labels)
    Object.keys(dadosProcessados).forEach((modelo, index) => {
        const dadosModelo = dadosProcessados[modelo];
        Object.keys(dadosModelo).forEach(variavel => {
            if (!dadosGrafico.labels.includes(variavel)) {
                dadosGrafico.labels.push(variavel);
            }
        });
    });

    // Preenchendo os datasets para cada modelo
    Object.keys(dadosProcessados).forEach((modelo, index) => {
        const dadosModelo = dadosProcessados[modelo];
        const data = dadosGrafico.labels.map(variavel => dadosModelo[variavel] || 0); // Garantir que todas as variáveis estão no gráfico

        dadosGrafico.datasets.push({
            label: modelo,
            data: data,
            backgroundColor: coresVibrantes[index % coresVibrantes.length],
            borderColor: coresVibrantes[index % coresVibrantes.length],
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
        data: dadosGrafico,
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
                    borderColor: coresVibrantes[0], // Define a cor da linha
                    fill: true // Permite o preenchimento abaixo da linha
                }
            }
        }
    });
}

// Gerar o gráfico de radar
gerarGraficoRadar(dadosProcessados);
