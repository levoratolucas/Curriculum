function loadContent(type) {
    const workspace = document.getElementById("workspace");

    switch (type) {
        case "R2":
            workspace.innerHTML = `
                <div class="formulario">
                    <h2>CONVERSOR E1<--${type}-->SIP</h2>
                    
                    <label>TELEFONECOM 41:</label>
                    <input type="number" id="PILOTO" placeholder="4130100250">
                    
                    <button onclick="gerarComando('${type}')">Gerar</button>
                </div>

                <div class="terminal">
                    <pre id="output"></pre>
                </div>
            `;
            break;
        case "ISDN":
            workspace.innerHTML = `
                <div class="formulario">
                    <h2>CONVERSOR E1<--${type}-->SIP</h2>
                    
                    <label>TELEFONECOM 41:</label>
                    <input type="number" id="PILOTO" placeholder="4130100250">
                    
                    <button onclick="gerarComando('${type}')">Gerar</button>
                </div>

                <div class="terminal">
                    <pre id="output"></pre>
                </div>
            `;
            break;

        default:
            workspace.innerHTML = `<p>Tipo não encontrado</p>`;
            break;
    }
}

function gerarComando(type) {
    const piloto = document.getElementById("PILOTO").value;
    const output = document.getElementById("output");

    if (!piloto) {
        output.textContent = "Digite um número válido!";
        return;
    }

    switch (type) {
        case "ISDN":
            output.textContent = gerarScriptISDN(piloto);
            break;

        case "R2":
            output.textContent = gerarScriptR2(piloto);
            break;

        default:
            output.textContent = "Tipo inválido";
            break;
    }
}

function gerarScriptISDN(piloto) {
    return `
config sip peer ${piloto} register no
config sip peer ${piloto} username ${piloto}
config sip peer ${piloto} secret 123
config sip peer ${piloto} host dynamic
config sip peer ${piloto} port 5060
config sip peer ${piloto} dtmfmode rfc2833
config sip peer ${piloto} t38 yes
config sip peer ${piloto} codecs alaw
config sip peer ${piloto} options_keepalive no
config sip peer ${piloto} send_pai no
config sip peer ${piloto} nat no

config dialplan rule ${piloto} source_peer sip ${piloto}
config dialplan rule ${piloto} destination_peer tdm group1
config dialplan rule ${piloto} failover_peer disabled
config dialplan rule ${piloto} called_pattern X.
config dialplan rule ${piloto} callerid_pattern 
config dialplan rule ${piloto} outgoing_called {}
config dialplan rule ${piloto} outgoing_callerid {}
config dialplan rule ${piloto} answer_timeout 90

config sip peer trunk2 register no
config sip peer trunk2 username user
config sip peer trunk2 secret pass
config sip peer trunk2 host 192.168.1.12
config sip peer trunk2 port 5060
config sip peer trunk2 dtmfmode rfc2833
config sip peer trunk2 t38 yes
config sip peer trunk2 codecs alaw
config sip peer trunk2 options_keepalive no
config sip peer trunk2 send_pai no
config sip peer trunk2 nat no

config dialplan rule ${piloto}_IN source_peer tdm group1
config dialplan rule ${piloto}_IN destination_peer sip trunk2
config dialplan rule ${piloto}_IN failover_peer disabled
config dialplan rule ${piloto}_IN called_pattern ${piloto}
config dialplan rule ${piloto}_IN callerid_pattern 
config dialplan rule ${piloto}_IN outgoing_called {}
config dialplan rule ${piloto}_IN outgoing_callerid {}
config dialplan rule ${piloto}_IN answer_timeout 90

config tdm port1 crc disable
config tdm port1 clock 0
config tdm port1 signalling mfcr2
config tdm port1 timeslots 1-15,17-31
config tdm port1 hunt_policy round_up
config tdm port1 mfcr2 variant br
config tdm port1 mfcr2 max_ani 20
config tdm port1 mfcr2 max_dnis 20
config tdm port1 mfcr2 get_ani_first no
config tdm port1 mfcr2 allow_collect_calls yes
config tdm port1 mfcr2 double_answer no
config tdm port1 mfcr2 reanswer_timeout 5000
config tdm port1 mfcr2 mfback_timeout 5000
config tdm port1 mfcr2 accept_on_offer no
config tdm port1 mfcr2 tone_amp 80
`;
}

function gerarScriptR2(piloto) {
    return `
config sip peer ${piloto} register no
config sip peer ${piloto} username ${piloto}
config sip peer ${piloto} secret 123
config sip peer ${piloto} host dynamic
config sip peer ${piloto} port 5060
config sip peer ${piloto} dtmfmode rfc2833
config sip peer ${piloto} t38 yes
config sip peer ${piloto} codecs alaw
config sip peer ${piloto} options_keepalive no
config sip peer ${piloto} send_pai no
config sip peer ${piloto} nat no

config dialplan rule ${piloto} source_peer sip ${piloto}
config dialplan rule ${piloto} destination_peer tdm group1
config dialplan rule ${piloto} failover_peer disabled
config dialplan rule ${piloto} called_pattern X.
config dialplan rule ${piloto} callerid_pattern 
config dialplan rule ${piloto} outgoing_called {}
config dialplan rule ${piloto} outgoing_callerid {}
config dialplan rule ${piloto} answer_timeout 90

config sip peer trunk2 register no
config sip peer trunk2 username user
config sip peer trunk2 secret pass
config sip peer trunk2 host 192.168.1.12
config sip peer trunk2 port 5060
config sip peer trunk2 dtmfmode rfc2833
config sip peer trunk2 t38 yes
config sip peer trunk2 codecs alaw
config sip peer trunk2 options_keepalive no
config sip peer trunk2 send_pai no
config sip peer trunk2 nat no

config dialplan rule ${piloto}_IN source_peer tdm group1
config dialplan rule ${piloto}_IN destination_peer sip trunk2
config dialplan rule ${piloto}_IN failover_peer disabled
config dialplan rule ${piloto}_IN called_pattern ${piloto}
config dialplan rule ${piloto}_IN callerid_pattern 
config dialplan rule ${piloto}_IN outgoing_called {}
config dialplan rule ${piloto}_IN outgoing_callerid {}
config dialplan rule ${piloto}_IN answer_timeout 90
`;
}