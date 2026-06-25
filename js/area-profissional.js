// =====================================
// ÁREA PROFISSIONAL / ADMIN - TESTE OFF
// Futuro: Firebase Auth + Firestore
// =====================================


// =====================================
// USUÁRIOS DO PAINEL
// =====================================

const profissionalTeste = {
  uid: "prof001",
  nome: "Larissa Profissional",
  email: "larissa@dna.com.br",
  senha: "123456",
  perfil: "profissional",
  status: "ativo",

  permissoes: {
    verUsuarios: true,
    editarUsuarios: true,
    verAgenda: true,
    editarAgenda: true,
    verCursos: true,
    editarCursos: false,
    editarSite: false
  }
};

const adminTeste = {
  uid: "admin001",
  nome: "Luiz",
  email: "admin@dna.com.br",
  senha: "123456",
  perfil: "admin",
  status: "ativo",

  permissoes: {
    verUsuarios: true,
    editarUsuarios: true,
    verAgenda: true,
    editarAgenda: true,
    verCursos: true,
    editarCursos: true,
    editarSite: true
  }
};

const usuariosPainel = [
  profissionalTeste,
  adminTeste
];


// =====================================
// USUÁRIOS TESTE DO SISTEMA
// =====================================

let usuariosSistema = JSON.parse(localStorage.getItem("usuariosSistema")) || [
  {
    uid: "dna001",
    nome: "João Reality",
    email: "teste@dnadoreality.com",
    telefone: "11999999999",
    status: "ativo",
    perfil: "aluno",
    clubDNA: true,
    cursos: 2,
    plano: "Club DNA",
    dataCadastro: "2026-06-01",
    ultimoLogin: "2026-07-01 19:30"
  },
  {
    uid: "dna002",
    nome: "Camila Santos",
    email: "camila@email.com",
    telefone: "11988888888",
    status: "inativo",
    perfil: "aluno",
    clubDNA: false,
    cursos: 0,
    plano: "Sem plano ativo",
    dataCadastro: "2026-06-15",
    ultimoLogin: "2026-06-20 10:15"
  },
  {
    uid: "dna003",
    nome: "Marcos Silva",
    email: "marcos@email.com",
    telefone: "11977777777",
    status: "ativo",
    perfil: "aluno",
    clubDNA: true,
    cursos: 1,
    plano: "Mentoria + Club DNA",
    dataCadastro: "2026-05-22",
    ultimoLogin: "2026-07-01 18:00"
  }
];

localStorage.setItem("usuariosSistema", JSON.stringify(usuariosSistema));


// =====================================
// LOGIN DO PAINEL
// Chamado pelo area-aluno.js
// =====================================

function loginPainel(email, senha) {
  const usuarioPainel = usuariosPainel.find((usuario) => {
    return (
      usuario.email === email &&
      usuario.senha === senha &&
      usuario.status === "ativo"
    );
  });

  if (!usuarioPainel) return false;

  localStorage.setItem("painelLogado", JSON.stringify(usuarioPainel));

  return true;
}


// =====================================
// HELPERS
// =====================================

function getPainelLogado() {
  return JSON.parse(localStorage.getItem("painelLogado"));
}

function preencherNomePainel(usuarioPainel) {
  const nomeProfissional = document.getElementById("nomeProfissional");

  if (nomeProfissional) {
    nomeProfissional.textContent = usuarioPainel.nome;
  }
}

function fecharPainelProfissional() {
  document
    .getElementById("areaProfissional")
    ?.classList.remove("show");
}

function logoutPainel() {
  localStorage.removeItem("painelLogado");
  localStorage.removeItem("usuarioDNA");

  document
    .getElementById("areaProfissional")
    ?.classList.remove("show");

  document
    .getElementById("areaAluno")
    ?.classList.remove("show");

  location.reload();
}

function ativarPreviewImagem(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);

  if (!input || !preview) return;

  input.addEventListener("change", () => {
    const arquivo = input.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = () => {
      preview.src = reader.result;
      preview.dataset.base64 = reader.result;
    };

    reader.readAsDataURL(arquivo);
  });
}


// =====================================
// CARREGAR PAINEL
// =====================================

function carregarAreaProfissional(usuarioPainel = getPainelLogado()) {
  const areaProfissional = document.getElementById("areaProfissional");
  const areaAluno = document.getElementById("areaAluno");

  if (!usuarioPainel || !areaProfissional) return;

  areaAluno?.classList.remove("show");
  areaProfissional.classList.add("show");

  preencherNomePainel(usuarioPainel);
  controlarPermissoes(usuarioPainel);
  carregarDashboard();
  carregarUsuarios();
  carregarAgendaProfissional();
  carregarCursosProfissional();
  carregarEditorSite(usuarioPainel);
  aplicarCursosNoSite();
  aplicarDadosSite();
}


