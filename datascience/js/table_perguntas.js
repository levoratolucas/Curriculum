async function carregarCSV1(caminho1) {
    try {
        if (!caminho1) {
            alert("Por favor, selecione um arquivo CSV.");
            return;
        }

        const response1 = await fetch(caminho1);
        if (!response1.ok) throw new Error("Erro ao carregar o arquivo CSV");
        const texto1 = await response1.text();

        // Converter CSV para tabela
        const linhas1 = texto1.trim().split("\n");
        const tabela1 = document.getElementById("tableee_perg");
        if (!tabela1) {
            console.error("Elemento 'tableee_perg' não encontrado.");
            return;
        }
        tabela1.innerHTML = ""; // Limpar tabela antes de carregar

        linhas1.forEach((linha, index) => {
            const dados = linha.split(";");
            const tr1 = document.createElement("tr");

            dados.forEach((dado) => {
                const celula1 = index === 0 ? document.createElement("th") : document.createElement("td");
                celula1.textContent = dado;
                tr1.appendChild(celula1);
            });

            tabela1.appendChild(tr1);
        });
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar o arquivo CSV.");
    }
}

// Adicionar event listener na classe 'csss'
const elementosClasseCsss = document.getElementsByClassName("csss");
if (elementosClasseCsss.length > 0) {
    elementosClasseCsss[0].addEventListener("change", (event) => {
        const caminho1 = `data/Grupo ${event.target.value}_perguntas_csat.csv`;
        carregarCSV1(caminho1);
    });
} else {
    console.warn("Elemento com classe 'csss' não encontrado.");
}

// Adicionar event listener no ID 'css'
const elementoIdCss = document.getElementById("region-select");
if (elementoIdCss) {
    
        const caminho1 = '../data/Grupo 4_perguntas_csat.csv';
        carregarCSV1(caminho1);
    ;
} else {
    console.warn("Elemento com ID 'css' não encontrado.");
}
