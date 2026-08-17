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

        case "4gt_6gt_ipv6":
            workspace.innerHTML = `
        <div class="formulario">
            <h2>4gt_6gt_ipv6</h2>

            <label>LOOPBACK IPV6:</label>
            <input 
                type="text" 
                id="loopback_ipv6" 
                placeholder="2001:12e0:f00f:ff80::bff/128"
            >

            <label>WAN IPV6:</label>
            <input 
                type="text" 
                id="wan_ipv6" 
                placeholder="2001:12e0:f00f:ff00::191f/127"
            >

            <label>VLAN:</label>
            <input 
                type="text" 
                id="vlan_ipv6" 
                placeholder="2422"
            >

            <button onclick="gerarScript4Gt6GtIpv6()">Gerar</button>
        </div>

        <div class="terminal">
            <p id="output">4gt_6gt_ipv6</p>
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



function gerarScript4Gt6GtIpv6() {

    const loopback = document.getElementById("loopback_ipv6").value.trim();
    const wan_ipv6 = document.getElementById("wan_ipv6").value.trim();
    const vlan = document.getElementById("vlan_ipv6").value.trim();

    // Validação
    if (!loopback || !wan_ipv6 || !vlan) {
        alert("Preencha a Loopback IPv6, WAN IPv6 e VLAN.");
        return;
    }

    // Separa IP e prefixo
    const [loopbackAddress, prefixoLoopback] = loopback.split("/");
    const [wanAddress, prefixoWan] = wan_ipv6.split("/");

    if (!prefixoLoopback || !prefixoWan) {
        alert("Informe os IPv6 com prefixo. Exemplo: 2001:12e0:f00f:ff00::191f/127");
        return;
    }

    /*
     * Converte IPv6 para BigInt
     */
    function ipv6ToBigInt(ip) {

        let partes = ip.split("::");

        let esquerda = partes[0] ? partes[0].split(":") : [];
        let direita = partes[1] ? partes[1].split(":") : [];

        // IPv6 completo possui 8 blocos
        const faltantes = 8 - esquerda.length - direita.length;

        const blocos = [
            ...esquerda,
            ...Array(faltantes).fill("0"),
            ...direita
        ];

        if (blocos.length !== 8) {
            throw new Error("IPv6 inválido.");
        }

        let resultado = 0n;

        for (const bloco of blocos) {
            resultado = (resultado << 16n) + BigInt(parseInt(bloco || "0", 16));
        }

        return resultado;
    }

    /*
     * Converte BigInt para IPv6
     */
    function bigIntToIpv6(valor) {

        const blocos = [];

        for (let i = 0; i < 8; i++) {
            blocos.unshift(
                Number(valor & 0xffffn).toString(16)
            );

            valor >>= 16n;
        }

        // Comprimi a maior sequência de zeros
        let melhorInicio = -1;
        let melhorTamanho = 0;

        let inicioAtual = -1;
        let tamanhoAtual = 0;

        for (let i = 0; i <= 8; i++) {

            if (i < 8 && blocos[i] === "0") {

                if (inicioAtual === -1) {
                    inicioAtual = i;
                    tamanhoAtual = 1;
                } else {
                    tamanhoAtual++;
                }

            } else {

                if (tamanhoAtual > melhorTamanho) {
                    melhorInicio = inicioAtual;
                    melhorTamanho = tamanhoAtual;
                }

                inicioAtual = -1;
                tamanhoAtual = 0;
            }
        }

        if (melhorTamanho >= 2) {

            const antes = blocos.slice(0, melhorInicio).join(":");
            const depois = blocos
                .slice(melhorInicio + melhorTamanho)
                .join(":");

            if (antes && depois) {
                return `${antes}::${depois}`;
            }

            if (antes) {
                return `${antes}::`;
            }

            if (depois) {
                return `::${depois}`;
            }

            return "::";
        }

        return blocos.join(":");
    }

    /*
     * WAN informada = NEXT-HOP
     *
     * Exemplo:
     *
     * WAN:
     * 2001:12e0:f00f:ff00::191f/127
     *
     * Interface:
     * 2001:12e0:f00f:ff00::1920/127
     */

    let wanBigInt;

    try {
        wanBigInt = ipv6ToBigInt(wanAddress);
    } catch (erro) {
        alert("WAN IPv6 inválida.");
        return;
    }

    // Próximo IPv6
    const interfaceBigInt = wanBigInt + 1n;

    const interfaceAddress = bigIntToIpv6(interfaceBigInt);

    // Gera configuração
    const output = document.getElementById("output");

    output.textContent = `
edit system login tacplus-server
    set accounting
    set authorization
    set host 2001:12E0:800:FFFF::135 secret t3l3f0n!c4@
    set host 2001:12E0:800:FFFF::136 secret t3l3f0n!c4@
    set host 2001:12E0:800:FFFF::134 secret t3l3f0n!c4@
    set host 2001:12E0:800:FFFF::135 source-address ${loopbackAddress}
    set host 2001:12E0:800:FFFF::136 source-address ${loopbackAddress}
    set host 2001:12E0:800:FFFF::134 source-address ${loopbackAddress}
exit

set interfaces loopback lo1 address ${loopback}

set interfaces ethernet eth1 vif ${vlan} address '${interfaceAddress}/${prefixoWan}'

set protocols static route6 ::/0 next-hop '${wanAddress}'

commit
save
    `.trim();
}