// =====================================
// PERMISSÕES
// =====================================

function controlarPermissoes(usuarioPainel) {
  const tabUsuarios = document.querySelector('[data-tab="usuarios"]');
  const tabAgenda = document.querySelector('[data-tab="agendaProf"]');
  const tabCursos = document.querySelector('[data-tab="cursosProf"]');
  const tabSite = document.querySelector('[data-tab="site"]');

  if (tabUsuarios) {
    tabUsuarios.style.display = usuarioPainel.permissoes.verUsuarios ? "block" : "none";
  }

  if (tabAgenda) {
    tabAgenda.style.display = usuarioPainel.permissoes.verAgenda ? "block" : "none";
  }

  if (tabCursos) {
    tabCursos.style.display = usuarioPainel.permissoes.verCursos ? "block" : "none";
  }

  if (tabSite) {
    tabSite.style.display = usuarioPainel.permissoes.editarSite ? "block" : "none";
  }
}


// =====================================
// DASHBOARD
// =====================================

function carregarDashboard(lista = usuariosSistema) {
  const ativos = lista.filter((usuario) => usuario.status === "ativo");
  const inativos = lista.filter((usuario) => usuario.status === "inativo");
  const clubDNA = lista.filter((usuario) => usuario.clubDNA);

  const totalUsuarios = document.getElementById("totalUsuarios");
  const usuariosAtivos = document.getElementById("usuariosAtivos");
  const usuariosInativos = document.getElementById("usuariosInativos");
  const usuariosClubDNA = document.getElementById("usuariosClubDNA");

  if (totalUsuarios) totalUsuarios.textContent = lista.length;
  if (usuariosAtivos) usuariosAtivos.textContent = ativos.length;
  if (usuariosInativos) usuariosInativos.textContent = inativos.length;
  if (usuariosClubDNA) usuariosClubDNA.textContent = clubDNA.length;
}


// =====================================
// USUÁRIOS COM BUSCA + CARROSSEL
// =====================================

function carregarUsuarios(filtro = "") {
  const lista = document.getElementById("listaUsuarios");

  if (!lista) return;

  const busca = filtro.toLowerCase().trim();

  const usuariosFiltrados = usuariosSistema.filter((usuario) => {
    return (
      usuario.nome.toLowerCase().includes(busca) ||
      usuario.email.toLowerCase().includes(busca) ||
      usuario.telefone.toLowerCase().includes(busca)
    );
  });

  carregarDashboard(usuariosFiltrados);

  if (usuariosFiltrados.length === 0) {
    lista.innerHTML = `
      <div class="prof-card">
        <h4>Nenhum usuário encontrado</h4>
        <p>Tente pesquisar por outro nome, email ou telefone.</p>
      </div>
    `;
    return;
  }

  const grupos = [];

  for (let i = 0; i < usuariosFiltrados.length; i += 10) {
    grupos.push(usuariosFiltrados.slice(i, i + 10));
  }

  lista.innerHTML = `
    <div class="usuarios-carousel">
      <div class="usuarios-track" id="usuariosTrack">
        ${grupos.map((grupo) => `
          <div class="usuarios-slide">
            ${grupo.map((usuario) => `
              <div class="usuario-card">
                <div class="usuario-topo">
                  <h4>${usuario.nome}</h4>

                  <span class="status-${usuario.status}">
                    ${usuario.status}
                  </span>
                </div>

                <p><strong>Email:</strong> ${usuario.email}</p>
                <p><strong>Telefone:</strong> ${usuario.telefone}</p>
                <p><strong>Plano:</strong> ${usuario.plano}</p>
                <p><strong>Cursos:</strong> ${usuario.cursos}</p>
                <p><strong>Cadastro:</strong> ${usuario.dataCadastro}</p>
                <p><strong>Último acesso:</strong> ${usuario.ultimoLogin}</p>

                ${
                  usuario.clubDNA
                    ? `<span class="badge-club">Club DNA Ativo</span>`
                    : `<span class="badge-sem-club">Sem Club DNA</span>`
                }

                <div class="usuario-acoes">
                  <button type="button" class="btn-prof" data-user="${usuario.uid}">
                    Ver detalhes
                  </button>

                  <button type="button" class="btn-prof" data-user="${usuario.uid}">
                    Editar acesso
                  </button>
                </div>
              </div>
            `).join("")}
          </div>
        `).join("")}
      </div>

      <div class="carousel-controls">
        <button type="button" class="carousel-btn" id="usuariosPrev">‹</button>

        <span class="carousel-indicator">
          <span id="usuariosPaginaAtual">1</span>
          /
          <span>${grupos.length}</span>
        </span>

        <button type="button" class="carousel-btn" id="usuariosNext">›</button>
      </div>
    </div>
  `;

  iniciarCarouselUsuarios(grupos.length);
}

