function generateAligeraDesvios() {
  const inputText = document.getElementById("inputText").value.trim();
  const lines = inputText.split("\n");
  const processedNumbers = new Array();
  const piloto = document.getElementById('piloto').value
  console.log(piloto)
  if(!piloto){
    alert("Faltou piloto")
    return
  }

  lines.forEach(line => {
    const number = extractNumbersFromLine(line);
    if (number.length >= 9 && !processedNumbers.includes(number)) {
      processedNumbers.push(number);
    }
  });
  
  const scriptDesvios = processedNumbers.map((number,index) => {
    const desvioName = `desvio${index + 1}`;
    return `
config dialplan rule sip_trunk1_${desvioName} source_peer sip vivo1
config dialplan rule sip_trunk1_${desvioName} destination_peer tdm group1
config dialplan rule sip_trunk1_${desvioName} called_pattern ${number}
config dialplan rule sip_trunk1_${desvioName} callerid_pattern 
config dialplan rule sip_trunk1_${desvioName} outgoing_called ${piloto}
config dialplan rule sip_trunk1_${desvioName} outgoing_callerid {:3}
config dialplan rule sip_trunk1_${desvioName} answer_timeout 90
config save
config apply`
  });
  
  const output = scriptDesvios.join('\n');
  document.getElementById("output").innerText = output;

  // Mostrar o botão de copiar
  document.getElementById("copyButton").style.display = "inline-block";
}

