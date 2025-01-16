function loadForm() {
  const equipmentSelect = document.getElementById('equipmentSelect');
  const formContainer = document.getElementById('formContainer');
  const selectedForm ="./form/" + equipmentSelect.value;

  if (selectedForm) {
    fetch(selectedForm)
      .then(response => response.text())
      .then(data => {
        formContainer.innerHTML = data;
      })
      .catch(error => {
        console.error('Erro ao carregar o formulário:', error);
      });
  } else {
    formContainer.innerHTML = '';
  }
}

function extractNumbersFromLine(line) {
  const numbers = line.match(/\d+/g);
  if (numbers) {
    const concatenatedNumbers = numbers.join('');
    return concatenatedNumbers.substring(0, 10); // Retorna apenas os primeiros 10 números
  }
  return '';
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

function generateIpMacRoute(ip1, ip2, ip3, ip4, mask) {

  if (mask == 31) {
      ip4 = ip4 - 1
  }
  ip4Mac = ip4 + 2;
  ip4Gtw = ip4 + 1;
  return [ip1 + "." + ip2 + "." + ip3 + "." + ip4Mac , ip1 + "." + ip2 + "." + ip3 + "." + ip4Gtw ]
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

function infosIpsWan() {
  let wanIp1 = parseInt(document.getElementById('wan-ip1').value);
  let wanIp2 = parseInt(document.getElementById('wan-ip2').value);
  let wanIp3 = parseInt(document.getElementById('wan-ip3').value);
  let wanIp4 = parseInt(document.getElementById('wan-ip4').value);
  let wanMask = parseInt(document.getElementById('wan-mask').value);

  if (isNaN(wanIp1) || isNaN(wanIp2) || isNaN(wanIp3) || isNaN(wanIp4) || isNaN(wanMask)) {
      alert("Faltou informações no endereço IP ou máscara WAN");
      return null;
  }

  return { wanIp1, wanIp2, wanIp3, wanIp4, wanMask };
}

function infosIpsVlan() {
  let vlan = document.getElementById('vlan').value.trim();
  if (!vlan) {
      alert("Faltou informações no campo VLAN");
      return null;
  }
  return vlan;
}
function infosCanais() {
  let canais = document.getElementById('channel-1').value;
  if (!canais) {
      alert("Faltou informações no campo Canais");
      return null;
  }
  return canais;
}

function infosIpsDesig() {
  let desig = document.getElementById('desig').value;
  if (!desig) {
      alert("Faltou informações no campo de designação");
      return null;
  }
  return desig;
}