function iniciarCarouselUsuarios(totalPaginas) {
  const track = document.getElementById("usuariosTrack");
  const prev = document.getElementById("usuariosPrev");
  const next = document.getElementById("usuariosNext");
  const paginaAtual = document.getElementById("usuariosPaginaAtual");

  if (!track || !prev || !next || !paginaAtual) return;

  let pagina = 0;

  function atualizarCarousel() {
    track.style.transform = `translateX(-${pagina * 100}%)`;
    paginaAtual.textContent = pagina + 1;
  }

  prev.addEventListener("click", () => {
    pagina = pagina === 0 ? totalPaginas - 1 : pagina - 1;
    atualizarCarousel();
  });

  next.addEventListener("click", () => {
    pagina = pagina === totalPaginas - 1 ? 0 : pagina + 1;
    atualizarCarousel();
  });

  atualizarCarousel();
}


// =====================================
// AGENDA PROFISSIONAL
// =====================================

function carregarAgendaProfissional() {
  const agendaMentorias = document.getElementById("agendaMentorias");

  if (!agendaMentorias) return;

  agendaMentorias.innerHTML = `
    <div class="prof-card">
      <h4>Mentoria individual</h4>
      <p><strong>Aluno:</strong> João Reality</p>
      <p><strong>Data:</strong> 2026-07-10 às 20:00</p>
      <p><strong>Status:</strong> Confirmada</p>

      <a href="https://meet.google.com/" target="_blank" class="btn-prof">
        Abrir Meet
      </a>
    </div>

    <div class="prof-card">
      <h4>Encontro Club DNA</h4>
      <p><strong>Tipo:</strong> Reunião semanal</p>
      <p><strong>Data:</strong> Toda terça-feira às 20h</p>
      <p><strong>Status:</strong> Recorrente</p>

      <a href="https://calendar.google.com/calendar/u/0/r/eventedit" target="_blank" class="btn-prof">
        Criar no Google Calendar
      </a>
    </div>
  `;
}


// =====================================
// CURSOS DO SITE
// =====================================

function getCursosPadrao() {
  return [
    {
      id: "curso1",
      nome: "Mentoria Reality",
      descricao: "Acompanhamento estratégico para quem quer se posicionar melhor, construir presença e aumentar as chances na seletiva.",
      qualidade: "⭐⭐⭐⭐⭐",
      nivel: "Conteúdo avançado",
      beneficios: "Posicionamento estratégico\nConstrução de perfil\nDirecionamento prático",
      precoLabel: "Vagas limitadas",
      preco: "Sob consulta",
      botao: "Comprar agora",
      link: "https://wa.me/5511999999999",
      imagem: "./img/larissa_sf1.png",
      badge: "Mais procurado",
      status: "ativo"
    },
    {
      id: "curso2",
      nome: "Do ZERO a Seleção",
      descricao: "Aprenda os fundamentos para montar uma inscrição mais forte, estratégica e competitiva.",
      qualidade: "⭐⭐⭐⭐☆",
      nivel: "Conteúdo intermediário",
      beneficios: "Posicionamento estratégico\nConstrução de perfil\nDirecionamento prático",
      precoLabel: "Acesso imediato",
      preco: "R$ 97",
      botao: "Comprar agora",
      link: "#",
      imagem: "./img/larissa_sf1.png",
      badge: "",
      status: "ativo"
    },
    {
      id: "curso3",
      nome: "E-Book",
      descricao: "Um material rápido e objetivo para revisar os pontos mais importantes antes de fazer sua inscrição.",
      qualidade: "⭐⭐⭐☆☆",
      nivel: "Conteúdo rápido",
      beneficios: "Posicionamento estratégico\nConstrução de perfil\nDirecionamento prático",
      precoLabel: "Material prático",
      preco: "R$ 29",
      botao: "Comprar agora",
      link: "#",
      imagem: "./img/larissa_sf1.png",
      badge: "",
      status: "ativo"
    }
  ];
}

function getCursosSite() {
  const cursos = JSON.parse(localStorage.getItem("cursosSite"));

  if (cursos && Array.isArray(cursos)) return cursos;

  const cursosPadrao = getCursosPadrao();
  localStorage.setItem("cursosSite", JSON.stringify(cursosPadrao));

  return cursosPadrao;
}

function salvarCursosSite(cursos) {
  localStorage.setItem("cursosSite", JSON.stringify(cursos));
}

let imagemCursoBase64 = "";

