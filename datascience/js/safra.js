const titulo = "Tabela de Safras por Grupo 4";
        const dataString = `
            safra,detrator,neutro,promotor
            2022,187 (5.71%),645 (19.69%),2444 (74.6%)
            2023,141 (5.33%),460 (17.39%),2044 (77.28%)
            2024,91 (6.33%),254 (17.68%),1092 (75.99%)
        `.trim();

        // Atualizar o título da tabela
        document.getElementById('tituloTabela').textContent = titulo;

        // Dividir a string em linhas e colunas
        const lines = dataString.split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => line.split(','));

        // Selecionar a tabela
        const table = document.getElementById('tabelaSafra');

        // Criar o cabeçalho da tabela
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header.trim();
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Criar o corpo da tabela
        const tbody = document.createElement('tbody');
        rows.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell.trim();
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);