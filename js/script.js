/* =========================
   MENU HAMBÚRGUER
========================= */
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const overlay = document.querySelector(".menu-overlay");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("active");

    if (overlay) {
      overlay.classList.toggle("active");
    }

    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

dropdownToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    if (window.innerWidth <= 1024) {
      const parent = toggle.parentElement;
      const isOpen = parent.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  });
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1024) {
      mainNav.classList.remove("active");

      if (overlay) {
        overlay.classList.remove("active");
      }

      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }

      document.querySelectorAll(".dropdown").forEach((dropdown) => {
        dropdown.classList.remove("open");
      });

      dropdownToggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
      });
    }
  });
});

if (overlay) {
  overlay.addEventListener("click", () => {
    mainNav.classList.remove("active");
    overlay.classList.remove("active");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.addEventListener("click", (event) => {
  const clickedInsideMenu = event.target.closest(".navbar-container");

  if (!clickedInsideMenu && mainNav && mainNav.classList.contains("active")) {
    mainNav.classList.remove("active");

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
    }

    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      dropdown.classList.remove("open");
    });

    dropdownToggles.forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });
  }
});

/* =========================
   PLAYER DE VÍDEO PREMIUM
========================= */
const video = document.getElementById("reality-video");
const playCenterBtn = document.getElementById("video-play");
const toggleBtn = document.getElementById("video-toggle");
const muteBtn = document.getElementById("video-mute");
const volumeInput = document.getElementById("video-volume");
const speedSelect = document.getElementById("video-speed");
const progress = document.getElementById("video-progress");
const progressBar = document.getElementById("video-progress-bar");
const card = document.querySelector(".video-card");

if (
  video &&
  playCenterBtn &&
  toggleBtn &&
  muteBtn &&
  volumeInput &&
  speedSelect &&
  progress &&
  progressBar &&
  card
) {
  const playIcon = '<i class="bi bi-play-fill"></i>';
  const pauseIcon = '<i class="bi bi-pause-fill"></i>';
  const muteIcon = '<i class="bi bi-volume-mute-fill"></i>';
  const lowVolumeIcon = '<i class="bi bi-volume-down-fill"></i>';
  const highVolumeIcon = '<i class="bi bi-volume-up-fill"></i>';

  const updatePlayUI = () => {
    if (video.paused) {
      card.classList.remove("playing");
      playCenterBtn.style.opacity = "1";
      playCenterBtn.style.pointerEvents = "auto";
      playCenterBtn.innerHTML = playIcon;
      toggleBtn.innerHTML = playIcon;
      toggleBtn.setAttribute("aria-label", "Reproduzir vídeo");
    } else {
      card.classList.add("playing");
      playCenterBtn.style.opacity = "0";
      playCenterBtn.style.pointerEvents = "none";
      toggleBtn.innerHTML = pauseIcon;
      toggleBtn.setAttribute("aria-label", "Pausar vídeo");
    }
  };

  const updateMuteUI = () => {
    if (video.muted || video.volume === 0) {
      muteBtn.innerHTML = muteIcon;
      muteBtn.setAttribute("aria-label", "Ativar som");
    } else if (video.volume <= 0.5) {
      muteBtn.innerHTML = lowVolumeIcon;
      muteBtn.setAttribute("aria-label", "Desativar som");
    } else {
      muteBtn.innerHTML = highVolumeIcon;
      muteBtn.setAttribute("aria-label", "Desativar som");
    }
  };

  const updateProgressUI = () => {
    if (!video.duration || Number.isNaN(video.duration)) {
      progressBar.style.width = "0%";
      return;
    }

    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = `${percent}%`;
  };

  playCenterBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayUI();
  });

  toggleBtn.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    updatePlayUI();
  });

  muteBtn.addEventListener("click", () => {
    video.muted = !video.muted;

    if (!video.muted && Number(volumeInput.value) === 0) {
      video.volume = 0.5;
      volumeInput.value = "0.5";
    }

    updateMuteUI();
  });

  volumeInput.addEventListener("input", () => {
    const value = Number(volumeInput.value);
    video.volume = value;
    video.muted = value === 0;
    updateMuteUI();
  });

  speedSelect.addEventListener("change", () => {
    video.playbackRate = Number(speedSelect.value);
  });

  video.addEventListener("timeupdate", updateProgressUI);
  video.addEventListener("loadedmetadata", updateProgressUI);
  video.addEventListener("play", updatePlayUI);
  video.addEventListener("pause", updatePlayUI);

  progress.addEventListener("click", (event) => {
    const rect = progress.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;

    if (video.duration && !Number.isNaN(video.duration)) {
      video.currentTime = percentage * video.duration;
    }
  });

  video.volume = 0;
  video.muted = true;
  video.playbackRate = 1;

  updatePlayUI();
  updateMuteUI();
  updateProgressUI();
}



/*midia kit*/

const counters = document.querySelectorAll(".numero");

function animateCounter(el) {
  const target = +el.getAttribute("data-target");
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const value = Math.floor(progress * target);

    el.textContent = formatNumber(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "k";
  return num;
}

// Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        counters.forEach((counter) => {
          counter.textContent = "0";
          animateCounter(counter);
        });
      }
    });
  },
  {
    threshold: 0.4, // ativa quando 40% da seção aparece
  }
);

// observa a seção inteira
const section = document.querySelector("#midia-kit");
observer.observe(section);

counters.forEach((counter, index) => {
  setTimeout(() => {
    counter.textContent = "0";
    animateCounter(counter);
  }, index * 200);
});

/*inscrição*/
const form = document.getElementById("inscricaoForm");
const statusEl = document.getElementById("formStatus");
const origemInput = document.getElementById("origem");
const iframe = document.getElementById("hidden_iframe");

let enviando = false;
let iframeInicializado = false;

if (origemInput) {
  origemInput.value = window.location.href;
}

if (iframe) {
  iframe.addEventListener("load", () => {
    if (!iframeInicializado) {
      iframeInicializado = true;
      return;
    }

    if (!enviando) return;

    const submitButton = form.querySelector("button[type='submit']");
    statusEl.textContent = "Inscrição enviada com sucesso.";
    statusEl.style.color = "#1b7f3b";

    form.reset();
    if (origemInput) {
      origemInput.value = window.location.href;
    }

    submitButton.disabled = false;
    submitButton.textContent = "Enviar inscrição";
    enviando = false;
  });
}

if (form) {
  form.addEventListener("submit", () => {
    const submitButton = form.querySelector("button[type='submit']");

    enviando = true;
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    statusEl.textContent = "Enviando inscrição...";
    statusEl.style.color = "#999";
  });
}