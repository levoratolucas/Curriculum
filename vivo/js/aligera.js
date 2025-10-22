function loadContent(type) {
    const workspace = document.getElementById("workspace");
    switch (type) {

        case "aligera":
            workspace.innerHTML = `
            <div class="formulario">
            <h2>ALIGERA</h2>
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

        case "digistar":
            workspace.innerHTML = `
            <div class="formulario">
                <h1>Adicionando números e redirecionamentos</h1>
                    <div class="ratio">
                    <input type="radio" id="piloto" checked name="script-type" value="piloto">
                    <label for="piloto">Piloto</label>
                    </div>
                    <div class="ratio">
                    <input type="radio" id="ramal" name="script-type" value="ramal">
                    <label for="ramal">Ramal</label>
                    </div>
                    <div class="ip-group">
                    <input required type="number" id="piloto-form" placeholder="Piloto ex: 4132222222">
                    </div>
                    <input type="text" id="lan" placeholder="172.16.10.20/29">
                    <p>Sinalização da central:</p>
                    <select id="quantitySelect">
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10" selected>10</option>
                    </select>
                <textarea id="inputText" placeholder="Insira os números no campo abaixo e clique em 'Gerar'.

                    NUMEROS413-125-9996
                    NUMEROS413-125-9997
                    NUMEROS413-125-9998
                    NUMEROS413-125-9999"></textarea>
                <br>
                <button onclick="generateDigistar()">Gerar</button>
                <button id="copyButton" style="display:none;" onclick="copyToClipboard()">Copiar</button>
                </main>
                <div class="terminal" id="output"></div>
                </div>
            </div>
  `

            break;

        default:
            workspace.innerHTML = `<p>Tipo não encontrado</p>`;
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
function gerarScriptAligeraR2(designador, lan, ramal, canais) {
    const lanParts = separarIP(lan, "LAN");


    if (!lanParts) return "!!!!!!  REVISE SEUS DADOS  !!!!!!";
    const lanMac = `${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 2}`;
    const lanRoute = `${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 1}`;

    return generateAligeraConfigR2(lanMac, lanRoute, designador, ramal, canais);
}
function gerarScriptAligeraisdn(designador, lan, ramal, canais) {
    const lanParts = separarIP(lan, "LAN");


    if (!lanParts) return "!!!!!!  REVISE SEUS DADOS  !!!!!!";
    const lanMac = `${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 2}`;
    const lanRoute = `${lanParts[0]}.${lanParts[1]}.${lanParts[2]}.${lanParts[3] + 1}`;

    return generateAligeraConfig(lanMac, lanRoute, designador, ramal, canais);
}
function generateAligeraConfigR2(lanMac, lanRoute, desig, ramal, canaisCount) {
    ramal = ramal === true ? "yes" : "no";
    const canaisConfig = canais(canaisCount);


    return `
config sip bindport 5060
config sip prack outgoing
config sip session_expires 1800
config sip session_minse 600
config sip session_refresher uas
config sip session_timers accept
config sip tos_sip 46
config sip tos_rtp 184
config sip vad yes
config sip vad_level 30
config sip cng no
config sip jb_type adaptative
config sip jb_size 80
config sip rtp_port_min 10000
config sip rtp_port_max 20000
config sip t38_port_min 4000
config sip t38_port_max 4999
config sip dtmf_rtp_pt 100
config sip modem_tones_outband no
config sip peer trunk1 register no
config network switch cpu vlan_default 4094
config network switch cpu vlan_allowed 4094
config network switch port1 mode autoneg
config network switch port1 vlan_default 4094
config network switch port1 vlan_allowed 4094
config network switch port1 vlan_policy none
config network switch port2 mode autoneg
config network switch port2 vlan_default 4094
config network switch port2 vlan_allowed 4094
config network switch port2 vlan_policy none
config network switch vlan_mode disable
config network switch monitor_port none
config network ip type static
config network ip address ${lanMac}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanRoute}
config network hostname ${desig}_
config network mtu 1400
config network dns 

config save
config apply

config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling mfcr2
config tdm port1 timeslots ${canaisConfig}
config tdm port1 hunt_policy round_up
config tdm port1 mfcr2 variant br
config tdm port1 mfcr2 max_ani 10
config tdm port1 mfcr2 max_dnis 20
config tdm port1 mfcr2 get_ani_first no
config tdm port1 mfcr2 allow_collect_calls yes
config tdm port1 mfcr2 double_answer no
config tdm port1 mfcr2 reanswer_timeout 90000
config tdm port1 mfcr2 mfback_timeout 5000
config tdm port1 mfcr2 accept_on_offer no
config tdm port1 mfcr2 tone_amp 200
config save
config apply

config sip peer trunk1 username user
config sip peer trunk1 secret pass
config sip peer trunk1 host 192.168.1.2
config sip peer trunk1 port 5060
config sip peer trunk1 dtmfmode rfc2833
config sip peer trunk1 t38 yes
config sip peer trunk1 codecs alaw
config sip peer trunk1 options_keepalive no
config sip peer trunk1 send_pai ${ramal}
config sip peer vivo1 register no
config sip peer vivo1 username 
config sip peer vivo1 secret 
config sip peer vivo1 host 192.168.25.1
config sip peer vivo1 port 5060
config sip peer vivo1 dtmfmode rfc2833
config sip peer vivo1 t38 yes
config sip peer vivo1 codecs alaw
config sip peer vivo1 options_keepalive no
config sip peer vivo1 pref_codec_only yes
config sip peer vivo1 send_pai ${ramal}
config sip peer vivo1 sessionprogress no
config save 
config apply

config dialplan rule tdm_group1_default source_peer tdm group1
config dialplan rule tdm_group1_default destination_peer sip vivo1
config dialplan rule tdm_group1_default called_pattern X.
config dialplan rule tdm_group1_default callerid_pattern 
config dialplan rule tdm_group1_default outgoing_called {}
config dialplan rule tdm_group1_default outgoing_callerid {}
config dialplan rule tdm_group1_default answer_timeout 90
config dialplan rule sip_trunk1_default source_peer sip vivo1
config dialplan rule sip_trunk1_default destination_peer tdm group1
config dialplan rule sip_trunk1_default called_pattern X.
config dialplan rule sip_trunk1_default callerid_pattern 
config dialplan rule sip_trunk1_default outgoing_called {:-4}
 config dialplan rule sip_trunk1_default outgoing_callerid {:1}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
 
config save
config apply

    `;
}
function generateAligeraConfig(lanMac, lanRoute, desig, ramal, canaisCount) {
    ramal = ramal === true ? "yes" : "no";
    const canaisConfig = canais(canaisCount);


    return `
config sip bindport 5060
config sip prack outgoing
config sip session_expires 1800
config sip session_minse 600
config sip session_refresher uas
config sip session_timers accept
config sip tos_sip 46
config sip tos_rtp 184
config sip vad yes
config sip vad_level 30
config sip cng no
config sip jb_type adaptative
config sip jb_size 80
config sip rtp_port_min 10000
config sip rtp_port_max 20000
config sip t38_port_min 4000
config sip t38_port_max 4999
config sip dtmf_rtp_pt 100
config sip modem_tones_outband no
config sip peer trunk1 register no
config network switch cpu vlan_default 4094
config network switch cpu vlan_allowed 4094
config network switch port1 mode autoneg
config network switch port1 vlan_default 4094
config network switch port1 vlan_allowed 4094
config network switch port1 vlan_policy none
config network switch port2 mode autoneg
config network switch port2 vlan_default 4094
config network switch port2 vlan_allowed 4094
config network switch port2 vlan_policy none
config network switch vlan_mode disable
config network switch monitor_port none
config network ip type static
config network ip address ${lanMac}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanRoute}
config network hostname ${desig}_
config network mtu 1400
config network dns 
config save
config apply

