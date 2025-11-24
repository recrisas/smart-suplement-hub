<div align="center">

# ⚡ Smart Supplement Hub

**Onde a Nutrição Esportiva encontra a Inteligência Artificial.**

![Project Status](https://img.shields.io/badge/Status-Concluído-success)
![AI Powered](https://img.shields.io/badge/AI-Powered_Content-blueviolet)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

## 📖 Sobre o Projeto

O **Smart Supplement Hub** é uma aplicação web interativa desenvolvida para facilitar o acesso a informações técnicas sobre suplementação esportiva. O objetivo é fornecer uma interface rápida, responsiva e intuitiva para atletas e entusiastas consultarem benefícios, dosagens e dados históricos de diversos compostos.
O grande diferencial deste projeto reside na sua base de dados (`data.json`): todo o conteúdo técnico, incluindo descrições, histórico e categorização por tags, foi **gerado via Inteligência Artificial** utilizando a API do **Google Gemini**, garantindo precisão e riqueza de detalhes sem preenchimento manual.
---

## 🚀 Funcionalidades

* **🔍 Busca Inteligente (Full-Text Search):** O algoritmo de pesquisa não filtra apenas pelo nome, mas varre descrições e tags. Experimente buscar por *"sono"*, *"energia"* ou *"foco"*.
* **🏷️ Sistema de Tags Dinâmicas:** Categorização visual dos suplementos (ex: `Hipertrofia`, `Resistência`, `Cognição`) para leitura rápida.
* **📱 Design Responsivo:** Interface adaptável que oferece excelente experiência de uso em desktops, tablets e dispositivos móveis.
* **⚡ Carregamento Dinâmico:** Os dados são consumidos de um arquivo JSON externo via `fetch` API, simulando o comportamento de uma aplicação real conectada a um Back-end.
---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com foco em **Performance** e **Semântica**, sem dependência de frameworks pesados:

* **HTML5 Semântico:** Estruturação acessível e organizada.
* **CSS3 Moderno:** Uso de *CSS Variables* (`:root`), *Flexbox* para layout e media queries para responsividade.
* **JavaScript (ES6+):** Lógica de manipulação do DOM, consumo de dados assíncrono (`async/await`) e filtragem de arrays.
* **Google Gemini API (Back-end):** Utilizada na etapa de engenharia de dados para popular o arquivo `data.json` com informações ricas e contextualizadas.
---

## 🎨 Layout e UI

A interface foi projetada pensando na **Hierarquia Visual** e redução da carga cognitiva:

* **Identidade Visual:** Uso da cor amarela (`#E0E014`) como *Brand Color* no cabeçalho para impacto imediato.
* **Legibilidade:** Fundo suave (`#F4F4F9`) e cards brancos com sombreamento sutil (`box-shadow`) para destacar o conteúdo.
* **Contraste:** Tags em roxo profundo (`#2D036C`) para guiar o olhar do usuário pelas categorias chave.

---

## 📂 Estrutura do Repositório

```text
📁 /
├── 📄 index.html      # Estrutura principal da aplicação
├── 🎨 style.css       # Folhas de estilo e design system
├── 🧠 script.js       # Lógica de busca, renderização e leitura de dados
└── 📦 data.json       # Base de conhecimento gerada por IA