function carregarCursosProfissional() {
  const gerenciarCursos = document.getElementById("gerenciarCursos");

  if (!gerenciarCursos) return;

  const cursosSite = getCursosSite();

  gerenciarCursos.innerHTML = `
    <div class="curso-editor-form">
      <h4>Adicionar novo curso</h4>

      <input id="novoCursoNome" placeholder="Nome do curso">
      <textarea id="novoCursoDescricao" placeholder="Descrição do curso"></textarea>
      <input id="novoCursoPrecoLabel" placeholder="Texto acima do preço. Ex: Acesso imediato">
      <input id="novoCursoPreco" placeholder="Preço. Ex: R$ 97">
      <input id="novoCursoLink" placeholder="Link de compra">

      <label class="upload-imagem">
        Imagem do curso
        <input type="file" id="novoCursoImagem" accept="image/*">
      </label>

      <img
        id="previewNovoCurso"
        class="preview-curso"
        src="./img/placeholder-curso.png"
        alt="Prévia do curso"
      >

      <input id="novoCursoBadge" placeholder="Badge opcional. Ex: Mais vendido">
      <textarea id="novoCursoBeneficios" placeholder="Benefícios, um por linha"></textarea>

      <button type="button" class="btn-prof" id="adicionarCursoSite">
        Adicionar curso
      </button>
    </div>

    <div class="cursos-admin-lista">
      ${cursosSite.map((curso, index) => `
        <div class="curso-admin-card" data-id="${curso.id}">
          <div class="curso-admin-img">
            <img src="${curso.imagem}" alt="${curso.nome}">
          </div>

          <div class="curso-admin-info">
            <input value="${curso.nome}" data-campo="nome">
            <textarea data-campo="descricao">${curso.descricao}</textarea>

            <input value="${curso.qualidade}" data-campo="qualidade">
            <input value="${curso.nivel}" data-campo="nivel">
            <textarea data-campo="beneficios">${curso.beneficios}</textarea>

            <input value="${curso.precoLabel}" data-campo="precoLabel">
            <input value="${curso.preco}" data-campo="preco">
            <input value="${curso.botao}" data-campo="botao">
            <input value="${curso.link}" data-campo="link">
            <input value="${curso.imagem}" data-campo="imagem">
            <input value="${curso.badge}" data-campo="badge">

            <select data-campo="status">
              <option value="ativo" ${curso.status === "ativo" ? "selected" : ""}>Ativo</option>
              <option value="inativo" ${curso.status === "inativo" ? "selected" : ""}>Inativo</option>
            </select>

            <div class="curso-admin-acoes">
              <button type="button" class="btn-prof subirCurso" data-index="${index}">↑ Subir</button>
              <button type="button" class="btn-prof descerCurso" data-index="${index}">↓ Descer</button>
              <button type="button" class="btn-prof salvarCurso" data-id="${curso.id}">Salvar</button>
              <button type="button" class="btn-prof removerCurso" data-id="${curso.id}">Remover</button>
            </div>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  ativarAcoesCursosAdmin();
}

function ativarAcoesCursosAdmin() {
  imagemCursoBase64 = "";

  document.getElementById("novoCursoImagem")?.addEventListener("change", (e) => {
    const arquivo = e.target.files[0];

    if (!arquivo) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      imagemCursoBase64 = event.target.result;

      const preview = document.getElementById("previewNovoCurso");

      if (preview) {
        preview.src = imagemCursoBase64;
      }
    };

    reader.readAsDataURL(arquivo);
  });

  document.getElementById("adicionarCursoSite")?.addEventListener("click", adicionarCursoSite);

  document.querySelectorAll(".salvarCurso").forEach((btn) => {
    btn.addEventListener("click", () => salvarCursoSite(btn.dataset.id));
  });

  document.querySelectorAll(".removerCurso").forEach((btn) => {
    btn.addEventListener("click", () => removerCursoSite(btn.dataset.id));
  });

  document.querySelectorAll(".subirCurso").forEach((btn) => {
    btn.addEventListener("click", () => moverCurso(Number(btn.dataset.index), -1));
  });

  document.querySelectorAll(".descerCurso").forEach((btn) => {
    btn.addEventListener("click", () => moverCurso(Number(btn.dataset.index), 1));
  });
}