config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling isdn_net
config tdm port1 timeslots ${canaisConfig}
config tdm port1 isdn switchtype euroisdn
config tdm port1 isdn overlapdial yes
config save
config apply

config sip peer trunk1 username user
config sip peer trunk1 secret pass
config sip peer trunk1 host 192.168.1.2
config sip peer trunk1 port 5060
config sip peer trunk1 dtmfmode rfc2833
config sip peer trunk1 t38 yes
config sip peer trunk1 codecs alaw
config sip peer trunk1 options_keepalive no
config sip peer trunk1 send_pai ${ramal}
config sip peer vivo1 register no
config sip peer vivo1 username 
config sip peer vivo1 secret 
config sip peer vivo1 host 192.168.25.1
config sip peer vivo1 port 5060
config sip peer vivo1 dtmfmode rfc2833
config sip peer vivo1 t38 yes
config sip peer vivo1 codecs alaw
config sip peer vivo1 options_keepalive no
config sip peer vivo1 pref_codec_only yes
config sip peer vivo1 send_pai ${ramal}
config sip peer vivo1 sessionprogress no
config save 
config apply

config dialplan rule tdm_group1_default source_peer tdm group1
config dialplan rule tdm_group1_default destination_peer sip vivo1
config dialplan rule tdm_group1_default called_pattern X.
config dialplan rule tdm_group1_default callerid_pattern 
config dialplan rule tdm_group1_default outgoing_called {}
config dialplan rule tdm_group1_default outgoing_callerid {}
config dialplan rule tdm_group1_default answer_timeout 90
config dialplan rule sip_trunk1_default source_peer sip vivo1
config dialplan rule sip_trunk1_default destination_peer tdm group1
config dialplan rule sip_trunk1_default called_pattern X.
config dialplan rule sip_trunk1_default callerid_pattern 
config dialplan rule sip_trunk1_default outgoing_called {:-4}
 config dialplan rule sip_trunk1_default outgoing_callerid {:1}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
 
