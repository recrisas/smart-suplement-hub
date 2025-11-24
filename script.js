const cardsContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("#campo-busca");
let dados = [];

// Função para carregar os dados do JSON uma única vez
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados); // Exibe todos os cards inicialmente
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

// Função auxiliar para remover acentos e converter para minúsculas
function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function iniciarBusca() {
    const termoBusca = normalizarTexto(campoBusca.value);

    const resultados = dados.filter(suplemento => {
        // Normaliza os dados do suplemento para a comparação
        const nome = normalizarTexto(suplemento.nome);
        const descricao = normalizarTexto(suplemento.descricao);
        const tags = suplemento.tags ? normalizarTexto(suplemento.tags.join(" ")) : "";
        return nome.includes(termoBusca) || descricao.includes(termoBusca) || tags.includes(termoBusca);
    });

    renderizarCards(resultados);
}

function renderizarCards(suplementos) {
    cardsContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar os novos

    for (const suplemento of suplementos) {
        const article = document.createElement("article");
        article.classList.add("card");
// 1. Cria o HTML das tags (se elas existirem)
        // O map percorre cada tag e cria um <span> para ela
        const tagsHTML = suplemento.tags 
            ? suplemento.tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
            : '';

        // 2. Injeta o HTML (adicionei a div 'tags-container')
        article.innerHTML = `
            <h2>${suplemento.nome}</h2>
            <div class="tags-container">${tagsHTML}</div>
            <p><strong>Descoberto em:</strong> ${suplemento.ano}</p>
            <p>${suplemento.descricao}</p>
            <a href="${suplemento.link}" target="_blank">Saiba Mais</a>
        `;
        cardsContainer.appendChild(article);
    }
}

// Carrega os dados assim que o script é executado
carregarDados();