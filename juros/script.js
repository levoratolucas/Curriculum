/* =========================================================
   LEVORATECH — JUROS
   FINANCIAL SIMULATOR
========================================================= */


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
    locale: "pt-BR",
    currency: "BRL",
    animationDuration: 750
};


/* =========================================================
   DOM
========================================================= */

const elements = {
    capitalInicial: document.getElementById("capitalInicial"),
    aporteMensal: document.getElementById("aporteMensal"),
    taxaJuros: document.getElementById("taxaJuros"),
    periodo: document.getElementById("periodo"),
    tipoJuros: document.getElementById("tipoJuros"),

    btnCalcular: document.getElementById("btnCalcular"),
    btnLimpar: document.getElementById("btnLimpar"),

    formMessage: document.getElementById("formMessage"),

    resultados: document.getElementById("resultados"),
    secaoGrafico: document.getElementById("secaoGrafico"),
    secaoJuros: document.getElementById("secaoJuros"),
    secaoTabela: document.getElementById("secaoTabela"),
    secaoInfo: document.getElementById("secaoInfo"),

    totalInvestido: document.getElementById("totalInvestido"),
    totalJuros: document.getElementById("totalJuros"),
    valorFinal: document.getElementById("valorFinal"),

    percentualCrescimento:
        document.getElementById("percentualCrescimento"),

    barraCrescimento:
        document.getElementById("barraCrescimento"),

    tabelaResumo:
        document.getElementById("tabelaResumo"),

    graficoTotal:
        document.getElementById("graficoTotal"),

    graficoIndividual:
        document.getElementById("graficoIndividual"),

    infoTexto:
        document.getElementById("infoTexto")
};


/* =========================================================
   STATE
========================================================= */

let graficoTotal = null;
let graficoIndividual = null;
let ultimaSimulacao = null;


/* =========================================================
   FORMATTERS
========================================================= */

const moeda = new Intl.NumberFormat(
    CONFIG.locale,
    {
        style: "currency",
        currency: CONFIG.currency
    }
);


