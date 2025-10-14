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
    if(n > 30){
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