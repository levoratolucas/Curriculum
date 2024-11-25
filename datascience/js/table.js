
async function carregarCSV2(caminho2) {
    try {
        if (!caminho2) {
            alert("Por favor, selecione um arquivo CSV.");
            return;
        }

        const response2 = await fetch(caminho2);
        if (!response2.ok) throw new Error("Erro ao carregar o arquivo CSV");
        const texto2 = await response2.text();

        // Converter CSV para tabela
        const linhas2 = texto2.trim().split("\n");
        const tabela2 = document.getElementById("tableee");
        tabela2.innerHTML = ""; // Limpar tabela antes de carregar

        linhas2.forEach((linha, index) => {
            const dados = linha.split(",");
            const tr2 = document.createElement("tr");

            dados.forEach((dado) => {
                const celula2 = index === 0 ? document.createElement("th") : document.createElement("td");
                celula2.textContent = dado;
                tr2.appendChild(celula2);
            });

            tabela2.appendChild(tr2);
        });
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível carregar o arquivo CSV.");
    }
}

document.getElementsByClassName("csss")[0].addEventListener("change", (event) => {
    const caminho2 = 'data/Grupo '+event.target.value+'_safra.csv';
    carregarCSV2(caminho2);
});