const numero = new Intl.NumberFormat(
    CONFIG.locale,
    {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
);


function formatarMoeda(valor) {
    return moeda.format(
        Number.isFinite(valor)
            ? valor
            : 0
    );
}


function formatarNumero(valor) {
    return numero.format(
        Number.isFinite(valor)
            ? valor
            : 0
    );
}


/* =========================================================
   UTILITÁRIOS
========================================================= */

function obterNumero(elemento) {

    if (!elemento) {
        return 0;
    }

    const valor = Number(
        String(elemento.value)
            .replace(",", ".")
    );

    return Number.isFinite(valor)
        ? valor
        : 0;
}


function esperar(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


/* =========================================================
   MENSAGENS
========================================================= */

function mostrarMensagem(mensagem) {

    elements.formMessage.textContent =
        mensagem;

    elements.formMessage.classList.add("show");
}


function esconderMensagem() {

    elements.formMessage.textContent = "";

    elements.formMessage.classList.remove("show");
}


/* =========================================================
   ERROS
========================================================= */

function limparErros() {

    [
        elements.capitalInicial,
        elements.aporteMensal,
        elements.taxaJuros,
        elements.periodo
    ].forEach(elemento => {

        elemento
            ?.closest(".input-wrapper")
            ?.classList.remove("error");

    });
}


/* =========================================================
   PARÂMETROS
========================================================= */

function obterParametros() {

    return {

        capital: Math.max(
            0,
            obterNumero(elements.capitalInicial)
        ),

        aporte: Math.max(
            0,
            obterNumero(elements.aporteMensal)
        ),

        taxa: Math.max(
            0,
            obterNumero(elements.taxaJuros)
        ),

        periodo: Math.max(
            1,
            Math.floor(
                obterNumero(elements.periodo)
            )
        ),

        tipo: elements.tipoJuros.value

    };
}


/* =========================================================
   VALIDAÇÃO
========================================================= */

function validar(parametros) {

    limparErros();
    esconderMensagem();

    const {
        capital,
        aporte,
        taxa,
        periodo
    } = parametros;


    if (
        capital <= 0 &&
        aporte <= 0
    ) {

        elements.capitalInicial
            .closest(".input-wrapper")
            .classList.add("error");

        elements.aporteMensal
            .closest(".input-wrapper")
            .classList.add("error");

        mostrarMensagem(
            "Informe um capital inicial ou um aporte mensal."
        );

        elements.capitalInicial.focus();

        return false;
    }


    if (taxa < 0) {

        elements.taxaJuros
            .closest(".input-wrapper")
            .classList.add("error");

        mostrarMensagem(
            "A taxa de juros não pode ser negativa."
        );

        elements.taxaJuros.focus();

        return false;
    }


    if (periodo <= 0) {

        elements.periodo
            .closest(".input-wrapper")
            .classList.add("error");

        mostrarMensagem(
            "O período precisa ser maior que zero."
        );

        elements.periodo.focus();

        return false;
    }


    return true;
}


/* =========================================================
   JUROS COMPOSTOS
========================================================= */

function calcularCompostos(
    capital,
    aporte,
    taxa,
    periodo
) {

    const taxaDecimal = taxa / 100;

    let saldo = capital;
    let totalInvestido = capital;
    let totalJuros = 0;

    const dados = [];


    for (
        let mes = 1;
        mes <= periodo;
        mes++
    ) {

        const juros =
            saldo * taxaDecimal;

        saldo += juros;
        saldo += aporte;

        totalJuros += juros;
        totalInvestido += aporte;


        dados.push({

            periodo: mes,
            aporte,
            juros,
            totalInvestido,
            saldo,
            jurosAcumulados: totalJuros

        });
    }


    return {

        saldoFinal: saldo,
        totalInvestido,
        totalJuros,
        dados

    };
}


/* =========================================================
   JUROS SIMPLES
========================================================= */

function calcularSimples(
    capital,
    aporte,
    taxa,
    periodo
) {

    const taxaDecimal = taxa / 100;

    let totalInvestido = capital;
    let totalJuros = 0;

    const dados = [];


    for (
        let mes = 1;
        mes <= periodo;
        mes++
    ) {

        const jurosCapital =
            capital * taxaDecimal;


        const jurosAportes =
            aporte *
            taxaDecimal *
            (mes - 1);


        const juros =
            jurosCapital +
            jurosAportes;


        totalJuros += juros;


        totalInvestido =
            capital +
            (aporte * mes);


        const saldo =
            totalInvestido +
            totalJuros;


        dados.push({

            periodo: mes,
            aporte,
            juros,
            totalInvestido,
            saldo,
            jurosAcumulados: totalJuros

        });
    }


    return {

        saldoFinal:
            dados.length
                ? dados[dados.length - 1].saldo
                : capital,

        totalInvestido,
        totalJuros,
        dados

    };
}


/* =========================================================
   CRIAR SIMULAÇÃO
========================================================= */

function criarSimulacao() {

    const parametros =
        obterParametros();


    if (!validar(parametros)) {
        return null;
    }


    const {
        capital,
        aporte,
        taxa,
        periodo,
        tipo
    } = parametros;


    const resultado =
        tipo === "simples"
            ? calcularSimples(
                capital,
                aporte,
                taxa,
                periodo
            )
            : calcularCompostos(
                capital,
                aporte,
                taxa,
                periodo
            );


    const crescimento =
        resultado.totalInvestido > 0
            ? (
                resultado.totalJuros /
                resultado.totalInvestido
            ) * 100
            : 0;


    return {

        ...resultado,
        parametros,
        crescimento

    };
}


/* =========================================================
   ANIMAÇÃO DE NÚMEROS
========================================================= */

function animarNumero(
    elemento,
    inicio,
    fim,
    duracao = CONFIG.animationDuration
) {

    const inicioTempo =
        performance.now();


    function atualizar(tempo) {

        const progresso =
            Math.min(
                (
                    tempo -
                    inicioTempo
                ) / duracao,
                1
            );


        const easing =
            1 -
            Math.pow(
                1 - progresso,
                3
            );


        const valor =
            inicio +
            (
                fim -
                inicio
            ) * easing;


        elemento.textContent =
            formatarMoeda(valor);


        if (progresso < 1) {

            requestAnimationFrame(
                atualizar
            );

        }
    }


    requestAnimationFrame(
        atualizar
    );
}


/* =========================================================
   ANIMAÇÃO PERCENTUAL
========================================================= */

function animarPercentual(
    elemento,
    inicio,
    fim
) {

    const inicioTempo =
        performance.now();


    function atualizar(tempo) {

        const progresso =
            Math.min(
                (
                    tempo -
                    inicioTempo
                ) / 700,
                1
            );


        const easing =
            1 -
            Math.pow(
                1 - progresso,
                3
            );


        const valor =
            inicio +
            (
                fim -
                inicio
            ) * easing;


        elemento.textContent =
            `+${formatarNumero(valor)}%`;


        if (progresso < 1) {

            requestAnimationFrame(
                atualizar
            );
        }
    }


    requestAnimationFrame(
        atualizar
    );
}


/* =========================================================
   INDICADORES
========================================================= */

function atualizarIndicadores(resultado) {

    animarNumero(
        elements.totalInvestido,
        0,
        resultado.totalInvestido
    );


    animarNumero(
        elements.totalJuros,
        0,
        resultado.totalJuros
    );


    animarNumero(
        elements.valorFinal,
        0,
        resultado.saldoFinal
    );


    animarPercentual(
        elements.percentualCrescimento,
        0,
        resultado.crescimento
    );


    const progresso =
        Math.min(
            100,
            Math.max(
                0,
                resultado.crescimento
            )
        );


    requestAnimationFrame(() => {

        elements.barraCrescimento.style.width =
            `${progresso}%`;

    });
}


/* =========================================================
   REVELAR SEÇÃO
========================================================= */

function revelarSecao(elemento) {

    if (!elemento) {
        return;
    }


    elemento.classList.remove(
        "is-hidden"
    );


    elemento.classList.remove(
        "reveal"
    );


    void elemento.offsetWidth;


    elemento.classList.add(
        "reveal"
    );
}


/* =========================================================
   TABELA
========================================================= */

function atualizarTabela(resultado) {

    const dados =
        resultado.dados;


    if (!dados.length) {

        elements.tabelaResumo.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="table-empty">
                        Nenhum dado disponível.
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    const dadosExibidos =
        dados.length > 120
            ? dados.slice(-120)
            : dados;


    elements.tabelaResumo.innerHTML =
        dadosExibidos
            .map(item => `

                <tr>

                    <td>
                        ${item.periodo}º mês
                    </td>

                    <td>
                        ${formatarMoeda(item.aporte)}
                    </td>

                    <td>
                        ${formatarMoeda(item.juros)}
                    </td>

                    <td>
                        ${formatarMoeda(item.totalInvestido)}
                    </td>

                    <td>
                        ${formatarMoeda(item.saldo)}
                    </td>

                </tr>

            `)
            .join("");
}


/* =========================================================
   CHART OPTIONS
========================================================= */

function opcoesGrafico() {

    return {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: "index",
            intersect: false
        },

        animation: {
            duration: 900,
            easing: "easeOutQuart"
        },

        plugins: {

            legend: {

                labels: {

                    color: "#7f8ea3",

                    usePointStyle: true,

                    pointStyle: "circle",

                    padding: 18,

                    font: {
                        size: 10
                    }

                }

            },


            tooltip: {

                backgroundColor:
                    "rgba(8,14,21,.96)",

                borderColor:
                    "rgba(56,189,248,.18)",

                borderWidth: 1,

                titleColor: "#f8fafc",

                bodyColor: "#cbd5e1",

                padding: 12,

                callbacks: {

                    label(context) {

                        return `
                            ${context.dataset.label}:
                            ${formatarMoeda(context.parsed.y)}
                        `;

                    }

                }

            }

        },


        scales: {

            x: {

                grid: {
                    color:
                        "rgba(148,163,184,.06)",
                    drawBorder: false
                },

                ticks: {

                    color: "#536174",

                    font: {
                        size: 9
                    },

                    maxTicksLimit: 10

                }

            },


            y: {

                beginAtZero: true,

                grid: {

                    color:
                        "rgba(148,163,184,.06)",

                    drawBorder: false

                },

                ticks: {

                    color: "#536174",

                    font: {
                        size: 9
                    },

                    callback(valor) {
                        return formatarMoeda(valor);
                    }

                }

            }

        }

    };
}


/* =========================================================
   GRÁFICO PRINCIPAL
========================================================= */

function atualizarGraficoTotal(resultado) {

    if (
        typeof Chart === "undefined"
    ) {

        console.warn(
            "Chart.js ainda não foi carregado."
        );

        return;
    }


    if (graficoTotal) {
        graficoTotal.destroy();
    }


    const labels =
        resultado.dados.map(
            item => `${item.periodo}º`
        );


    const patrimonio =
        resultado.dados.map(
            item => item.saldo
        );


    const investido =
        resultado.dados.map(
            item => item.totalInvestido
        );


    const contexto =
        elements.graficoTotal.getContext("2d");


    const gradiente =
        contexto.createLinearGradient(
            0,
            0,
            0,
            350
        );


    gradiente.addColorStop(
        0,
        "rgba(56,189,248,.28)"
    );


    gradiente.addColorStop(
        1,
        "rgba(56,189,248,0)"
    );


    graficoTotal =
        new Chart(
            contexto,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Patrimônio",

                            data:
                                patrimonio,

                            borderColor:
                                "#38bdf8",

                            backgroundColor:
                                gradiente,

                            borderWidth: 2,

                            fill: true,

                            tension: .4,

                            pointRadius: 0,

                            pointHoverRadius: 5,

                            pointHoverBackgroundColor:
                                "#38bdf8",

                            pointHoverBorderColor:
                                "#fff",

                            pointHoverBorderWidth: 2

                        },


                        {

                            label:
                                "Capital investido",

                            data:
                                investido,

                            borderColor:
                                "rgba(148,163,184,.7)",

                            borderWidth: 1.5,

                            borderDash: [5, 5],

                            fill: false,

                            tension: .25,

                            pointRadius: 0

                        }

                    ]

                },

                options:
                    opcoesGrafico()

            }
        );
}


