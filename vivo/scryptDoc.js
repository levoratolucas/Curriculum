// scryptDoc.js - versão atualizada
// - Garante apenas 1 card aberto por vez
// - Suporta "steps": [] e fallback para "descript"
// - Usa símbolo "+" (fechado) e "–" (aberto) antes do nome

async function fetchActivities() {
    try {
        const res = await fetch('./doc.json', { cache: "no-store" });
        if (!res.ok) throw new Error('Resposta não OK: ' + res.status);
        const groups = await res.json();
        renderGroups(groups);
    } catch (err) {
        console.error('Erro ao carregar atividades:', err);
        document.getElementById('no-data').style.display = 'block';
    }
}

const lista = document.getElementById('lista');
const noData = document.getElementById('no-data');

// guarda o card/desc/symbol atualmente aberto
let currentOpen = null;

function closeCurrentOpen() {
    if (!currentOpen) return;
    currentOpen.desc.classList.remove('open');
    currentOpen.card.setAttribute('aria-expanded', 'false');
    if (currentOpen.symbol) currentOpen.symbol.textContent = '+';
    currentOpen = null;
}

function renderGroups(groups) {
    lista.innerHTML = '';

    if (!Array.isArray(groups) || groups.length === 0) {
        noData.style.display = 'block';
        return;
    }

    noData.style.display = 'none';

    groups.forEach((group, gidx) => {
        const typeTitle = document.createElement('h3');
        typeTitle.className = 'group-title';
        typeTitle.textContent = group.type || 'Sem tipo';
        typeTitle.style.marginTop = gidx === 0 ? '0' : '18px';
        typeTitle.style.marginBottom = '10px';
        typeTitle.style.color = '#222';
        typeTitle.style.fontSize = '1.05rem';

        const groupContainer = document.createElement('div');
        groupContainer.className = 'group-container';

        const items = Array.isArray(group.items) ? group.items : [];

        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'no-data-doc';
            empty.textContent = 'Nenhuma atividade neste grupo.';
            groupContainer.appendChild(empty);
        } else {
            items.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'card';
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', 0);
                card.setAttribute('aria-expanded', 'false');

                // Cabeçalho com o símbolo + e o nome (símbolo antes do texto)
                const head = document.createElement('div');
                head.className = 'head';

                const symbol = document.createElement('span');
                symbol.className = 'symbol';
                symbol.textContent = '+';
                symbol.style.marginRight = '8px';
                symbol.style.fontWeight = '700';
                symbol.setAttribute('aria-hidden', 'true');

                const type = document.createElement('span');
                type.className = 'type';
                type.textContent = item.name || item.type || 'Sem nome';

                head.appendChild(symbol);
                head.appendChild(type);

                const desc = document.createElement('div');
                desc.className = 'desc';

                // Renderiza steps se existir; caso contrário usa descript (com \n -> <br>)
                if (Array.isArray(item.descript)) {
                    const ol = document.createElement('ol');
                    ol.style.paddingLeft = '1.2em';
                    item.descript.forEach(step => {
                        const li = document.createElement('li');
                        li.textContent = step;
                        li.style.marginBottom = '6px';
                        ol.appendChild(li);
                    });
                    desc.appendChild(ol);
                } else {
                    // fallback: descript (pode conter quebras \n)
                    const text = item.descript || item.description || 'Sem descrição.';
                    // escapar HTML básico por segurança mínima
                    const escaped = text
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    // converter \n em <br>
                    const html = escaped.replace(/\n/g, '<br>');
                    desc.innerHTML = `<div class="descr-text">${html}</div>`;
                }

                card.appendChild(head);
                card.appendChild(desc);

                // Toggle que garante apenas 1 aberto por vez
                function toggle() {
                    const isOpen = desc.classList.contains('open');
                    if (isOpen) {
                        // se já aberto, fecha
                        desc.classList.remove('open');
                        card.setAttribute('aria-expanded', 'false');
                        symbol.textContent = '+';
                        if (currentOpen && currentOpen.card === card) currentOpen = null;
                        return;
                    }

                    // se abrir novo, fecha o atual
                    if (currentOpen && currentOpen.card !== card) {
                        closeCurrentOpen();
                    }

                    // abre este
                    desc.classList.add('open');
                    card.setAttribute('aria-expanded', 'true');
                    symbol.textContent = '–';
                    currentOpen = { card, desc, symbol };
                    // rolar para conteúdo (opcional)
                    setTimeout(() => { desc.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 120);
                }

                card.addEventListener('click', (e) => {
                    // evitar que cliques em links internos dentro de desc sejam interrompidos
                    if (e.target.tagName.toLowerCase() === 'a') return;
                    toggle();
                });

                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
                });

                groupContainer.appendChild(card);
            });
        }

        lista.appendChild(typeTitle);
        lista.appendChild(groupContainer);
    });
}

// Expor funções úteis para debug
window.__levoratech = {
    fetchActivities,
    renderGroups,
    closeCurrentOpen
};

// inicial
fetchActivities();
