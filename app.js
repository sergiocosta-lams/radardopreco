window.onload = async function(){

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRQPgvZ0cXCg26_S-P3DzugU3e8AbdfDeEh-Q6FQDV66skoz_reYeTcrWuYYMUh2kFQmllE5ogovu2O/pub?output=csv";


async function fetchData(){

    const res = await fetch(sheetURL);
    const text = await res.text();

    const rows = text.split("\n").slice(1);

    return rows.map(row => {

        const cols = row.split(",");

        return {
            nome: cols[0],
            bandeira: cols[1],
            endereco: cols[2],
            maps: cols[3],
            gasolina: Number(cols[4]),
            etanol: Number(cols[5]),
            horario: cols[6]
        };

    });
}


async function render(){

    const list = document.getElementById("list");

    list.innerHTML = "Carregando...";


    const data = await fetchData();


    list.innerHTML = "";


    data.sort((a, b) => a.gasolina - b.gasolina);


data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    const menorGasolina = item.gasolina === Math.min(...data.map(p => p.gasolina));

    if (menorGasolina) {
        div.classList.add("cheapest");
    }

    const proporcao = item.etanol / item.gasolina;
    let recomendacao = "";

    if (proporcao <= 0.70) {
        recomendacao = "🌱 Etanol pode compensar mais";
    } else {
        recomendacao = "⛽ Gasolina pode compensar mais";
    }

    div.innerHTML = `
        ${menorGasolina ? '<div class="badge-price">MENOR PREÇO DA GASOLINA</div>' : ''}

        <h3>${item.nome}</h3>
        <p>⛽ Bandeira: ${item.bandeira}</p>

        <div class="precos-combustivel">
            <div class="preco-item">
                <span>GASOLINA</span>
                <strong>R$ ${Number(item.gasolina).toFixed(2).replace(".", ",")}</strong>
            </div>

            <div class="preco-item">
                <span>ETANOL</span>
                <strong>R$ ${Number(item.etanol).toFixed(2).replace(".", ",")}</strong>
            </div>
        </div>

        <div class="recomendacao-combustivel">
            ${recomendacao}
            <small>Estimativa pela regra dos 70%. O resultado real depende do consumo do veículo.</small>
        </div>

        <p>⏰ ${item.horario}</p>
        <p>📍 ${item.endereco}</p>
        <a href="${item.maps}" target="_blank" rel="noopener noreferrer">📍 Como chegar</a>
    `;

    list.appendChild(div);
});

}


render();


};