function adicionarCursoSite() {
  const cursos = getCursosSite();

  const nome = document.getElementById("novoCursoNome").value.trim();

  if (!nome) {
    alert("Digite o nome do curso.");
    return;
  }

  cursos.push({
    id: `curso${Date.now()}`,
    nome,
    descricao: document.getElementById("novoCursoDescricao").value,
    qualidade: "⭐⭐⭐⭐⭐",
    nivel: "Novo conteúdo",
    beneficios: document.getElementById("novoCursoBeneficios").value,
    precoLabel: document.getElementById("novoCursoPrecoLabel").value,
    preco: document.getElementById("novoCursoPreco").value,
    botao: "Comprar agora",
    link: document.getElementById("novoCursoLink").value || "#",
    imagem: imagemCursoBase64 || "./img/larissa_sf1.png",
    badge: document.getElementById("novoCursoBadge").value,
    status: "ativo"
  });

  salvarCursosSite(cursos);

  carregarCursosProfissional();
  aplicarCursosNoSite();
}

function salvarCursoSite(id) {
  const cursos = getCursosSite();
  const card = document.querySelector(`.curso-admin-card[data-id="${id}"]`);
  const curso = cursos.find((item) => item.id === id);

  if (!curso || !card) return;

  card.querySelectorAll("[data-campo]").forEach((campo) => {
    curso[campo.dataset.campo] = campo.value;
  });

  salvarCursosSite(cursos);
  aplicarCursosNoSite();

  alert("Curso atualizado.");
}

function removerCursoSite(id) {
  const confirmar = confirm("Deseja remover este curso?");

  if (!confirmar) return;

  const cursos = getCursosSite().filter((curso) => curso.id !== id);

  salvarCursosSite(cursos);
  carregarCursosProfissional();
  aplicarCursosNoSite();
}

function moverCurso(index, direcao) {
  const cursos = getCursosSite();
  const novoIndex = index + direcao;

  if (novoIndex < 0 || novoIndex >= cursos.length) return;

  [cursos[index], cursos[novoIndex]] = [cursos[novoIndex], cursos[index]];

  salvarCursosSite(cursos);
  carregarCursosProfissional();
  aplicarCursosNoSite();
}

function aplicarCursosNoSite() {
  const cursos = getCursosSite().filter((curso) => curso.status !== "inativo");
  const grid = document.querySelector("#cursos .cursos-grid");

  if (!grid) return;

  grid.innerHTML = cursos.map((curso) => {
    const beneficios = String(curso.beneficios || "")
      .split("\n")
      .filter(Boolean)
      .map((item) => `<li>${item}</li>`)
      .join("");

    return `
      <article class="curso-card">
        <div class="curso-img">
          <img src="${curso.imagem}" alt="${curso.nome}">
          ${curso.badge ? `<span class="badge">${curso.badge}</span>` : ""}
        </div>

        <div class="curso-content">
          <h3>${curso.nome}</h3>

          <p class="desc">${curso.descricao}</p>

          <div class="qualidade">
            ${curso.qualidade} <span>${curso.nivel}</span>
          </div>

          <ul>${beneficios}</ul>

          <div class="preco">
            <span>${curso.precoLabel}</span>
            <strong>${curso.preco}</strong>
          </div>

          <a href="${curso.link}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
            ${curso.botao}
          </a>
        </div>
      </article>
    `;
  }).join("");
}


// =====================================
// EDITOR DO SITE POR SEÇÕES
// Rodapé fica intacto
// =====================================

function carregarEditorSite(usuarioPainel) {
  const editorSite = document.getElementById("editorSite");

  if (!editorSite) return;

  if (!usuarioPainel.permissoes.editarSite) {
    editorSite.innerHTML = `
      <div class="prof-card bloqueado">
        <h4>Acesso restrito</h4>
        <p>Seu perfil não possui permissão para editar o site.</p>
      </div>
    `;
    return;
  }

  editorSite.innerHTML = `
    <div class="prof-card">
      <h4>Editar Página Inicial</h4>
      <p>Escolha a seção que deseja alterar. O rodapé fica bloqueado.</p>

      <div class="editor-site-grid">
        <label>
          Seção
          <select id="secaoEditorSite">
            <option value="menu">Menu</option>
            <option value="banner">Banner Principal</option>
            <option value="sobre">Sobre Mim</option>
            <option value="blog">Blog</option>
            <option value="cursos">Cursos</option>
            <option value="contato">Contato / Inscrição</option>
          </select>
        </label>
      </div>
    </div>

    <div id="camposEditorSite"></div>
  `;

  carregarCamposSecaoSite("menu");

  document.getElementById("secaoEditorSite")?.addEventListener("change", (e) => {
    carregarCamposSecaoSite(e.target.value);
  });
}

function getDadosSiteCMS() {
  return JSON.parse(localStorage.getItem("dadosSiteCMS")) || {};
}

function salvarDadosSiteCMS(dados) {
  localStorage.setItem("dadosSiteCMS", JSON.stringify(dados));
}