/* =========================================================
   GRÁFICO DE JUROS
========================================================= */

function atualizarGraficoJuros(resultado) {

    if (
        typeof Chart === "undefined"
    ) {
        return;
    }


    if (graficoIndividual) {
        graficoIndividual.destroy();
    }


    const labels =
        resultado.dados.map(
            item => `${item.periodo}º`
        );


    const juros =
        resultado.dados.map(
            item => item.jurosAcumulados
        );


    const contexto =
        elements.graficoIndividual.getContext("2d");


    const gradiente =
        contexto.createLinearGradient(
            0,
            0,
            0,
            350
        );


    gradiente.addColorStop(
        0,
        "rgba(34,211,238,.25)"
    );


    gradiente.addColorStop(
        1,
        "rgba(34,211,238,0)"
    );


    graficoIndividual =
        new Chart(
            contexto,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {

                            label:
                                "Juros acumulados",

                            data:
                                juros,

                            borderColor:
                                "#22d3ee",

                            backgroundColor:
                                gradiente,

                            borderWidth: 2,

                            fill: true,

                            tension: .4,

                            pointRadius: 0,

                            pointHoverRadius: 5,

                            pointHoverBackgroundColor:
                                "#22d3ee",

                            pointHoverBorderColor:
                                "#fff",

                            pointHoverBorderWidth: 2

                        }

                    ]

                },

                options:
                    opcoesGrafico()

            }
        );
}


