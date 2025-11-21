
const body = document.body;
const themeBtn = document.getElementById("btn-theme");
const fontInc = document.getElementById("btn-font-inc");
const fontDec = document.getElementById("btn-font-dec");
const voiceBtn = document.getElementById("btn-voice");
const searchBtn = document.getElementById("btn-search");
const homeBtn = document.getElementById("btn-home");
const guideBtn = document.getElementById("btn-guide");
const langBtn = document.getElementById("btn-lang");
const langMenu = document.getElementById("lang-menu");
const searchDialog = document.getElementById("search-dialog");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const searchClose = document.getElementById("search-close");

let fontScale = 1;

// Tema
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
  });
}

// Fuente
function updateFontScale() {
  document.documentElement.style.setProperty("--font-scale", fontScale.toString());
}
if (fontInc) {
  fontInc.addEventListener("click", () => {
    fontScale = Math.min(1.3, fontScale + 0.05);
    updateFontScale();
  });
}
if (fontDec) {
  fontDec.addEventListener("click", () => {
    fontScale = Math.max(0.85, fontScale - 0.05);
    updateFontScale();
  });
}

// Narrador
function speakText(text, langCode = "es-CL") {
  if (!("speechSynthesis" in window)) {
    alert("El narrador no está disponible en este navegador.");
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langCode;
  window.speechSynthesis.speak(u);
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    const main = document.getElementById("main-content");
    if (!main) return;
    const lang = document.documentElement.lang || "es";
    const voiceLang = lang === "en" ? "en-US" : "es-CL";
    speakText(main.innerText.trim(), voiceLang);
  });
}

// Home
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// Guía (scroll a sección principal)
if (guideBtn) {
  guideBtn.addEventListener("click", () => {
    const section = document.getElementById("controles");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Búsqueda
function clearHighlights() {
  document.querySelectorAll("mark.search-hit").forEach(m => {
    const parent = m.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(m.textContent || ""), m);
    parent.normalize();
  });
}

function highlight(term) {
  clearHighlights();
  if (!term) return 0;
  const root = document.getElementById("main-content");
  if (!root) return 0;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const regex = new RegExp(term, "gi");
  let node, count = 0;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue.trim()) continue;
    const matches = node.nodeValue.match(regex);
    if (!matches) continue;
    const frag = document.createDocumentFragment();
    let last = 0;
    node.nodeValue.replace(regex, (match, index) => {
      const before = node.nodeValue.slice(last, index);
      if (before) frag.appendChild(document.createTextNode(before));
      const mark = document.createElement("mark");
      mark.className = "search-hit";
      mark.textContent = match;
      frag.appendChild(mark);
      last = index + match.length;
      count++;
      return match;
    });
    const after = node.nodeValue.slice(last);
    if (after) frag.appendChild(document.createTextNode(after));
    node.parentNode.replaceChild(frag, node);
  }
  return count;
}

if (searchBtn && searchDialog) {
  searchBtn.addEventListener("click", () => {
    searchDialog.classList.add("show");
    searchDialog.setAttribute("aria-hidden", "false");
    if (searchInput) {
      searchInput.value = "";
      searchResults.textContent = "";
      setTimeout(() => searchInput.focus(), 50);
    }
  });
}
if (searchClose && searchDialog) {
  searchClose.addEventListener("click", () => {
    searchDialog.classList.remove("show");
    searchDialog.setAttribute("aria-hidden", "true");
    clearHighlights();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", e => {
    const term = e.target.value.trim();
    if (!term) {
      clearHighlights();
      searchResults.textContent = "";
      return;
    }
    const count = highlight(term);
    if (count) {
      searchResults.textContent = `Se encontraron ${count} coincidencias.`;
    } else {
      searchResults.textContent = "No se encontraron resultados.";
    }
  });
}

window.addEventListener("keydown", e => {
  if (e.key === "Escape" && searchDialog && searchDialog.classList.contains("show")) {
    searchDialog.classList.remove("show");
    searchDialog.setAttribute("aria-hidden", "true");
    clearHighlights();
  }
});

// Idiomas
const translations = {
  es: {
    title: "Controles Oculus / Meta Quest para 6° básico",
    subtitle: "Sala SEM · Estimulación sensorial y tecnológica",
    hero_title: "Conoce los controles del visor",
    hero_intro:
      "En esta guía aprenderás dónde están los botones de los controles Oculus / Meta Quest y para qué sirven, para usar el visor de forma segura y tranquila en la Sala SEM.",
    hero_time:
      "Tiempo máximo recomendado: 10 a 20 minutos por sesión, siempre acompañado de un adulto.",
    btn_start: "✨ Ver botones principales"
  },
  en: {
    title: "Oculus / Meta Quest controllers for 6th grade",
    subtitle: "SEM Room · Sensory and technology lab",
    hero_title: "Get to know the controllers",
    hero_intro:
      "In this guide you will learn where the buttons of the Oculus / Meta Quest controllers are and what they do, so you can use the headset safely and calmly in the SEM Room.",
    hero_time:
      "Recommended time: 10 to 20 minutes per session, always with an adult.",
    btn_start: "✨ See main buttons"
  },
  arn: {
    title: "Oculus / Meta Quest: kontrol nütram 6°",
    subtitle: "Sala SEM · kimün ka teknologi",
    hero_title: "Eymi kimay kontrol mew",
    hero_intro:
      "Tüfachi guía mülelu kimafuy chumgechi mülelu kontrol Oculus / Meta Quest mew, chum müley ta botón ka chum mülelu ta eymi kimün.",
    hero_time:
      "Rakiduam: 10–20 minuto mew kimgechi kulliñ mew, fücha/fücha kimelfün mew.",
    btn_start: "✨ Pewkay ta botón"
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang === "arn" ? "es" : lang;
  document.querySelectorAll("[data-i18n-key]").forEach(el => {
    const key = el.getAttribute("data-i18n-key");
    if (dict[key]) el.textContent = dict[key];
  });
}

if (langBtn && langMenu) {
  langBtn.addEventListener("click", () => {
    const open = langMenu.classList.contains("show");
    langMenu.classList.toggle("show");
    langBtn.setAttribute("aria-expanded", String(!open));
  });
  langMenu.addEventListener("click", e => {
    const li = e.target.closest("li[data-lang]");
    if (!li) return;
    const lang = li.getAttribute("data-lang");
    setLanguage(lang);
    langMenu.classList.remove("show");
    langBtn.setAttribute("aria-expanded", "false");
  });
  document.addEventListener("click", e => {
    if (!langMenu.contains(e.target) && e.target !== langBtn) {
      langMenu.classList.remove("show");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });
}

setLanguage("es");