function getPadraoSecao(secao) {
  const padroes = {
    menu: {
      marca: "DNA do Reality",
      linkSobre: "Sobre Mim",
      linkBlog: "Blog",
      produto1: "Cursos do Zero a Seleção",
      produto2: "Mentoria Reality",
      produto3: "E-book",
      login: "Login"
    },

    banner: {
      titulo: "DO REALITY",
      subtitulo: "com Larissa Ferreira",
      botaoPrincipal: "Quero me inscrever",
      linkBotaoPrincipal: "#inscricoes-reality",
      botaoSecundario: "Saber mais",
      linkBotaoSecundario: "https://wa.me/5511999999999",
      imagem: "./img/banner.png"
    },

    sobre: {
      titulo: "Estratégia e posicionamento",
      texto1: "Larissa Ferreira é especialista em preparar pessoas comuns para se tornarem personagens memoráveis dentro dos maiores realities do Brasil.",
      texto2: "Com mais de 25 mil inscritos no YouTube e mais de 2 milhões de visualizações, construiu uma audiência sólida ensinando como funcionam os bastidores das seletivas.",
      card1Titulo: "Posicionamento",
      card1Texto: "Construa uma imagem forte e memorável",
      card2Titulo: "Vídeo de inscrição",
      card2Texto: "Aprenda a prender atenção nos primeiros segundos",
      card3Titulo: "Estratégia de seletiva",
      card3Texto: "Saiba o que realmente pesa na avaliação",
      botao: "Quero saber mais",
      linkBotao: "https://wa.me/5511999999999",
      imagem: "./img/larissa_sf.png"
    },

    blog: {
      titulo: "Conteúdos que aumentam suas chances",
      subtitulo: "Estratégias, dicas e bastidores para você se destacar na seletiva e sair na frente.",
      card1Tag: "SELETIVA",
      card1Titulo: "O que faz um candidato ser escolhido?",
      card1Texto: "Descubra os critérios reais que fazem alguém se destacar na seleção e evitar erros comuns.",
      card2Tag: "ERROS",
      card2Titulo: "5 erros que eliminam candidatos na seletiva",
      card2Texto: "Evite os erros que fazem a produção ignorar sua inscrição logo de cara.",
      card3Tag: "ESTRATÉGIA",
      card3Titulo: "Como chamar atenção da produção",
      card3Texto: "Técnicas para se destacar entre milhares de inscritos e aumentar suas chances.",
      card4Tag: "VÍDEO",
      card4Titulo: "Como gravar um vídeo de inscrição que chama atenção",
      card4Texto: "Veja como transmitir personalidade, presença e autenticidade no vídeo."
    },

    cursos: {
      titulo: "Escolha o melhor caminho para se destacar",
      subtitulo: "Produtos criados para aumentar suas chances reais na seletiva."
    },

    contato: {
      titulo: "Dê o primeiro passo para se destacar na seleção",
      texto: "Preencha o formulário e escolha a opção ideal para receber direcionamento, mentoria ou conteúdo estratégico para reality shows.",
      topico1Titulo: "Escolha seu foco",
      topico1Texto: "BBB27, Casa do Patrão, outros realities ou mentoria estratégica.",
      topico2Titulo: "Preenchimento rápido",
      topico2Texto: "Um formulário direto para agilizar seu atendimento.",
      topico3Titulo: "Atendimento direcionado",
      topico3Texto: "Você entra no fluxo certo conforme seu interesse.",
      tituloFormulario: "Preencha sua inscrição",
      textoBotao: "Enviar inscrição"
    }
  };

  return padroes[secao] || {};
}

function nomeSecaoSite(secao) {
  const nomes = {
    menu: "Menu",
    banner: "Banner Principal",
    sobre: "Sobre Mim",
    blog: "Blog",
    cursos: "Cursos",
    contato: "Contato / Inscrição"
  };

  return nomes[secao] || "Seção";
}

function carregarCamposSecaoSite(secao) {
  const campos = document.getElementById("camposEditorSite");
  if (!campos) return;

  const dados = getDadosSiteCMS();

  const secaoDados = {
    ...getPadraoSecao(secao),
    ...(dados[secao] || {})
  };

  let htmlCampos = "";

  Object.keys(secaoDados).forEach((chave) => {
    const valor = secaoDados[chave] || "";

    if (chave === "imagem") {
      htmlCampos += `
        <label>
          Imagem
          <input type="file" id="campo_${chave}" accept="image/*">
        </label>

        <div class="preview-img-box">
          <span>Prévia da imagem</span>
          <img id="previewImagemSecao" src="${valor}" alt="Prévia da seção">
        </div>
      `;
    } else if (
      chave.toLowerCase().includes("texto") ||
      chave.toLowerCase().includes("descricao") ||
      chave.toLowerCase().includes("subtitulo")
    ) {
      htmlCampos += `
        <label>
          ${formatarNomeCampo(chave)}
          <textarea id="campo_${chave}" rows="4">${valor}</textarea>
        </label>
      `;
    } else {
      htmlCampos += `
        <label>
          ${formatarNomeCampo(chave)}
          <input type="text" id="campo_${chave}" value="${valor}">
        </label>
      `;
    }
  });

  campos.innerHTML = `
    <div class="prof-card">
      <h4>Editando: ${nomeSecaoSite(secao)}</h4>

      <div class="editor-site-grid">
        ${htmlCampos}

        <button type="button" class="btn-prof salvar-site" id="salvarSecaoSite">
          Salvar ${nomeSecaoSite(secao)}
        </button>
      </div>
    </div>
  `;

  ativarPreviewImagem("campo_imagem", "previewImagemSecao");

  document.getElementById("salvarSecaoSite")?.addEventListener("click", () => {
    salvarSecaoSite(secao);
  });
}

