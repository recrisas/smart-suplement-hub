const cardsContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("#campo-busca");
let dados = [];

// DADOS DE EXEMPLO (FALLBACK)
const dadosExemplo = [
    { nome: "Creatina", ano: 1832, descricao: "Aumenta força e explosão muscular.", tags: ["Força", "Energia", "Explosão"] },
    { nome: "Whey Protein", ano: 1990, descricao: "Proteína de rápida absorção.", tags: ["Recuperação", "Hipertrofia", "Proteína"] },
    { nome: "Cafeína", ano: 1819, descricao: "Estimulante do sistema nervoso.", tags: ["Energia", "Foco", "Estimulante"] },
    { nome: "Beta-Alanina", ano: 2000, descricao: "Reduz a fadiga muscular.", tags: ["Resistência", "Fadiga"] }
];

async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        if (!resposta.ok) throw new Error("Erro ao carregar JSON");
        
        dados = await resposta.json();
        
        if (!dados || dados.length === 0) {
            console.warn("JSON vazio. Usando dados de exemplo.");
            dados = dadosExemplo;
        }

        renderizarCards(dados);
        atualizarEstatisticas(dados);
        initChart(dados);
        
    } catch (error) {
        console.error("Erro crítico:", error);
        mostrarToast("Erro ao carregar dados. Usando modo demonstração.", "erro");
        dados = dadosExemplo;
        renderizarCards(dados);
        atualizarEstatisticas(dados);
        initChart(dados);
    }
}

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// --- NOVO: FUNÇÃO PARA LIMPAR FILTROS ---
function resetarFiltros() {
    // Limpa o campo de texto
    const campo = document.getElementById('campo-busca');
    campo.value = "";
    
    // Refaz a busca (vazio = mostra tudo)
    iniciarBusca();
    
    // Feedback e Scroll
    mostrarToast("Mostrando todos os suplementos.", "info");
    document.querySelector('.card-container').scrollIntoView({ behavior: 'smooth' });
}

// --- MODAL DE TAGS ---
function abrirModalTags() {
    const modal = document.getElementById('modal-tags');
    const containerTags = document.getElementById('lista-tags-completa');
    
    const todasTags = dados.flatMap(d => d.tags || []);
    const tagsUnicas = [...new Set(todasTags.map(t => t.trim()))].sort();

    containerTags.innerHTML = '';
    tagsUnicas.forEach(tag => {
        const tagBtn = document.createElement('button');
        tagBtn.className = 'modal-tag';
        const tagBonita = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
        tagBtn.innerText = tagBonita;
        tagBtn.onclick = () => filtrarPorTagModal(tag);
        containerTags.appendChild(tagBtn);
    });

    modal.classList.add('open');
}

function fecharModalTags() {
    document.getElementById('modal-tags').classList.remove('open');
}

function filtrarPorTagModal(tag) {
    fecharModalTags();
    const campo = document.getElementById('campo-busca');
    campo.value = tag;
    iniciarBusca();
    mostrarToast(`Filtrando por: ${tag}`, "sucesso");
    setTimeout(() => {
        document.querySelector('.card-container').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

document.getElementById('modal-tags').addEventListener('click', (e) => {
    if (e.target.id === 'modal-tags') fecharModalTags();
});

// --- ESTATÍSTICAS E GRÁFICO ---
function atualizarEstatisticas(dados) {
    const totalSup = document.getElementById('total-supplements');
    const totalTags = document.getElementById('total-tags');
    
    if(totalSup) totalSup.innerText = dados.length;
    
    const todasTags = dados.flatMap(d => d.tags || []);
    const tagsUnicas = new Set(todasTags.map(t => t.toLowerCase().trim()));
    
    if(totalTags) totalTags.innerText = tagsUnicas.size;
}

function initChart(dados) {
    const canvas = document.getElementById('myChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const tagCounts = {};
    dados.forEach(item => {
        if (item.tags) {
            item.tags.forEach(tag => {
                const cleanTag = tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1).toLowerCase(); 
                tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1;
            });
        }
    });

    const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

    if (sortedTags.length === 0) return;

    const labels = sortedTags.map(item => item[0]);
    const values = sortedTags.map(item => item[1]);

    const existingChart = Chart.getChart("myChart");
    if (existingChart) existingChart.destroy();

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: ['#a3e635', '#38bdf8', '#818cf8', '#f472b6', '#fbbf24', '#34d399'],
                borderColor: '#1e293b',
                borderWidth: 2,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: 20 },
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#94a3b8', font: { family: 'Sawarabi Gothic', size: 12 }, usePointStyle: true, padding: 15 }
                }
            },
            onClick: (evt, elements, chart) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    const label = chart.data.labels[index];
                    filtrarPorTagModal(label); 
                }
            },
            onHover: (event, chartElement) => {
                event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
            }
        }
    });
}

