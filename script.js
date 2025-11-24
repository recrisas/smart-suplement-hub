const cardsContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("#campo-busca");
let dados = [];

// Carrega os dados
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
        mostrarToast("Erro ao carregar dados.", "erro");
    }
}

function normalizarTexto(texto) {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
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

    if (suplementos.length === 0) {
        cardsContainer.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-secondary)">Nenhum suplemento encontrado.</p>`;
        return;
    }

    suplementos.forEach((suplemento, i) => {
        const article = document.createElement("article");
        article.classList.add("card");
        article.id = `card-${i}`;

        const tagsHTML = suplemento.tags 
            ? suplemento.tags.map(tag => `<span class="tag">${tag}</span>`).join('') 
            : '';

        article.innerHTML = `
            <h2>${suplemento.nome}</h2>
            <div class="card-content">
                <div class="tags-container">${tagsHTML}</div>
                <p><strong>Descoberto em:</strong> ${suplemento.ano}</p>
                <p>${suplemento.descricao}</p>
                <a href="${suplemento.link}" target="_blank" class="btn-link">Saiba Mais →</a>
            </div>
        `;
        cardsContainer.appendChild(article);
    });
}

// --- FUNDO ANIMADO (PARTÍCULAS) ---
function initParticles() {
    const canvas = document.getElementById('neural-bg');
    if(!canvas) return; // Proteção se não tiver canvas
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
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = 'rgba(163, 230, 53, 0.5)';
        
        particles.forEach((p, i) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => { resize(); createParticles(); });
    resize(); createParticles(); animate();
}

// --- SORTEIO ALEATÓRIO ---
function descobrirRandom() {
    if (dados.length === 0) return;
    document.querySelectorAll('.highlight-pulse').forEach(el => el.classList.remove('highlight-pulse'));

    const randomIndex = Math.floor(Math.random() * dados.length);
    const cardElement = document.getElementById(`card-${randomIndex}`);

    if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
            cardElement.classList.add('highlight-pulse');
            mostrarToast(`IA selecionou: ${dados[randomIndex].nome}!`, "sucesso");
        }, 500);
    }
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
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 300); }, 3000);
}

// Event Listeners
const btnRandom = document.getElementById("btn-random");
if (btnRandom) btnRandom.addEventListener("click", descobrirRandom);
const campoBuscaElement = document.getElementById("campo-busca");
if (campoBuscaElement) campoBuscaElement.addEventListener("keypress", (e) => { if(e.key==="Enter") iniciarBusca(); });

// Inicializa
carregarDados();
initParticles();