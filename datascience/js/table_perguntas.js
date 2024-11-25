
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

document.getElementsByClassName("csss")[0].addEventListener("change", (event) => {
    const caminho1 = 'data/Grupo '+event.target.value+'_perguntas_csat.csv';
    carregarCSV1(caminho1);
});