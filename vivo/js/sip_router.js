function loadContent(type) {
    const workspace = document.getElementById("workspace");
    switch (type) {
        case "4gt_6gt":
            workspace.innerHTML = `
                <div class="formulario">
                    <h2>4gt 6gt SIP</h2>
                    <label>Designador:</label>
                    <input type="text" id="designador" placeholder="Digite aqui">

                    <label>C-VLAN:</label>
                    <input type="number" id="cvlan" placeholder="Ex: 11">

                    <label>LAN:</label>
                    <input type="text" id="lan" placeholder="172.16.10.20/29">
                    
                    <label>LOOPBACK:</label>
                    <input type="text" id="loopback" placeholder="172.16.10.20/29">
                    
                    <label>WAN:</label>
                    <input type="text" id="wan" placeholder="172.16.30.40/30">

                    <button onclick="gerarComando('4gt_6gt')">Gerar</button>

                </div>
                <div class="terminal">
                    <p id="output">4GT 6GT</p>
                </div>
            `;
            break;

        case "huawei":
            workspace.innerHTML = `
                <div class="formulario">
                    <h2>HUAWEI SIP</h2>
                    <label>Designador:</label>
                    <input type="text" id="designador" placeholder="Digite aqui">

                    <label>C-VLAN:</label>
                    <input type="number" id="cvlan" placeholder="Ex: 11">

                    <label>LAN:</label>
                    <input type="text" id="lan" placeholder="172.16.10.20/29">
                    
                    <label>LOOPBACK:</label>
                    <input type="text" id="loopback" placeholder="172.16.10.20/29">
                    
                    <label>WAN:</label>
                    <input type="text" id="wan" placeholder="172.16.30.40/30">

                    <button onclick="gerarComando('huawei')">Gerar</button>
                </div>
                <div class="terminal">
                    <p id="output">HUAWEI</p>
                </div>
            `;
            break;

        case "aligera":
            workspace.innerHTML = `
                <div class="formulario">
                    <h2>HUAWEI SIP</h2>
                    <label>Designador:</label>
                    <input type="text" id="designador" placeholder="Digite aqui">
                    
                    <label>SINALIZAÇÃO:</label>
                    <select name="" id="r2">
                        <option value="r2">R2 piloto</option>
                        <option value="r2ramal">R2 RAMAL</option>
                        <option value="isdn">ISDN piloto</option>
                        <option value="isdnramal">ISDN RAMAL</option>
                    </select>

                    <label>CANAIS:</label>
                    <input type="number" id="canais" placeholder="Ex: 11">

                    <label>LAN:</label>
                    <input type="text" id="lan" placeholder="172.16.10.20/29">

                    <button onclick="gerarComandoConversor()">Gerar</button>
                </div>
                <div class="terminal">
                    <p id="output">HUAWEI</p>
                </div>
            `;

            break;
            case "tabelaCsv":
    workspace.innerHTML = `
        <div class="formulario">
            <h2>Sites Vivo</h2>
            <label>Pesquisar por Sigla:</label>
            <input type="text" id="searchSigla" placeholder="Digite a sigla">

            <div id="tableContainer" class="tabela-container">
                <table id="csvTable" class="tabela-csv"></table>
            </div>
        </div>
    `;

    fetch("sites.csv")
        .then(response => response.text())
        .then(csvText => {
            // Divide o CSV em linhas e limpa espaços extras
            const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l);
            if (lines.length === 0) {
                document.getElementById('tableContainer').innerHTML = `<p style="color:#f55;">CSV vazio</p>`;
                return;
            }

            // Divide cada linha por ";" e remove aspas/bom
            const data = lines.map(line =>
                line.split(';').map(cell => cell.replace(/^\uFEFF/, '').trim().replace(/^"|"$/g, ''))
            );

            const table = document.getElementById('csvTable');
            table.innerHTML = '';

            // Cria thead (cabeçalho)
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            data[0].forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            // Cria tbody (dados)
            const tbody = document.createElement('tbody');
            for (let i = 1; i < data.length; i++) {
                const row = document.createElement('tr');
                data[i].forEach(cell => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
            table.appendChild(tbody);

            // Normaliza o nome dos cabeçalhos e encontra o índice da coluna "Sigla"
            const normalizedHeaders = data[0].map(h => h.toLowerCase().normalize('NFKD').replace(/\s+/g, ''));
            const siglaIndex = normalizedHeaders.findIndex(h => h.includes('sigla'));

            if (siglaIndex === -1) {
                document.getElementById('tableContainer').insertAdjacentHTML(
                    'afterbegin',
                    `<p style="color:#f55;">Cabeçalho "Sigla" não encontrado. Cabeçalhos: ${data[0].join(', ')}</p>`
                );
                return;
            }

            // Filtro por sigla
            const searchInput = document.getElementById('searchSigla');
            searchInput.addEventListener('input', function() {
                const filter = this.value.toLowerCase();
                const rows = tbody.querySelectorAll('tr');

                rows.forEach(row => {
                    const cell = row.children[siglaIndex];
                    if (!cell) return;
                    row.style.display = cell.textContent.toLowerCase().includes(filter) ? '' : 'none';
                });
            });
        })
        .catch(error => {
            document.getElementById('tableContainer').innerHTML =
                `<p style="color:#f55;">Erro ao carregar CSV: ${error}</p>`;
        });
    break;


        default:
            workspace.innerHTML = `<p>Tipo não encontrado</p>`;
            break;
    }
}

function gerarComando(type) {
    const designador = document.getElementById("designador").value;
    const cvlan = document.getElementById("cvlan").value;
    const lan = document.getElementById("lan").value;
    const loopback = document.getElementById("loopback").value;
    const wan = document.getElementById("wan").value;

    const output = document.getElementById("output");

    switch (type) {
        case "huawei":
            output.textContent = gerarScriptHuawei(designador, cvlan, lan, wan, loopback);
            break;

        case "4gt_6gt":
            output.textContent = gerarScript4Gt6Gt(designador, cvlan, lan, wan, loopback);

            break;

        default:
            break;
    }
}
function gerarComandoConversor() {
    const designador = document.getElementById("designador").value;
    const canais = document.getElementById("canais").value;
    const lan = document.getElementById("lan").value;
    const type = document.getElementById("r2").value;

    const output = document.getElementById("output");

    switch (type) {
        case "r2":
            // output.textContent = generateAligeraConfigR2(lanMac, lanRoute, desig, false, canais)
            output.textContent = gerarScriptAligeraR2(designador, lan, false, canais)
            break;
        case "r2ramal":
            output.textContent = gerarScriptAligeraR2(designador, lan, true, canais)
            break;
        case "isdn":
            output.textContent = gerarScriptAligeraisdn(designador, lan, false, canais)
            break;
        case "isdnramal":
            output.textContent = gerarScriptAligeraisdn(designador, lan, true, canais)
            break;



        case "aligeraPiloto":

            break;

        default:
            break;
    }
}

function validarIP(ip) {
    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\/([0-9]|[12][0-9]|3[0-2])$/;
    return ipRegex.test(ip);
}

function separarIP(ip, type) {
    if (!validarIP(ip)) {
        alert(`IP inválido para ${type}. Digite no formato ?.?.?.?/? com valores corretos`);
        return null;
    }

    const [endereco, prefixo] = ip.split("/");
    const octetos = endereco.split(".").map(oct => parseInt(oct));

    return [...octetos, parseInt(prefixo)];
}

function gerarScriptHuawei(designador, cvlan, lan, wan, loopback) {
    const lanParts = separarIP(lan, "LAN");
    const wanParts = separarIP(wan, "WAN");
    const loopbackParts = separarIP(loopback, "LOOPBACK");

    if (!lanParts || !wanParts || !loopbackParts) return "!!!!!!  REVISE SEUS DADOS  !!!!!!";

    return `
        system-view

        sysname ${designador}

        interface gi0/0/4.${cvlan}
        dot1q termination vid ${cvlan}
        description WAN VIVO
        ip address ${wanParts[0]}.${wanParts[1]}.${wanParts[2]}.${wanParts[3] + 2} ${wanParts[4]}
        quit 

        save
        y

        ip route-static 0.0.0.0 0.0.0.0 ${wanParts[0]}.${wanParts[1]}.${wanParts[2]}.${wanParts[3] + 1}
        save
        y

        interface gi0/0/0
        undo portswitch 
        description LAN
        ip address ${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 1} ${lanParts[4]}
        quit
        save
        y
    `;
}




function gerarScript4Gt6Gt(designador, cvlan, lan, wan, loopback) {
    const lanParts = separarIP(lan, "LAN");
    const wanParts = separarIP(wan, "WAN");
    const loopbackParts = separarIP(loopback, "LOOPBACK");

    if (!lanParts || !wanParts || !loopbackParts) return "!!!!!!  REVISE SEUS DADOS  !!!!!!";

    return `

delete interfaces ethernet eth1

set interfaces ethernet eth1 description WAN_VIVO

set interfaces ethernet eth1 duplex auto

set interfaces ethernet eth1 speed auto

set interfaces ethernet eth1 vif ${cvlan} address ${wanParts[0]}.${wanParts[1]}.${wanParts[2]}.${wanParts[3] + 2}/${wanParts[4]}

set interfaces ethernet eth2 address ${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 1}/${lanParts[4]}

set interfaces ethernet eth2 description LAN_CLIENTE

set interfaces ethernet eth2 duplex auto

set interfaces ethernet eth2 speed auto

set protocols memory-limit 100

set protocols static route 0.0.0.0/0 next-hop ${wanParts[0]}.${wanParts[1]}.${wanParts[2]}.${wanParts[3] + 1}

set system host-name ${designador}

commit

save
        
    `;
}


