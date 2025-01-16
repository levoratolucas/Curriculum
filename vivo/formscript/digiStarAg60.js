function generateAccountCommandDigiStarAg60(number, accountNumber) {
    return `account ${accountNumber}\n` +
      `    user ${number}\n` +
      `    auth-user ${number}\n` +
      `    display-name ${number}\n` +
      `    contact ${number}\n` +
      `    no restricted-id\n` +
      `    allow-simult\n` +
      `    server 1\n  !\n`;
  }
  
  function generateRedirectionCommandDigiStarAg60(number, position, quantity) {
    const truncatedNumber = number.toString().slice(-quantity);
    return `redirection input e1 groups 0 from ${truncatedNumber} to * output voip-operator groups 0 from ${number} to {To}`;
  }
  
  function generateDigiStarAg60() {
    const inputText = document.getElementById("inputText").value.trim();
    const quantity = parseInt(document.getElementById("quantitySelect").value, 10);
    const lines = inputText.split("\n");
    const processedNumbers = new Set();
    const piloto = document.getElementById('piloto-form').value
    if(!piloto){
      alert("Faltou piloto")
      return
    }
    let accounts = generateAccountCommandDigiStarAg60(piloto, 1);
    let redirections = '';
    let accountNumber = 2;
    let position = 0;
  
    lines.forEach(line => {
      const number = extractNumbersFromLine(line);
      if (number.length >= 9 && !processedNumbers.has(number)) {
        processedNumbers.add(number);
        if (number !== piloto) {
          accounts += generateAccountCommandDigiStarAg60(number, accountNumber);
          accountNumber++;
        }
        redirections += generateRedirectionCommandDigiStarAg60(number, position, quantity) + '\n';
        position++;
      }
    });
    let lanInfo = infosIpsLan();
    let { lanIp1, lanIp2, lanIp3, lanIp4, lanmask } = lanInfo;
    
    let lan = generateIpMacRoute(lanIp1, lanIp2, lanIp3, lanIp4, lanmask);
    let scriptPiloto = `\nredirection input e1 groups 0 from * to * output voip-operator groups 0 from ${piloto} to {To}`;
    const endred = `redirection input voip-operator groups 0 from * to * output e1 groups 0 from {From:3} to {To:-4}\n\n`;
    const script = `digistar
  
  enable
  
  configure terminal
  
  debug sip loglevel 5
  
  debug pbx loglevel 5
  
  logging on 
  
  interface ethernet 1
  
  ip address ${lan[0]} 255.255.255.248 
  
  exit
  
  ip route static inter-vrf 
  
  ip route 0.0.0.0/0 ${lan[1]}  
  
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

