
function canais(n) {
    n = parseInt(n);
    if (n <= 15) {
        return `1-${n}`;
    } else {
        let firstRange = "1-15";
        let secondRange = `17-${n + 1}`;
        return `${firstRange},${secondRange}`;
    }
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

function infosIpsLan() {
    let lanIp1 = parseInt(document.getElementById('lan-ip1').value);
    let lanIp2 = parseInt(document.getElementById('lan-ip2').value);
    let lanIp3 = parseInt(document.getElementById('lan-ip3').value);
    let lanIp4 = parseInt(document.getElementById('lan-ip4').value);
    let lanmask = parseInt(document.getElementById('lan-mask').value);

    if (isNaN(lanIp1) || isNaN(lanIp2) || isNaN(lanIp3) || isNaN(lanIp4) || isNaN(lanmask)) {
        alert("Faltou informações no endereço IP ou máscara LAN");
        return null;
    }

    return { lanIp1, lanIp2, lanIp3, lanIp4, lanmask };
}

function generateAligeraR2(ramal) {
    const lanInfo = infosIpsLan();
    const canais = infosCanais();
    const desig = infosIpsDesig();

    if (!lanInfo || !canais || desig === null) {
        return;
    }else if(canais > 30){
        alert("Use outro equipamento, a aligera é pra até 30 canais")
        return
    }

    let { lanIp1, lanIp2, lanIp3, lanIp4, lanmask } = lanInfo;
    let lan = generateIpMacRoute(lanIp1, lanIp2, lanIp3, lanIp4, lanmask);
    
    const output = generateAligeraConfigR2(lan[0], lan[1], desig, ramal, canais);
    
    document.getElementById("output").innerText = output;

    // Mostrar o botão de copiar
    document.getElementById("copyButton").style.display = "inline-block";
}