window.onload = function(){
alert("app.js carregou");
}
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQPgvZ0cXCg26_S-P3DzugU3e8AbdfDeEh-Q6FQDV66skoz_reYeTcrWuYYMUh2kFQmllE5ogovu2O/pub?output=csv";

async function fetchData() {
    const res = await fetch(sheetURL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    return rows.map(row => {
        const cols = row.split(",");
        return {
            nome: cols[0],
            categoria: cols[1],
            preco: parseFloat(cols[2]),
            horario: cols[3],
            contato: cols[4]
        };
    });
}

async function render() {
    const list = document.getElementById("list");
    list.innerHTML = "Carregando...";

    const data = await fetchData();

    const search = document.getElementById("search").value.toLowerCase();
    const filter = document.getElementById("filter").value;

    let filtered = data.filter(item =>
        item.nome?.toLowerCase().includes(search) &&
        (filter === "all" || item.categoria === filter)
    );

    let minPrice = Math.min(...filtered.map(item => item.preco));

    list.innerHTML = "";

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        if(item.preco === minPrice){
            div.classList.add("cheapest");
        }

        div.innerHTML = `
            <h3>${item.nome}</h3>
            <p class="price">R$ ${item.preco?.toFixed(2)}</p>
            <p>⏰ ${item.horario}</p>
            <a href="https://wa.me/${item.contato}" target="_blank">
                <button>Contato</button>
            </a>
        `;

        list.appendChild(div);
    });
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("filter").addEventListener("change", render);

render();