function iniciarBusca() {
    const termoBusca = normalizarTexto(campoBusca.value);
    const resultados = dados.filter(suplemento => {
        const nome = normalizarTexto(suplemento.nome);
        const descricao = normalizarTexto(suplemento.descricao);
        const tags = suplemento.tags ? normalizarTexto(suplemento.tags.join(" ")) : "";
        return nome.includes(termoBusca) || descricao.includes(termoBusca) || tags.includes(termoBusca);
    });
    renderizarCards(resultados);
}

function renderizarCards(suplementos) {
    cardsContainer.innerHTML = "";
    if (!suplementos || suplementos.length === 0) {
        cardsContainer.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-secondary)">Nenhum suplemento encontrado.</p>`;
        return;
    }

    suplementos.forEach((suplemento, i) => {
        const article = document.createElement("article");
        article.classList.add("card");
        article.id = `card-${i}`;
        
        article.onclick = function() { this.classList.toggle('active'); };

        const tagsHTML = suplemento.tags 
            ? suplemento.tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
            : '';

        article.innerHTML = `
            <button class="btn-fav" onclick="event.stopPropagation(); toggleFavorito(this, '${suplemento.nome}')" title="Favoritar">❤</button>
            <h2>${suplemento.nome}</h2>
            <div class="card-content">
                <div class="tags-container">${tagsHTML}</div>
                <p><strong>Descoberto em:</strong> ${suplemento.ano}</p>
                <p>${suplemento.descricao}</p>
                <a href="${suplemento.link || '#'}" target="_blank" class="btn-link" onclick="event.stopPropagation()">Saiba Mais →</a>
            </div>
        `;
        cardsContainer.appendChild(article);
    });
}

function initParticles() {
    const canvas = document.getElementById('neural-bg');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    function createParticles() {
        particles = [];
        const quantity = Math.floor(width * height / 15000);
        for (let i = 0; i < quantity; i++) {
            particles.push({
                x: Math.random() * width, y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }
    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(163, 230, 53, 0.5)';
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        requestAnimationFrame(animate);
    }
    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); animate();
}

function mostrarToast(mensagem, tipo = "info") {
    let container = document.getElementById("toast-container");
    if (!container) {
        container = document.createElement("div");
        container.id = "toast-container";
        document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = mensagem;
    if (tipo === "sucesso") toast.style.borderLeftColor = "#a3e635";
    if (tipo === "erro") toast.style.borderLeftColor = "#ef4444";
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 3000);
}

function descobrirRandom() {
    if (dados.length === 0) return;
    document.querySelectorAll('.highlight-pulse').forEach(el => el.classList.remove('highlight-pulse'));
    const randomIndex = Math.floor(Math.random() * dados.length);
    const cardElement = document.getElementById(`card-${randomIndex}`);
    if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardElement.classList.add('active');
        setTimeout(() => {
            cardElement.classList.add('highlight-pulse');
            mostrarToast(`IA selecionou: ${dados[randomIndex].nome}!`, "sucesso");
        }, 500);
    }
}

window.toggleFavorito = function(btn, nome) {
    btn.classList.toggle("active");
    if (btn.classList.contains("active")) {
        mostrarToast(`${nome} favoritado!`, "sucesso");
    } else {
        mostrarToast(`${nome} removido.`, "info");
    }
};

const btnRandom = document.getElementById("btn-random");
if (btnRandom) btnRandom.addEventListener("click", descobrirRandom);
const campoBuscaElement = document.getElementById("campo-busca");
if (campoBuscaElement) campoBuscaElement.addEventListener("keypress", (e) => { if(e.key==="Enter") iniciarBusca(); });

document.addEventListener('DOMContentLoaded', () => {
    carregarDados();
    initParticles();
});