config save
config apply

config login user vivo password vivo

config save
config apply
    `;
}
function canais(n) {
    n = parseInt(n);
    if (n > 30) {
        alert("no maximo 30 canais, foi re ajustado pra 30, caso seja mais que 30, entre em contato com seu gestor")
        n = 30
    }
    if (n <= 15) {
        return `1-${n}`;
    } else {
        let firstRange = "1-15";
        let secondRange = `17-${n + 1}`;
        return `${firstRange},${secondRange}`;
    }
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
function validarIP(ip) {
    const ipRegex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\/([0-9]|[12][0-9]|3[0-2])$/;
    return ipRegex.test(ip);
}


function extractNumbersFromLine(line) {
    const numbers = line.match(/\d+/g);
    return numbers ? numbers.join('') : '';
}

function generateAccountCommand(number, accountNumber) {
    return `account ${accountNumber}\n` +
        `    user ${number}\n` +
        `    auth-user ${number}\n` +
        `    display-name ${number}\n` +
        `    contact ${number}\n` +
        `    no restricted-id\n` +
        `    allow-simult\n` +
        `    server 1\n  !\n`;
}

function generateRedirectionCommand(number, position, quantity) {
    const truncatedNumber = number.toString().slice(-quantity);
    return `redirection input e1 groups 0 from ${truncatedNumber} to * output voip-operator groups 0 from ${number} to {To}`;
}

function generate(lanIp1, lanIp2, lanIp3, lanIp4) {
    const inputText = document.getElementById("inputText").value.trim();
    const quantity = parseInt(document.getElementById("quantitySelect").value, 10);
    const lines = inputText.split("\n");
    const processedNumbers = new Set();
    const piloto = document.getElementById('piloto-form').value
    let accounts = generateAccountCommand(piloto, 1);
    let redirections = '';
    let accountNumber = 2;
    let position = 0;

    lines.forEach(line => {
        const number = extractNumbersFromLine(line);
        if (number.length >= 9 && !processedNumbers.has(number)) {
            processedNumbers.add(number);
            if (number !== piloto) {
                accounts += generateAccountCommand(number, accountNumber);
                accountNumber++;
            }
            redirections += generateRedirectionCommand(number, position, quantity) + '\n';
            position++;
        }
    });

    let scriptPiloto = `\nredirection input e1 groups 0 from * to * output voip-operator groups 0 from ${piloto} to {To}`;
    const endred = `redirection input voip-operator groups 0 from * to * output e1 groups 0 from {From:3} to {To:-4}\n\n`;
    const script = `digistar

        enable

        configure terminal

        debug sip loglevel 5

        debug pbx loglevel 5

        logging on 

        interface ethernet 1

        ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 2} 255.255.255.248 

        exit

        ip route static inter-vrf 

        ip route 0.0.0.0/0 ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 1}  

        pbx 
        digital-line 1 
        network-mode network 
        clock-mode master 
        trunk-mode r2 
        r2-standard bra 
        crc-4 automatic 
        digits 4 
        enable idc 
        digit-timeout 4 
        line-signaling incoming digital outgoing digital 
        register-signaling incoming mfc outgoing mfc 
        mfc-absent-time 20 
        channels 30 
        occupation increasing 

        exit


        digital-line 2 
        network-mode network 
        clock-mode master 
        trunk-mode r2 
        r2-standard bra 
        crc-4 automatic 
        digits 4 
        enable idc 
        digit-timeout 4 
        line-signaling incoming digital outgoing digital 
        register-signaling incoming mfc outgoing mfc 
        mfc-absent-time 20 
        channels 30 
        occupation increasing

        exit

        exit

        sip 
        user EX-USER 
        transport udp port 5060 
        codec g729 
        codec fax g711u 
        no vad  
        no only_one_codec  
        dtmf outband 
        dtmf outband payload 101 
        cid from uri 
        no prack    
        no ignore-hold  
        no compact-headers  
        signalling 183-sdp 
        vsp 1 
        only-proxy local-ip 
        no dns-naptr 
        server 192.168.25.1 5060 
        no did display-name 
        no did contact 
        no did restricted-id 
        no did from 
        expire-time 180 
        no proxy-server  
        cid from uri 
        dtmf outband 
        dtmf outband payload 101 
        codec g711u 
        codec fax g711u 
        no vad  
        no only_one_codec  
        transport udp 
        no prack  
        no ignore-hold  
        no compact-headers  
        timeout 2 
        signalling 183-sdp 
        no remote-codec 
        no shutdown 
        
        exit\n`
    const output = script + accounts + '\nexit\n\npbx\n\n' + endred + redirections + scriptPiloto;
    document.getElementById("output").innerText = output;

    // Mostrar o botão de copiar
    document.getElementById("copyButton").style.display = "inline-block";
}

function generateDigistar() {
    const lan = document.getElementById("lan").value;
    const lanParts = separarIP(lan, "LAN");
    generate(lanParts[0], lanParts[1], lanParts[2], lanParts[3])
};

function copyToClipboard() {
    const outputText = document.getElementById("output").innerText;
    const textarea = document.createElement("textarea");
    textarea.value = outputText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    // Alerta para o usuário
    alert("Texto copiado para a área de transferência!");
}
document.addEventListener("DOMContentLoaded", function () {
    // Função para atualizar a visibilidade do campo piloto
    function updateVisibility() {
        const scriptType = document.querySelector('input[name="script-type"]:checked').value;
        const pilotoForm = document.getElementById("piloto-form");
        const inputText = document.getElementById("inputText");
        const quantitySelect = document.getElementById("sinaliza");

        if (scriptType === 'ramal') {
            pilotoForm.style.display = 'block';
            inputText.style.display = 'block';
            quantitySelect.style.display = 'block';
        } else {
            inputText.style.display = 'none';
            inputText.style.value = ''
            quantitySelect.style.display = 'none';
            pilotoForm.style.display = 'block';
        }
    }

    // Adiciona evento change aos botões de rádio
    const radioButtons = document.querySelectorAll('input[name="script-type"]');
    radioButtons.forEach(function (radio) {
        radio.addEventListener('change', updateVisibility);
    });

    // Chama a função uma vez para definir o estado inicial correto
    updateVisibility();
});
