
const firebaseConfig = {
    apiKey:"AIzaSyBfUEiZunm55dMkLJDJv9-2mTL0z8bf9uA",
  authDomain: "radar-do-preco.firebaseapp.com",
  projectId: "radar-do-preco",
  storageBucket: "radar-do-preco.firebasestorage.app",
  messagingSenderId: "424082578630",,
    authDomain: "radar-do-preco.firebaseapp.com",
    projectId: "radar-do-preco",
    storageBucket: "radar-do-preco.firebasestorage.app",
    messagingSenderId: "424082578630",
    appId: "1:424082578630:web:44eb717b1d097d4cef0bc7"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fetchData() {
    const snapshot = await db.collection("preco").get();
    const postos = {};

    snapshot.forEach((doc) => {
        const item = doc.data();
        const nome = item.Estabelecimento || "Estabelecimento sem nome";
        const produto = String(item.Produto || "").toLowerCase();
        const preco = Number(item["Preço"]);

        if (!postos[nome]) {
            postos[nome] = {
                nome: nome,
                cidade: item.Cidade || "Araguaína",
                bandeira: item.Bandeira || "",
                endereco: item.Endereco || item.endereco || "",
                maps: item.Maps || item.maps || "",
                horario: item.Horario || item.horario || "",
                gasolina: null,
                etanol: null
            };
        }

        if (Number.isFinite(preco) && preco > 0) {
            if (produto.includes("gasolina")) {
                postos[nome].gasolina = preco;
            } else if (
                produto.includes("etanol") ||
                produto.includes("álcool") ||
                produto.includes("alcool")
            ) {
                postos[nome].etanol = preco;
            }
        }
    });

    return Object.values(postos);
}

async function render() {
    const list = document.getElementById("list");
    list.innerHTML = "Carregando preços...";

    try {
        const data = await fetchData();

        data.sort((a, b) =>
            (a.gasolina ?? Infinity) - (b.gasolina ?? Infinity)
        );

        list.innerHTML = "";

        if (data.length === 0) {
            list.textContent = "Nenhum preço cadastrado ainda.";
            return;
        }

        const precosGasolina = data
            .map(p => p.gasolina)
            .filter(p => p !== null);

        const menorGasolina = precosGasolina.length
            ? Math.min(...precosGasolina)
            : null;

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "card";

            const destaque =
                item.gasolina !== null &&
                item.gasolina === menorGasolina;

            if (destaque) div.classList.add("cheapest");

            let recomendacao = "Cadastre os dois preços para comparar.";

            if (item.gasolina !== null && item.etanol !== null) {
                recomendacao =
                    item.etanol / item.gasolina <= 0.70
                    ? "🌱 Etanol pode compensar mais"
                    : "⛽ Gasolina pode compensar mais";
            }

            const dinheiro = valor =>
                valor === null
                ? "Não informado"
                : "R$ " + valor.toFixed(2).replace(".", ",");

            div.innerHTML = `
                ${destaque
                    ? '<div class="badge-price">MENOR PREÇO DA GASOLINA</div>'
                    : ""}

                <h3></h3>
                <p>⛽ Bandeira: </p>

                <div class="precos-combustivel">
                    <div class="preco-item">
                        <span>GASOLINA</span>
                        <strong>${dinheiro(item.gasolina)}</strong>
                    </div>
                    <div class="preco-item">
                        <span>ETANOL</span>
                        <strong>${dinheiro(item.etanol)}</strong>
                    </div>
                </div>

                <div class="recomendacao-combustivel">
                    ${recomendacao}
                    <small>Estimativa pela regra dos 70%. O resultado real depende do consumo do veículo.</small>
                </div>

                <p class="endereco-posto"></p>
                <p class="horario-posto"></p>
            `;

            div.querySelector("h3").textContent = item.nome;
            div.querySelector("p").textContent =
                "⛽ Bandeira: " + (item.bandeira || "Não informada");

            const paragrafos = div.querySelectorAll("p");
            paragrafos[1].textContent =
                item.endereco ? "📍 " + item.endereco : "";

            paragrafos[2].textContent =
                item.horario ? "⏰ " + item.horario : "";

            if (item.maps) {
                const link = document.createElement("a");
                link.href = item.maps;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.textContent = "📍 Como chegar";
                div.appendChild(link);
            }

            list.appendChild(div);
        });

    } catch (erro) {
        console.error("Erro ao carregar preços do Firebase:", erro);
        list.textContent =
            "Não foi possível carregar os preços. Verifique a conexão com o Firebase e as regras de acesso.";
    }
}

render();
