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

    if(type === "huawei") {
        output.textContent = gerarScriptHuawei(designador, cvlan, lan, wan, loopback);
    } else if(type === "4gt_6gt") {
        output.textContent = gerarScript4Gt6Gt(designador, cvlan, lan, wan, loopback);
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
    const lanParts = separarIP(lan,"LAN");
    const wanParts = separarIP(wan,"WAN");
    const loopbackParts = separarIP(loopback,"LOOPBACK");

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
    const lanParts = separarIP(lan,"LAN");
    const wanParts = separarIP(wan,"WAN");
    const loopbackParts = separarIP(loopback,"LOOPBACK");

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
