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
  
  function generate() {
    const inputText = document.getElementById("inputText").value.trim();
    const quantity = parseInt(document.getElementById("quantitySelect").value, 10);
    const lines = inputText.split("\n");
    const processedNumbers = new Set();
    let accounts = '';
    let redirections = '';
    let accountNumber = 1;
    let position = 0;
  
    lines.forEach(line => {
      const number = extractNumbersFromLine(line);
      if (number.length >= 9 && !processedNumbers.has(number)) {
        processedNumbers.add(number);
        accounts += generateAccountCommand(number, accountNumber);
        redirections += generateRedirectionCommand(number, position, quantity) + '\n';
        accountNumber++;
        position++;
      }
    });

    const lanIp1 = parseInt(document.getElementById('lan-ip1').value);
    const lanIp2 = parseInt(document.getElementById('lan-ip2').value);
    const lanIp3 = parseInt(document.getElementById('lan-ip3').value);
    const lanIp4 = parseInt(document.getElementById('lan-ip4').value);
    const piloto = document.getElementById('piloto-form').value
    let scriptPiloto = `\nredirection input e1 groups 0 from * to * output voip-operator groups 0 from ${piloto} to {To}`;
    const scriptType = document.querySelector('input[name="script-type"]:checked').value;
    if(scriptType === 'ramal'){
        scriptPiloto=''
    }
    const endred =  `redirection input voip-operator groups 0 from * to * output e1 groups 0 from {From} to {To}` + scriptPiloto + '\n\n';
    const script = `digistar

enable

configure terminal

debug sip loglevel 5

debug pbx loglevel 5

logging on 

interface ethernet 1

ip address ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4+2} 255.255.255.248 

exit

ip route static inter-vrf 

ip route 0.0.0.0/0 ${lanIp1}.${lanIp2}.${lanIp3}.${lanIp4+1}  

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
    const output = script + accounts + '\nexit\n\npbx\n\n' + redirections + endred;
    document.getElementById("output").innerText = output;
    
    // Mostrar o botão de copiar
    document.getElementById("copyButton").style.display = "inline-block";
  }
  
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
  document.addEventListener("DOMContentLoaded", function() {
    // Função para atualizar a visibilidade do campo piloto
    function updateVisibility() {
      const scriptType = document.querySelector('input[name="script-type"]:checked').value;
      const pilotoForm = document.getElementById("piloto-form");
      const inputText = document.getElementById("inputText");
      const quantitySelect = document.getElementById("sinaliza");
  
      if (scriptType === 'ramal') {
        pilotoForm.style.display = 'none';
        inputText.style.display = 'block';
        quantitySelect.style.display = 'block';
      } else {
        inputText.style.display = 'none';
        quantitySelect.style.display = 'none';
        pilotoForm.style.display = 'block';
      }
    }
  
    // Adiciona evento change aos botões de rádio
    const radioButtons = document.querySelectorAll('input[name="script-type"]');
    radioButtons.forEach(function(radio) {
      radio.addEventListener('change', updateVisibility);
    });
  
    // Chama a função uma vez para definir o estado inicial correto
    updateVisibility();
  });
  