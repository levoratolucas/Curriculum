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

        alert("no maximo 30 canais se atente a isso")
        return null
    }
    if (n <= 15) {
        return `1-${n}`;
    } else {
        let firstRange = "1-15";
        let secondRange = `17-${n + 1}`;
        return `${firstRange},${secondRange}`;
    }
}