function formatarNomeCampo(campo) {
  return campo
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letra) => letra.toUpperCase());
}

function salvarSecaoSite(secao) {
  const dados = getDadosSiteCMS();
  const padrao = getPadraoSecao(secao);
  const novosDados = {};

  Object.keys(padrao).forEach((chave) => {
    if (chave === "imagem") {
      const preview = document.getElementById("previewImagemSecao");
      novosDados[chave] = preview?.dataset.base64 || preview?.src || padrao[chave];
    } else {
      novosDados[chave] = document.getElementById(`campo_${chave}`)?.value || "";
    }
  });

  dados[secao] = novosDados;

  salvarDadosSiteCMS(dados);
  aplicarSecaoNoSite(secao);

  alert(`${nomeSecaoSite(secao)} salvo com sucesso.`);
}

function aplicarSecaoNoSite(secao) {
  const dados = getDadosSiteCMS();

  const info = {
    ...getPadraoSecao(secao),
    ...(dados[secao] || {})
  };

  if (secao === "menu") {
    const marca = document.querySelector(".brand-text");
    const navSobre = document.querySelector('.nav-links a[href="#sobre-mim"]');
    const navBlog = document.querySelector('.nav-links a[href="#blog"]');
    const loginBtn = document.getElementById("btnLoginHeader");
    const produtos = document.querySelectorAll(".dropdown-menu li a");

    if (marca) marca.textContent = info.marca;
    if (navSobre) navSobre.textContent = info.linkSobre;
    if (navBlog) navBlog.textContent = info.linkBlog;

    if (loginBtn && loginBtn.textContent.trim() === "Login") {
      loginBtn.textContent = info.login;
    }

    if (produtos[0]) produtos[0].textContent = info.produto1;
    if (produtos[1]) produtos[1].textContent = info.produto2;
    if (produtos[2]) produtos[2].textContent = info.produto3;
  }

  if (secao === "banner") {
    const titulo = document.querySelector(".subtitle");
    const subtitulo = document.querySelector(".subtitle1");
    const botaoPrincipal = document.querySelector(".banner-actions .btn-primary");
    const botaoSecundario = document.querySelector(".banner-actions .btn-secondary");
    const botaoSecundarioTexto = document.querySelector(".banner-actions .btn-secondary span");
    const banner = document.querySelector(".banner.bbb27-hero");

    if (titulo) titulo.textContent = info.titulo;
    if (subtitulo) subtitulo.textContent = info.subtitulo;

    if (botaoPrincipal) {
      botaoPrincipal.textContent = info.botaoPrincipal;
      botaoPrincipal.href = info.linkBotaoPrincipal;
    }

    if (botaoSecundario) botaoSecundario.href = info.linkBotaoSecundario;
    if (botaoSecundarioTexto) botaoSecundarioTexto.textContent = info.botaoSecundario;

    if (banner && info.imagem) {
      banner.style.backgroundImage = `url("${info.imagem}")`;
    }
  }

  if (secao === "sobre") {
    const imagem = document.querySelector(".about-image img");
    const titulo = document.querySelector(".about-title");
    const textos = document.querySelectorAll(".about-content .about-text");
    const cards = document.querySelectorAll(".about-highlights .about-card");
    const botao = document.querySelector(".container-botao .btn-primary");

    if (imagem) imagem.src = info.imagem;
    if (titulo) titulo.textContent = info.titulo;

    if (textos[0]) textos[0].textContent = info.texto1;
    if (textos[1]) textos[1].textContent = info.texto2;

    if (cards[0]) {
      cards[0].querySelector("strong").textContent = info.card1Titulo;
      cards[0].querySelector("span").textContent = info.card1Texto;
    }

    if (cards[1]) {
      cards[1].querySelector("strong").textContent = info.card2Titulo;
      cards[1].querySelector("span").textContent = info.card2Texto;
    }

    if (cards[2]) {
      cards[2].querySelector("strong").textContent = info.card3Titulo;
      cards[2].querySelector("span").textContent = info.card3Texto;
    }

    if (botao) {
      botao.textContent = info.botao;
      botao.href = info.linkBotao;
    }
  }

  if (secao === "blog") {
    const titulo = document.querySelector(".blog-header h2");
    const subtitulo = document.querySelector(".blog-header p");
    const cards = document.querySelectorAll(".blog-card");

    if (titulo) titulo.textContent = info.titulo;
    if (subtitulo) subtitulo.textContent = info.subtitulo;

    const dadosCards = [
      [info.card1Tag, info.card1Titulo, info.card1Texto],
      [info.card2Tag, info.card2Titulo, info.card2Texto],
      [info.card3Tag, info.card3Titulo, info.card3Texto],
      [info.card4Tag, info.card4Titulo, info.card4Texto]
    ];

    cards.forEach((card, index) => {
      const base = index % 4;
      const dados = dadosCards[base];

      const tag = card.querySelector(".tag");
      const h3 = card.querySelector("h3");
      const p = card.querySelector("p");

      if (tag) tag.textContent = dados[0];
      if (h3) h3.textContent = dados[1];
      if (p) p.textContent = dados[2];
    });
  }

  if (secao === "cursos") {
    const titulo = document.querySelector(".cursos-header h2");
    const subtitulo = document.querySelector(".cursos-header p");

    if (titulo) titulo.textContent = info.titulo;
    if (subtitulo) subtitulo.textContent = info.subtitulo;
  }

  if (secao === "contato") {
    const titulo = document.querySelector(".inscricao-texto h2");
    const texto = document.querySelector(".inscricao-texto > p");
    const topics = document.querySelectorAll(".topic-card");
    const tituloForm = document.querySelector(".inscricao-form h3");
    const botao = document.querySelector(".btn-submit");

    if (titulo) titulo.textContent = info.titulo;
    if (texto) texto.textContent = info.texto;

    if (topics[0]) {
      topics[0].querySelector("strong").textContent = info.topico1Titulo;
      topics[0].querySelector("p").textContent = info.topico1Texto;
    }

    if (topics[1]) {
      topics[1].querySelector("strong").textContent = info.topico2Titulo;
      topics[1].querySelector("p").textContent = info.topico2Texto;
    }

    if (topics[2]) {
      topics[2].querySelector("strong").textContent = info.topico3Titulo;
      topics[2].querySelector("p").textContent = info.topico3Texto;
    }

    if (tituloForm) tituloForm.textContent = info.tituloFormulario;
    if (botao) botao.textContent = info.textoBotao;
  }
}

