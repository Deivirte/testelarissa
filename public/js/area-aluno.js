// ===================================
// USUÁRIO TESTE OFF-LINE
// Depois será substituído pelo Firebase
// ===================================

const usuarioTeste = {
  uid: "dna001",
  nome: "João Reality",
  email: "teste@dnadoreality.com",
  senha: "123456",

  acessos: {
    curso: true,
    mentoria: true,
    clubDNA: true
  },

  cursos: [
    {
      id: 1,
      nome: "Do Zero à Seleção",
      progresso: 65,
      status: "Liberado"
    },
    {
      id: 2,
      nome: "Mentoria Reality",
      progresso: 20,
      status: "Liberado"
    }
  ],

  agenda: [
    {
      titulo: "Mentoria individual",
      data: "2026-07-10",
      horario: "20:00",
      tipo: "Mentoria",
      meet: "https://meet.google.com/"
    }
  ],

  reunioesClub: [
    {
      titulo: "Encontro semanal Club DNA",
      data: "Toda terça-feira",
      horario: "20h",
      tema: "Construção de narrativa para seletivas",
      aoVivo: true,
      meet: "https://meet.google.com/"
    },
    {
      titulo: "Análise de posicionamento",
      data: "Toda quinta-feira",
      horario: "20h30",
      tema: "Ajuste de imagem e comunicação",
      aoVivo: false,
      meet: "https://meet.google.com/"
    }
  ]
};


// ===================================
// ELEMENTOS
// ===================================

const areaAluno = document.getElementById("areaAluno");
const alunoTabs = document.querySelectorAll(".aluno-tab");
const alunoPanels = document.querySelectorAll(".aluno-panel");
const clubModal = document.getElementById("clubModal");
const fecharClubModal = document.getElementById("fecharClubModal");


// ===================================
// HELPERS
// ===================================

function getUsuarioLogado() {
  return JSON.parse(localStorage.getItem("usuarioDNA"));
}

function getLoginDropdown() {
  return document.querySelector(".login-dropdown");
}

function getBotaoLoginHeader() {
  return document
    .querySelector(".login-dropdown")
    ?.closest(".dropdown")
    ?.querySelector(".dropdown-toggle");
}


// ===================================
// RENDERIZA MENU DE LOGIN / ALUNO
// ===================================

function renderLoginMenu(usuario) {
  const loginDropdown = getLoginDropdown();
  const loginHeader = getBotaoLoginHeader();

  if (!loginDropdown || !loginHeader) return;

  if (usuario) {
    loginHeader.textContent = usuario.nome;
    loginHeader.classList.add("usuario-logado");

    loginDropdown.innerHTML = `
      <li class="login-box aluno-menu-logado">
        <button type="button" class="aluno-menu-btn" id="abrirAreaAlunoBtn">
          Área do aluno
        </button>

        <button type="button" class="aluno-menu-btn sair" id="btnLogout">
          Sair
        </button>
      </li>
    `;

    document.getElementById("abrirAreaAlunoBtn")?.addEventListener("click", () => {
      carregarAreaAluno();
    });

    document.getElementById("btnLogout")?.addEventListener("click", () => {
      localStorage.removeItem("usuarioDNA");
      areaAluno?.classList.remove("show");
      renderLoginMenu(null);
    });

    return;
  }

  loginHeader.textContent = "Login";
  loginHeader.classList.remove("usuario-logado");

  loginDropdown.innerHTML = `
    <li class="login-box">
      <input type="email" id="loginEmail" placeholder="Email ou login">
      <input type="password" id="loginSenha" placeholder="Senha">

      <button type="button" class="btn btn-primary" id="btnLogin">
        Entrar
      </button>

      <a href="#" class="login-link" id="abrirCadastro">
        Cadastrar
      </a>
    </li>
  `;

  ativarLoginTeste();
  ativarCadastroLink();
}


// ===================================
// LOGIN TESTE
// ===================================

function ativarLoginTeste() {
  const btnLogin = document.getElementById("btnLogin");

  btnLogin?.addEventListener("click", () => {
    const email = document.getElementById("loginEmail")?.value.trim();
    const senha = document.getElementById("loginSenha")?.value.trim();

    if (email === usuarioTeste.email && senha === usuarioTeste.senha) {
      localStorage.setItem("usuarioDNA", JSON.stringify(usuarioTeste));
      renderLoginMenu(usuarioTeste);
      alert("Login realizado com sucesso.");
      return;
    }

    alert("Email ou senha inválidos.");
  });
}


// ===================================
// CADASTRO MODAL
// Mantém compatível com seu script atual
// ===================================

function ativarCadastroLink() {
  const abrirCadastro = document.getElementById("abrirCadastro");
  const cadastroModal = document.getElementById("cadastroModal");

  abrirCadastro?.addEventListener("click", (e) => {
    e.preventDefault();
    cadastroModal?.classList.add("show");
  });
}


// ===================================
// CARREGAR ÁREA DO ALUNO
// ===================================

function carregarAreaAluno() {
  const usuario = getUsuarioLogado();

  if (!usuario || !areaAluno) return;

  areaAluno.classList.add("show");

  const nomeAluno = document.getElementById("nomeAluno");

  if (nomeAluno) {
    nomeAluno.textContent = usuario.nome;
  }

  carregarAgenda(usuario);
  carregarCursos(usuario);
  carregarClubDNA(usuario);
}


// ===================================
// ABAS DA ÁREA DO ALUNO
// ===================================

alunoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    const usuario = getUsuarioLogado();

    alunoTabs.forEach((item) => item.classList.remove("active"));
    alunoPanels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(target)?.classList.add("active");

    if (target === "clubdna" && usuario && !usuario.acessos.clubDNA) {
      clubModal?.classList.add("show");
    }
  });
});


// ===================================
// AGENDA
// ===================================

function carregarAgenda(usuario) {
  const agendaLista = document.getElementById("agendaLista");
  const agendaResumo = document.getElementById("agendaResumo");

  if (agendaResumo && usuario.agenda.length > 0) {
    const proxima = usuario.agenda[0];

    agendaResumo.textContent =
      `${proxima.titulo} em ${proxima.data} às ${proxima.horario}`;
  }

  if (!agendaLista) return;

  agendaLista.innerHTML = "";

  usuario.agenda.forEach((item) => {
    agendaLista.innerHTML += `
      <div class="agenda-card">
        <strong>${item.titulo}</strong>

        <p>${item.data} às ${item.horario}</p>

        <span>${item.tipo}</span>

        <a href="${item.meet}" target="_blank" class="btn btn-primary">
          Entrar no Meet
        </a>
      </div>
    `;
  });
}

document.getElementById("abrirAgenda")?.addEventListener("click", () => {
  window.open(
    "https://calendar.google.com/calendar/u/0/r/eventedit",
    "_blank"
  );
});


// ===================================
// CURSOS
// ===================================

function carregarCursos(usuario) {
  const listaCursos = document.getElementById("listaCursos");

  if (!listaCursos) return;

  listaCursos.innerHTML = "";

  if (!usuario.acessos.curso && !usuario.acessos.mentoria) {
    listaCursos.innerHTML = `
      <div class="curso-aluno-card bloqueado">
        <h4>Nenhum curso liberado</h4>

        <p>Adquira um curso para acessar essa área.</p>

        <button class="btn btn-primary">
          Ver cursos disponíveis
        </button>
      </div>
    `;
    return;
  }

  usuario.cursos.forEach((curso) => {
    listaCursos.innerHTML += `
      <div class="curso-aluno-card">
        <h4>${curso.nome}</h4>

        <p>Status: ${curso.status}</p>

        <div class="barra-progresso">
          <div
            class="barra"
            style="width:${curso.progresso}%">
          </div>
        </div>

        <span>${curso.progresso}% concluído</span>

        <button class="btn btn-primary">
          Continuar curso
        </button>
      </div>
    `;
  });
}


// ===================================
// CLUB DNA
// ===================================

function carregarClubDNA(usuario) {
  const clubStatus = document.getElementById("clubStatus");
  const clubHero = document.querySelector(".club-hero");

  if (!clubStatus) return;

  clubStatus.innerHTML = "";

  if (!usuario.acessos.clubDNA) {
    if (clubHero) {
      clubHero.style.display = "block";
    }

    clubStatus.innerHTML = `
      <div class="club-card bloqueado">
        <h4>Club DNA bloqueado</h4>

        <p>
          Ative sua assinatura mensal para participar dos encontros semanais.
        </p>

        <button class="btn btn-primary" id="abrirPlanoClub">
          Ativar Club DNA
        </button>
      </div>
    `;

    document.getElementById("abrirPlanoClub")?.addEventListener("click", () => {
      clubModal?.classList.add("show");
    });

    return;
  }

  if (clubHero) {
    clubHero.style.display = "none";
  }

  usuario.reunioesClub.forEach((reuniao) => {
    if (reuniao.aoVivo) {
      clubStatus.innerHTML += `
        <div class="club-card club-live-card">
          <div class="reuniao-topo">
            <span class="live-dot"></span>
            <strong>AO VIVO AGORA</strong>
          </div>

          <h4>${reuniao.titulo}</h4>

          <p>${reuniao.tema}</p>

          <span>${reuniao.data} às ${reuniao.horario}</span>

          <a href="${reuniao.meet}" target="_blank" class="btn btn-primary">
            Entrar na reunião
          </a>
        </div>
      `;
    } else {
      clubStatus.innerHTML += `
        <div class="club-card">
          <h4>${reuniao.titulo}</h4>

          <p>${reuniao.tema}</p>

          <span>${reuniao.data} às ${reuniao.horario}</span>
        </div>
      `;
    }
  });
}


// ===================================
// MODAL CLUB DNA
// ===================================

document.getElementById("btnAbrirClubOferta")?.addEventListener("click", () => {
  clubModal?.classList.add("show");
});

document.getElementById("btnAssinarClub")?.addEventListener("click", () => {
  alert("Aqui entra o checkout do plano mensal.");
});

fecharClubModal?.addEventListener("click", () => {
  clubModal?.classList.remove("show");
});

clubModal?.addEventListener("click", (e) => {
  if (e.target === clubModal) {
    clubModal.classList.remove("show");
  }
});


// ===================================
// FECHAR ÁREA DO ALUNO AO CLICAR FORA
// ===================================

areaAluno?.addEventListener("click", (e) => {
  if (e.target === areaAluno) {
    areaAluno.classList.remove("show");
  }
});


// ===================================
// INICIALIZAÇÃO
// ===================================

window.addEventListener("DOMContentLoaded", () => {
  const usuario = getUsuarioLogado();

  renderLoginMenu(usuario);

  if (areaAluno) {
    areaAluno.classList.remove("show");
  }
});