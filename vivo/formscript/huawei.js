



function generateScriptHuaweiSip(svlan, wanMac, wanRoute, lan, desig,wanmask,lanmask) {
    return `
system-view

sysname TEL_${desig}_

interface gi0/0/4.${svlan}

dot1q termination vid ${svlan}

description WAN VIVO

ip address ${wanMac} ${wanmask}

quit 

save

y

ip route-static 0.0.0.0 0.0.0.0 ${wanRoute}

save

y

interface gi0/0/0

undo portswitch 

description LAN

ip address ${lan} ${lanmask}

quit

save

y

    
    
    
        `
};



function generateHuaweiSip() {
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

    const output = generateScriptHuaweiSip(vlan, wan[0], wan[1], lan[1], desig,wanMask,lanmask);

    document.getElementById("output").innerText = output;

    // Mostrar o botão de copiar
    document.getElementById("copyButton").style.display = "inline-block";
}