function aplicarDadosSite() {
  aplicarSecaoNoSite("menu");
  aplicarSecaoNoSite("banner");
  aplicarSecaoNoSite("sobre");
  aplicarSecaoNoSite("blog");
  aplicarSecaoNoSite("cursos");
  aplicarSecaoNoSite("contato");
}


// =====================================
// ABAS DO PAINEL
// =====================================

const profTabs = document.querySelectorAll(".prof-tab");
const profPanels = document.querySelectorAll(".prof-panel");

profTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    profTabs.forEach((item) => item.classList.remove("active"));
    profPanels.forEach((item) => item.classList.remove("active"));

    tab.classList.add("active");

    document.getElementById(target)?.classList.add("active");
  });
});


// =====================================
// EVENTOS
// =====================================

document.addEventListener("input", (e) => {
  if (e.target.id === "buscarUsuario") {
    carregarUsuarios(e.target.value);
  }
});

document.getElementById("logoutProfissional")?.addEventListener("click", logoutPainel);
document.getElementById("logoutProfissionalMobile")?.addEventListener("click", logoutPainel);

document
  .getElementById("fecharPainelProfissional")
  ?.addEventListener("click", fecharPainelProfissional);

document
  .getElementById("fecharPainelProfissionalMobile")
  ?.addEventListener("click", fecharPainelProfissional);

document
  .getElementById("areaProfissional")
  ?.addEventListener("click", (e) => {
    if (e.target.id === "areaProfissional") {
      e.target.classList.remove("show");
    }
  });


// =====================================
// INICIALIZAÇÃO
// =====================================

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("areaProfissional")?.classList.remove("show");

  aplicarCursosNoSite();
  aplicarDadosSite();
});


// =====================================
// CREDENCIAIS DE TESTE
// =====================================
//
// PROFISSIONAL:
// Email: larissa@dna.com.br
// Senha: 123456
//
// ADMIN:
// Email: admin@dna.com.br
// Senha: 123456
//