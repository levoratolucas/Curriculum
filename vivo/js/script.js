function loadContent(type) {
  const workspace = document.getElementById("workspace");

  if (type === "form") {
    workspace.innerHTML = `
      <div class="formulario">
        <h2>Formulário de Equipamento</h2>
        <label>Designador:</label>
        <input type="text" placeholder="Digite aqui">

        <label>C-VLAN:</label>
        <input type="number" placeholder="Ex: 11">

        <label>LAN:</label>
        <input type="text" placeholder="172.16.10.20/29">

        <label>WAN:</label>
        <input type="text" placeholder="172.16.30.40/30">

        <button onclick="gerarComando()">Gerar</button>
      </div>
    `;
  } 
  else if (type === "terminal") {
    workspace.innerHTML = `
      <div class="terminal">
        <p>delete interfaces ethernet eth1</p>
        <p>set interfaces ethernet eth1 description WAN_VIVO</p>
        <p>set interfaces ethernet eth1 address 172.16.30.42/30</p>
        <p>set interfaces ethernet eth2 description LAN_CLIENTE</p>
        <p>set protocols static route 0.0.0.0/0 next-hop 172.16.30.41</p>
        <p>commit</p>
        <p>save</p>
      </div>
    `;
  } 
  else if (type === "info") {
    workspace.innerHTML = `
      <div class="info">
        <h2>Informações do Sistema</h2>
        <p>Versão: 1.0.0</p>
        <p>Desenvolvido por Levoratech</p>
        <p>Contato: suporte@levoratech.com</p>
      </div>
    `;
  }
}

function gerarComando() {
  alert("Função de geração de comando ainda em desenvolvimento 😄");
}
