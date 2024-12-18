// Função para alternar entre os formulários
function toggleForms() {
    const scriptType = document.querySelector('input[name="script-type"]:checked').value;
    const gt6gt4Form = document.getElementById('gt6gt4-form');
    const edd24_fust = document.getElementById('fust');
    const edd24_fust1 = document.getElementById('fust1');
    const edd24_fust2 = document.getElementById('fust2');
    const maintenanceMessage = document.getElementById('maintenance-message');
    const channelsContainer = document.getElementById('channels-container');

    if (scriptType === 'gt6gt4') {
        gt6gt4Form.style.display = 'block';
        maintenanceMessage.style.display = 'none';
        channelsContainer.style.display = 'none';
        edd24_fust.style.display = 'block';
        edd24_fust2.style.display = 'block';
        edd24_fust1.style.display = 'block';
    } 
    else if (scriptType === 'aligera-piloto' || scriptType === 'aligera-ramal' || scriptType === 'aligera-ramal-isdn' || scriptType === 'aligera-piloto-isdn') {
        gt6gt4Form.style.display = 'block';
        maintenanceMessage.style.display = 'none';
        channelsContainer.style.display = 'block';
        edd24_fust.style.display = 'block';
        edd24_fust2.style.display = 'block';
        edd24_fust1.style.display = 'block';
    } 
    else if (scriptType === 'edd24_fust') {
        gt6gt4Form.style.display = 'block';
        maintenanceMessage.style.display = 'none';
        channelsContainer.style.display = 'none';
        edd24_fust.style.display = 'none';
        edd24_fust2.style.display = 'none';
        edd24_fust1.style.display = 'none';
    } 
    else {
        edd24_fust.style.display = 'block';
        edd24_fust2.style.display = 'block';
        edd24_fust1.style.display = 'block';
        gt6gt4Form.style.display = 'none';
        maintenanceMessage.style.display = 'block';
        channelsContainer.style.display = 'none';
    }
}

// Adiciona evento de mudança aos botões de opção
document.querySelectorAll('input[name="script-type"]').forEach((elem) => {
    elem.addEventListener('change', toggleForms);
});
toggleForms(); // Chama a função ao carregar a página

