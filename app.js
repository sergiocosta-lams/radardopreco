window.onload = function(){

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQPgvZ0cXCg26_S-P3DzugU3e8AbdfDeEh-Q6FQDV66skoz_reYeTcrWuYYMUh2kFQmllE5ogovu2O/pub?output=csv";

async function fetchData() {
    const res = await fetch(sheetURL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    return {
    nome: cols[0],
    bandeira: cols[1],
    endereco: cols[2],
    maps: cols[3],
    gasolina: parseFloat(cols[4]),
    etanol: parseFloat(cols[5]),
    horario: cols[6]
};

alert(cols);

        console.log(cols);

        return {
            nome: cols[0],
            endereco: cols[1],
            gasolina: parseFloat(cols[2]),
            etanol: parseFloat(cols[3]),
            horario: cols[4]
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

    let minPrice = Math.min(...filtered.map(item => item.gasolina));

    list.innerHTML = "";

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        if(item.gasolina === minPrice){
            div.classList.add("cheapest");
        }

        div.innerHTML = `
            <h3>${item.nome}</h3>
            <p>⛽ Gasolina: R$ ${item.gasolina}</p>
<p>🌱 Etanol: R$ ${item.etanol}</p>
<p>⏰ ${item.horario}</p>
<p>📍 ${item.endereco}</p>
        `;

        list.appendChild(div);
    });
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("filter").addEventListener("change", render);

render();
}   
