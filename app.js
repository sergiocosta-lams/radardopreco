import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

async function carregarPrecos(){

    const lista = document.getElementById("lista");

    lista.innerHTML = "Carregando dados...";

    try{

        const consulta = await getDocs(collection(db,"preco"));
console.log(consulta.size);
        if(consulta.empty){
            lista.innerHTML = "Nenhum preço cadastrado.";
            return;
        }

        lista.innerHTML = "";

        consulta.forEach((doc)=>{

            const dados = doc.data();

            lista.innerHTML += `
                <div class="card">
                    <h2>${dados.Produto}</h2>

<p class="preco">
    R$ ${Number(dados.Preço).toFixed(2)}
</p>

                    <p>
                        ${dados.Estabelecimento}
                    </p>

                </div>
            `;

        });

    }catch(erro){

        console.error(erro);

        lista.innerHTML = "Erro ao conectar ao Firebase.";

    }

}

carregarPrecos();
