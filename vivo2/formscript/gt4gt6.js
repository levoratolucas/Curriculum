



function generateScriptGt4Gt6Sip(svlan, wanMac, wanRoute, lan, desig,lanmask,wanMask) {
    return `
delete interfaces ethernet eth1

set interfaces ethernet eth1 description WAN_VIVO

set interfaces ethernet eth1 duplex auto

set interfaces ethernet eth1 speed auto

set interfaces ethernet eth1 vif ${svlan} address ${wanMac}/${wanMask}

set interfaces ethernet eth2 address ${lan}/${lanmask}

set interfaces ethernet eth2 description LAN_CLIENTE

set interfaces ethernet eth2 duplex auto

set interfaces ethernet eth2 speed auto

set protocols memory-limit 100

set protocols static route 0.0.0.0/0 next-hop ${wanRoute}

set system host-name ${desig}_


commit

save
        `
};



function generateGt4Gt6Sip() {
    const lanInfo = infosIpsLan();
    const wanInfo = infosIpsWan();
    const vlan = infosIpsVlan();
    const desig = infosIpsDesig();

    if (!lanInfo || !wanInfo || !vlan || desig === null) {
        return;
    }

    let { lanIp1, lanIp2, lanIp3, lanIp4, lanmask } = lanInfo;
    let { wanIp1, wanIp2, wanIp3, wanIp4, wanMask } = wanInfo;

    let wan = generateIpMacRoute(wanIp1, wanIp2, wanIp3, wanIp4, wanMask);
    let lan = generateIpMacRoute(lanIp1, lanIp2, lanIp3, lanIp4, lanmask);

    const output = generateScriptGt4Gt6Sip(vlan, wan[0], wan[1], lan[1], desig,lanmask,wanMask);

    document.getElementById("output").innerText = output;

    // Mostrar o botão de copiar
    document.getElementById("copyButton").style.display = "inline-block";
}