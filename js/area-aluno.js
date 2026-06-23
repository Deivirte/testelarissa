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

  clubAoVivo: true,

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
const btnLogin = document.getElementById("btnLogin");
const areaAluno = document.getElementById("areaAluno");
const alunoTabs = document.querySelectorAll(".aluno-tab");
const alunoPanels = document.querySelectorAll(".aluno-panel");
const clubModal = document.getElementById("clubModal");
const fecharClubModal = document.getElementById("fecharClubModal");

btnLogin?.addEventListener("click", () => {
  const email = document.getElementById("loginEmail").value.trim();
  const senha = document.getElementById("loginSenha").value.trim();

  if (email === usuarioTeste.email && senha === usuarioTeste.senha) {
    localStorage.setItem("usuarioDNA", JSON.stringify(usuarioTeste));
    carregarAreaAluno();
  } else {
    alert("Email ou senha inválidos.");
  }
});

function carregarAreaAluno() {
  const usuario = JSON.parse(localStorage.getItem("usuarioDNA"));
  if (!usuario || !areaAluno) return;

  areaAluno.classList.add("show");

  const nomeAluno = document.getElementById("nomeAluno");
  if (nomeAluno) nomeAluno.textContent = usuario.nome;

  carregarAgenda(usuario);
  carregarCursos(usuario);
  carregarClubDNA(usuario);
}

alunoTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    const usuario = JSON.parse(localStorage.getItem("usuarioDNA"));

    alunoTabs.forEach((item) => item.classList.remove("active"));
    alunoPanels.forEach((panel) => panel.classList.remove("active"));

    tab.classList.add("active");
    document.getElementById(target)?.classList.add("active");

    if (target === "clubdna" && usuario && !usuario.acessos.clubDNA) {
      clubModal?.classList.add("show");
    }
  });
});

function carregarAgenda(usuario) {
  const agendaLista = document.getElementById("agendaLista");
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

function carregarCursos(usuario) {
  const listaCursos = document.getElementById("listaCursos");
  if (!listaCursos) return;

  listaCursos.innerHTML = "";

  if (!usuario.acessos.curso && !usuario.acessos.mentoria) {
    listaCursos.innerHTML = `
      <div class="curso-aluno-card bloqueado">
        <h4>Nenhum curso liberado</h4>
        <p>Adquira um curso para acessar essa área.</p>
        <button class="btn btn-primary">Ver cursos disponíveis</button>
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
          <div class="barra" style="width:${curso.progresso}%"></div>
        </div>

        <span>${curso.progresso}% concluído</span>

        <button class="btn btn-primary">
          Continuar curso
        </button>
      </div>
    `;
  });
}

function carregarClubDNA(usuario) {
  const clubStatus = document.getElementById("clubStatus");
  if (!clubStatus) return;

  clubStatus.innerHTML = "";

  if (!usuario.acessos.clubDNA) {
    clubStatus.innerHTML = `
      <div class="club-card bloqueado">
        <h4>Club DNA bloqueado</h4>
        <p>Ative sua assinatura mensal para participar dos encontros semanais.</p>

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

fecharClubModal?.addEventListener("click", () => {
  clubModal?.classList.remove("show");
});

clubModal?.addEventListener("click", (e) => {
  if (e.target === clubModal) {
    clubModal.classList.remove("show");
  }
});

areaAluno?.addEventListener("click", (e) => {
  if (e.target === areaAluno) {
    areaAluno.classList.remove("show");
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioDNA"));
  if (usuario) carregarAreaAluno();
});

document.getElementById("btnAbrirClubOferta")?.addEventListener("click", () => {
  document.getElementById("clubModal")?.classList.add("show");
});

document.getElementById("btnAssinarClub")?.addEventListener("click", () => {
  alert("Aqui entra o checkout do plano mensal.");
});


if(usuario.clubAoVivo){
   // mostra bolinha verde
   // mostra botão entrar reunião
}
else{
   // mostra próxima reunião
}