document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
});
document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const regionSelect = document.getElementById("region-select");
    const regionalGraph = document.getElementById("regional-graph");
    const pdpsap = document.getElementById("Gráficos_PDP1");
    const pdp1 = document.getElementById("Gráficos_PDP2");
    const pdp2 = document.getElementById("Gráficos_PDP3");
    const pdp3 = document.getElementById("Gráficos_PDP4");
    const pdp4 = document.getElementById("Gráficos_PDP5");
    const pdp5 = document.getElementById("Gráficos_PDP6");

    regionSelect.addEventListener("change", () => {
        const selectedRegion = regionSelect.value;

        // Atualizar o gráfico de correlação regional
        regionalGraph.src = `../imagens/grafico_barras_spearman_${selectedRegion}.png`;
        regionalGraph.alt = `Gráfico de Correlação - ${selectedRegion}`;

        // Atualizar gráficos de SAP e PDP
        pdpsap.src = `../imagens/shap_detratores_XGB${selectedRegion}.png`;
        pdpsap.alt = `Gráfico SHAP - ${selectedRegion}`;
        document.getElementById("title1").innerHTML = `Gráfico SHAP - ${selectedRegion}`;

        pdp1.src = `../imagens/revisao_partial_dependence1_neutros_XGB${selectedRegion}.png`;
        pdp1.alt = `Gráfico PDP 1 - ${selectedRegion}`;
        document.getElementById("title2").innerHTML = `Gráfico PDP 1 - ${selectedRegion}`;

        pdp2.src = `../imagens/revisao_partial_dependence1_neutros_XGB${selectedRegion}.png`;
        pdp2.alt = `Gráfico PDP 2 - ${selectedRegion}`;
        document.getElementById("title3").innerHTML = `Gráfico PDP 2 - ${selectedRegion}`;

        pdp3.src = `../imagens/revisao_partial_dependence1_neutros_XGB${selectedRegion}.png`;
        pdp3.alt = `Gráfico PDP 3 - ${selectedRegion}`;
        document.getElementById("title4").innerHTML = `Gráfico PDP 3 - ${selectedRegion}`;

        pdp4.src = `../imagens/revisao_partial_dependence4_detratores_XGB${selectedRegion}.png`;
        pdp4.alt = `Gráfico PDP 4 - ${selectedRegion}`;
        document.getElementById("title5").innerHTML = `Gráfico PDP 4 - ${selectedRegion}`;

        pdp5.src = `../imagens/revisao_partial_dependence5_detratores_XGB${selectedRegion}.png`;
        pdp5.alt = `Gráfico PDP 5 - ${selectedRegion}`;
        document.getElementById("title6").innerHTML = `Gráfico PDP 5 - ${selectedRegion}`;
    });
});