// Código existente para gerar comando
document.getElementById('generate-command').addEventListener('click', function () {
    const name = document.getElementById('name').value.replace(/ /g, '-').toUpperCase();
    const ord = document.getElementById('ord').value;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if ((!name || !ord ||
        !document.getElementById('lan-ip1').value ||
        !document.getElementById('lan-ip2').value ||
        !document.getElementById('lan-ip3').value ||
        !document.getElementById('lan-ip4').value ||
        !document.getElementById('svlan').value ||
        !document.getElementById('wan-ip1').value ||
        !document.getElementById('wan-ip2').value ||
        !document.getElementById('wan-ip3').value ||
        !document.getElementById('wan-ip4').value )&& scriptType != 'edd24_fust' ) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Captura os endereços LAN
    const lanIp1 = parseInt(document.getElementById('lan-ip1').value);
    const lanIp2 = parseInt(document.getElementById('lan-ip2').value);
    const lanIp3 = parseInt(document.getElementById('lan-ip3').value);
    const lanIp4 = parseInt(document.getElementById('lan-ip4').value);
    const svlan = document.getElementById('svlan').value;
    const wanIp1 = parseInt(document.getElementById('wan-ip1').value);
    const wanIp2 = parseInt(document.getElementById('wan-ip2').value);
    const wanIp3 = parseInt(document.getElementById('wan-ip3').value);
    const wanIp4 = parseInt(document.getElementById('wan-ip4').value);
    const canais = parseInt(document.getElementById('channel-1').value); // Adicionando captura de canais

    // Monta o comando dependendo do tipo de script selecionado
    const scriptType = document.querySelector('input[name="script-type"]:checked').value;
    let command = '';

    if (scriptType === 'aligera-piloto') {
        command = `
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
config network ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 2}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 1}
config network hostname ${name}-OS-${ord}
config network mtu 1400
config network dns 

config save
config apply

config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling mfcr2
config tdm port1 timeslots 1-${canais}
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
config sip peer trunk1 send_pai no
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
config sip peer vivo1 send_pai no
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
config dialplan rule sip_trunk1_default outgoing_callerid {}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
config dialplan rule sip_trunk2_default source_peer tdm group1
config dialplan rule sip_trunk2_default called_pattern X.
config dialplan rule sip_trunk2_default callerid_pattern 
config dialplan rule sip_trunk2_default outgoing_called {}
config dialplan rule sip_trunk2_default outgoing_callerid {:1}
config dialplan rule sip_trunk2_default answer_timeout 90
config dialplan rule sip_trunk3_default source_peer tdm group1
config dialplan rule sip_trunk3_default called_pattern X.
config dialplan rule sip_trunk3_default callerid_pattern 
config dialplan rule sip_trunk3_default outgoing_called {}
config dialplan rule sip_trunk3_default outgoing_callerid {:1}
config dialplan rule sip_trunk3_default answer_timeout 90
config save
config apply

config login user vivo password vivo

config save
config apply
        `;
    }
    else if (scriptType === 'aligera-piloto-isdn') {
        command = `
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
config network ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 2}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 1}
config network hostname ${name}-OS-${ord}
config network mtu 1400
config network dns 
config save
config apply

config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling isdn_net
config tdm port1 timeslots 1-15
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
config sip peer trunk1 send_pai yes
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
config sip peer vivo1 send_pai no
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
config dialplan rule sip_trunk1_default outgoing_callerid {}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
config dialplan rule sip_trunk2_default source_peer tdm group1
config dialplan rule sip_trunk2_default called_pattern X.
config dialplan rule sip_trunk2_default callerid_pattern 
config dialplan rule sip_trunk2_default outgoing_called {}
config dialplan rule sip_trunk2_default outgoing_callerid {:1}
config dialplan rule sip_trunk2_default answer_timeout 90
config dialplan rule sip_trunk3_default source_peer tdm group1
config dialplan rule sip_trunk3_default called_pattern X.
config dialplan rule sip_trunk3_default callerid_pattern 
config dialplan rule sip_trunk3_default outgoing_called {}
config dialplan rule sip_trunk3_default outgoing_callerid {:1}
config dialplan rule sip_trunk3_default answer_timeout 90
config save
config apply

config login user vivo password vivo

config save
config apply
        `;
    }

    else if (scriptType === 'aligera-ramal-isdn') {


        command = `
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
config network ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 +2}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 1}
config network hostname ${name}-OS-${ord}
config network mtu 1400
config network dns 
config save
config apply
    
config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling isdn_net
config tdm port1 timeslots 1-15
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
config sip peer trunk1 send_pai yes
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
config sip peer vivo1 send_pai yes
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
config dialplan rule sip_trunk1_default outgoing_callerid {:3}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
config dialplan rule sip_trunk2_default source_peer tdm group1
config dialplan rule sip_trunk2_default called_pattern X.
config dialplan rule sip_trunk2_default callerid_pattern 
config dialplan rule sip_trunk2_default outgoing_called {}
config dialplan rule sip_trunk2_default outgoing_callerid {:1}
config dialplan rule sip_trunk2_default answer_timeout 90
config dialplan rule sip_trunk3_default source_peer tdm group1
config dialplan rule sip_trunk3_default called_pattern X.
config dialplan rule sip_trunk3_default callerid_pattern 
config dialplan rule sip_trunk3_default outgoing_called {}
config dialplan rule sip_trunk3_default outgoing_callerid {:1}
config dialplan rule sip_trunk3_default answer_timeout 90
config save
config apply
    
config login user ${username} password ${password}
    
config save
config apply
        `;
    }
    else if(scriptType === 'edd24_fust'){
        command = `banner login 
~
           ####                             ###
         ########                        #########
       ############                    ##############
       ####    ####                   ################
       ###      ###                 ###################
       ####    ####                 ###################
        ##########                 ####################
          ######                   ###################
                                   ##################
       ####                         ################
       ########                       #############
         #########           #######    #########       ######
             ######         ###################################
            #######        ####################################
        #########          ####################################
       #######             ###################################
       ###                 ##################################
                                ########################
  ###   ###########                   ##############
#####  ############                   ###############
####   ###########                   ################
                                    ####################
       ###                         ######################
       ######                    ##########################
        #########               ###########  ###############
            #######           ############    ###############
             ######          ###########        #############
          ########           ##########          ###########
       ########              #########             ########
       ####                     ####                 ###
~
!
vlan qinq
!
interface vlan 1
 name DefaultVlan
 ip address 192.168.0.25/24
 set-member untagged ethernet all
!
interface vlan ${svlan}
 name VLAN_1063
 set-member tagged ethernet 1/5
 set-member untagged ethernet 1/8
!
vlan-group 1
vlan-group 1 vlan all
!
interface ethernet 1/5
 description CONN_TO_UPLINK_VIVO_ONT_1/1
 switchport qinq internal
 no switchport storm-control broadcast
 no switchport storm-control multicast
 no switchport storm-control dlf
!
interface ethernet 1/8
 description TELEFONICA
 l2protocol-tunnel cdp
 l2protocol-tunnel stp
 l2protocol-tunnel vtp
 l2protocol-tunnel pvst
 l2protocol-tunnel udld
 l2protocol-tunnel pagp
 l2protocol-tunnel lacp
 l2protocol-tunnel dot1x
 l2protocol-tunnel oam
 l2protocol-tunnel marker
 l2protocol-tunnel gvrp
 switchport native vlan ${svlan}
 switchport qinq internal
 no switchport storm-control broadcast
 no switchport storm-control multicast
 no switchport storm-control dlf
!
no remote-devices enable
remote-devices enable ethernet range 1/1 1/4
!
ip default-gateway ${wanIp1}.${wanIp2}.${wanIp3}.${wanIp4}
!
ip telnet server
ip http server
no ip http secure-server
no ip ssh server
!
ip snmp-server
ip snmp-server community public ro
!
spanning-tree 1
spanning-tree 1 vlan-group 1
!
sync-source hierarchy 1 transmit-clock-source internal
sync-source hierarchy 1 enable
!
interface bundle range 1/2 1/8
 tdm-channel 1
!`;

    }
    else if (scriptType === 'aligera-ramal') {
        command = `
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
config network ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 2}
config network ip netmask 255.255.255.248
config network ip defaultgw ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4 + 1}
config network hostname ${name}-OS-${ord}
config network mtu 1400
config network dns 
    
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
config sip peer trunk1 send_pai no
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
config sip peer vivo1 send_pai no
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
config dialplan rule sip_trunk1_default outgoing_callerid {:3}
config dialplan rule sip_trunk1_default answer_timeout 90
config dialplan rule sip_trunk1_default sip_pas_info_sc yes
config dialplan rule sip_trunk2_default source_peer tdm group1
config dialplan rule sip_trunk2_default called_pattern X.
config dialplan rule sip_trunk2_default callerid_pattern 
config dialplan rule sip_trunk2_default outgoing_called {}
config dialplan rule sip_trunk2_default outgoing_callerid {:1}
config dialplan rule sip_trunk2_default answer_timeout 90
config dialplan rule sip_trunk3_default source_peer tdm group1
config dialplan rule sip_trunk3_default called_pattern X.
config dialplan rule sip_trunk3_default callerid_pattern 
config dialplan rule sip_trunk3_default outgoing_called {}
config dialplan rule sip_trunk3_default outgoing_callerid {:1}
config dialplan rule sip_trunk3_default answer_timeout 90
config save
config apply
    
config login user vivo password vivo
    
config save
config apply
        `;
    } else if (scriptType === 'gt6gt4') {
        // Captura os endereços IP para GT6 GT4
        const newLanIp4 = parseInt(document.getElementById('lan-ip4').value);
        const newLanMask = document.getElementById('lan-mask').value;
        const newWanIp4 = parseInt(document.getElementById('wan-ip4').value);
        const newWanMask = document.getElementById('wan-mask').value;

        // Monta o comando para GT6 GT4
        command = `
delete interfaces ethernet eth1

set interfaces ethernet eth1 description WAN_VIVO

set interfaces ethernet eth1 duplex auto

set interfaces ethernet eth1 speed auto

set interfaces ethernet eth1 vif ${svlan} address ${wanIp1}.${wanIp2}.${wanIp3}.${newWanIp4+1}/${newWanMask}

set interfaces ethernet eth2 address ${lanIp1}.${lanIp2}.${lanIp3}.${newLanIp4+1}/${newLanMask}

set interfaces ethernet eth2 description LAN_CLIENTE

set interfaces ethernet eth2 duplex auto

set interfaces ethernet eth2 speed auto

set protocols memory-limit 100

set protocols static route 0.0.0.0/0 next-hop ${wanIp1}.${wanIp2}.${wanIp3}.${newWanIp4}

set system host-name ${ord}_

set system login user operador authentication plaintext-password cgedc

commit

save
        `;
    }

    document.getElementById('output').textContent = command.trim();
    document.getElementById('copy-command').style.display = 'block'; // Mostra o botão de copiar
});