/* =========================================================
   INTERFACE
========================================================= */

async function atualizarInterface(resultado) {

    atualizarIndicadores(
        resultado
    );


    atualizarTabela(
        resultado
    );


    revelarSecao(
        elements.resultados
    );


    await esperar(80);


    atualizarGraficoTotal(
        resultado
    );


    revelarSecao(
        elements.secaoGrafico
    );


    await esperar(80);


    atualizarGraficoJuros(
        resultado
    );


    revelarSecao(
        elements.secaoJuros
    );


    await esperar(80);


    revelarSecao(
        elements.secaoTabela
    );


    revelarSecao(
        elements.secaoInfo
    );


    ultimaSimulacao =
        resultado;
}


/* =========================================================
   EXECUTAR CÁLCULO
========================================================= */

async function executarCalculo() {

    const botao =
        elements.btnCalcular;


    if (botao.disabled) {
        return;
    }


    botao.disabled = true;

    botao.classList.add(
        "loading"
    );


    esconderMensagem();


    await esperar(220);


    const resultado =
        criarSimulacao();


    if (!resultado) {

        botao.disabled = false;

        botao.classList.remove(
            "loading"
        );

        return;
    }


    await atualizarInterface(
        resultado
    );


    botao.disabled = false;

    botao.classList.remove(
        "loading"
    );


    if (
        window.innerWidth <= 700
    ) {

        await esperar(100);


        elements.resultados.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
}


/* =========================================================
   LIMPAR
========================================================= */

function limparSimulacao() {

    elements.capitalInicial.value = "";
    elements.aporteMensal.value = "";
    elements.taxaJuros.value = "";
    elements.periodo.value = "";

    elements.tipoJuros.value =
        "compostos";


    limparErros();
    esconderMensagem();


    elements.totalInvestido.textContent =
        "R$ 0,00";


    elements.totalJuros.textContent =
        "R$ 0,00";


    elements.valorFinal.textContent =
        "R$ 0,00";


    elements.percentualCrescimento.textContent =
        "0%";


    elements.barraCrescimento.style.width =
        "0%";


    [
        elements.resultados,
        elements.secaoGrafico,
        elements.secaoJuros,
        elements.secaoTabela,
        elements.secaoInfo
    ].forEach(elemento => {

        elemento.classList.add(
            "is-hidden"
        );

        elemento.classList.remove(
            "reveal"
        );

    });


    if (graficoTotal) {

        graficoTotal.destroy();

        graficoTotal = null;
    }


    if (graficoIndividual) {

        graficoIndividual.destroy();

        graficoIndividual = null;
    }


    elements.tabelaResumo.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="table-empty">
                    Faça uma simulação para visualizar os dados.
                </div>
            </td>
        </tr>
    `;


    ultimaSimulacao = null;


    elements.capitalInicial.focus();
}


/* =========================================================
   ENTER
========================================================= */

function configurarEnter() {

    const campos = [

        elements.capitalInicial,
        elements.aporteMensal,
        elements.taxaJuros,
        elements.periodo

    ];


    campos.forEach(campo => {

        campo.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    executarCalculo();
                }

            }
        );

    });
}


/* =========================================================
   INPUTS
========================================================= */

function configurarInputs() {

    const campos = [

        elements.capitalInicial,
        elements.aporteMensal,
        elements.taxaJuros,
        elements.periodo

    ];


    campos.forEach(campo => {

        campo.addEventListener(
            "input",
            () => {

                campo
                    .closest(".input-wrapper")
                    ?.classList.remove("error");


                if (
                    elements.formMessage.classList.contains(
                        "show"
                    )
                ) {

                    esconderMensagem();
                }

            }
        );

    });
}


/* =========================================================
   SERVICE WORKER
========================================================= */

function registrarServiceWorker() {

    if (
        !("serviceWorker" in navigator)
    ) {
        return;
    }


    window.addEventListener(
        "load",
        async () => {

            try {

                await navigator.serviceWorker.register(
                    "./service-worker.js",
                    {
                        scope: "./"
                    }
                );


                console.log(
                    "LevoraTech PWA: Service Worker ativo."
                );

            } catch (error) {

                console.error(
                    "Erro ao registrar Service Worker:",
                    error
                );

            }

        }
    );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function inicializar() {

    configurarEnter();
    configurarInputs();


    elements.capitalInicial.value =
        "1000";


    elements.aporteMensal.value =
        "300";


    elements.taxaJuros.value =
        "1";


    elements.periodo.value =
        "24";


    elements.tipoJuros.value =
        "compostos";


    elements.btnCalcular.addEventListener(
        "click",
        executarCalculo
    );


    elements.btnLimpar.addEventListener(
        "click",
        limparSimulacao
    );


    registrarServiceWorker();
}


/* =========================================================
   START
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        inicializar
    );

} else {

    inicializar();

}