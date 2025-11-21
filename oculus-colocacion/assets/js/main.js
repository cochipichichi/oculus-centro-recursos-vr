// Tema claro/oscuro
const body = document.body;
const themeBtn = document.getElementById("btn-theme");
const fontInc = document.getElementById("btn-font-inc");
const fontDec = document.getElementById("btn-font-dec");
const voiceBtn = document.getElementById("btn-voice");
const guideBtn = document.getElementById("btn-guide");
const searchBtn = document.getElementById("btn-search");
const homeBtn = document.getElementById("btn-home");
const langBtn = document.getElementById("btn-lang");
const langMenu = document.getElementById("lang-menu");
const searchDialog = document.getElementById("search-dialog");
const searchInput = document.getElementById("search-input");
const searchClose = document.getElementById("search-close");
const searchResults = document.getElementById("search-results");

let fontScale = 1;

// Theme toggle
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    body.classList.toggle("light-theme");
  });
}

// Font size controls
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

// Narrador simple
function speakText(text, langCode = "es-CL") {
  if (!("speechSynthesis" in window)) {
    alert("El narrador no está disponible en este navegador.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langCode;
  window.speechSynthesis.speak(utterance);
}

if (voiceBtn) {
  voiceBtn.addEventListener("click", () => {
    const main = document.getElementById("main-content");
    if (main) {
      const lang = document.documentElement.lang || "es";
      const voiceLang = lang === "en" ? "en-US" : "es-CL";
      speakText(main.innerText.trim(), voiceLang);
    }
  });
}

// Guía (scroll a pasos)
if (guideBtn) {
  guideBtn.addEventListener("click", () => {
    const pasos = document.getElementById("pasos");
    if (pasos) {
      pasos.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// Home
if (homeBtn) {
  homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// Búsqueda básica en la página
function clearHighlights() {
  document.querySelectorAll("mark.search-hit").forEach((m) => {
    const parent = m.parentNode;
    parent.replaceChild(document.createTextNode(m.textContent || ""), m);
    parent.normalize();
  });
}

function highlightMatches(term) {
  clearHighlights();
  if (!term) return;
  const walker = document.createTreeWalker(
    document.getElementById("main-content"),
    NodeFilter.SHOW_TEXT,
    null
  );
  const regex = new RegExp(term, "gi");
  let node;
  let count = 0;
  while ((node = walker.nextNode())) {
    if (!node.nodeValue.trim()) continue;
    const matches = node.nodeValue.match(regex);
    if (matches) {
      const frag = document.createDocumentFragment();
      let lastIndex = 0;
      node.nodeValue.replace(regex, (match, index) => {
        const before = node.nodeValue.slice(lastIndex, index);
        if (before) frag.appendChild(document.createTextNode(before));
        const mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = match;
        frag.appendChild(mark);
        lastIndex = index + match.length;
        count++;
        return match;
      });
      const after = node.nodeValue.slice(lastIndex);
      if (after) frag.appendChild(document.createTextNode(after));
      node.parentNode.replaceChild(frag, node);
    }
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
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.trim();
    if (!term) {
      clearHighlights();
      searchResults.textContent = "";
      return;
    }
    const count = highlightMatches(term);
    if (count) {
      searchResults.textContent = `Se encontraron ${count} coincidencias.`;
    } else {
      searchResults.textContent = "No se encontraron resultados.";
    }
  });
}

// Cerrar diálogo con ESC
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchDialog && searchDialog.classList.contains("show")) {
    searchDialog.classList.remove("show");
    searchDialog.setAttribute("aria-hidden", "true");
    clearHighlights();
  }
});

// Idiomas: ES / EN / ARN (mapudungun básico)
const translations = {
  es: {
    title: "Cómo colocar tu visor Oculus / Meta Quest",
    subtitle: "Guía sencilla para la Sala SEM · PIE",
    hero_title: "Colocación segura del visor",
    hero_intro:
      "Esta guía fue creada para la Sala SEM del Programa de Integración Escolar (PIE), para que cada estudiante pueda usar el visor de realidad virtual con seguridad, calma y mucha ayuda visual.",
    btn_start: "✨ Ver pasos ahora",
    before_start_title: "Antes de comenzar",
    before_start_1: "Revisa que el visor esté limpio (especialmente las lentes).",
    before_start_2: "Comprueba que las correas estén sueltas para entrar con facilidad.",
    before_start_3: "Asegura un espacio libre de mesas, sillas u obstáculos.",
    before_start_4: "Si usas lentes ópticos, consulta al adulto responsable cómo colocarlos.",
    pie_context_title: "Pensado para el PIE",
    pie_context_text:
      "Esta guía fue diseñada para niñas y niños que aprenden de maneras diversas. Incluye imágenes, pocos textos, narrador y controles de accesibilidad para apoyar la comprensión paso a paso.",
    hero_img_label:
      "Aquí puedes agregar una foto de un estudiante (de espaldas o avatar) usando el visor, con autorización de imagen.",
    steps_title: "Paso a paso: cómo colocar el visor",
    steps_intro:
      "Puedes seguir estos pasos con la ayuda de Belén u otro adulto. Lee primero el texto y luego mira la imagen de apoyo."
  },
  en: {
    title: "How to wear your Oculus / Meta Quest headset",
    subtitle: "Simple guide for the SEM Room · PIE program",
    hero_title: "Safe headset placement",
    hero_intro:
      "This guide was created for the SEM Room of the Inclusive Education Program (PIE) so that every student can use the VR headset with safety, calm and strong visual support.",
    btn_start: "✨ See the steps",
    before_start_title: "Before you start",
    before_start_1: "Check that the headset is clean (especially the lenses).",
    before_start_2: "Make sure the straps are loose so your head fits comfortably.",
    before_start_3: "Create a clear space without tables, chairs or obstacles.",
    before_start_4: "If you use glasses, ask the adult how to place them with the headset.",
    pie_context_title: "Designed for the PIE program",
    pie_context_text:
      "This guide was designed for children who learn in diverse ways. It includes images, short texts, narration and accessibility controls to support understanding step by step.",
    hero_img_label:
      "You can add a photo of a student (from the back or as an avatar) using the headset, with image permission.",
    steps_title: "Step by step: how to put on the headset",
    steps_intro:
      "You can follow these steps with help from Belén or another adult. First read the text and then look at the support image."
  },
  arn: {
    // Nota: texto base en español, rótulo como borrador mapudungun.
    title: "Küme rakiduam: kimün Oculus / Meta Quest",
    subtitle: "Tayiñ guía mülelu Sala SEM · Programa PIE",
    hero_title: "Küme trawün wiño: visor",
    hero_intro:
      "Tüfachi guía mülelu pu pichikeche ta Sala SEM mew, tañi küme tripantu, kimün ka ülkantun. Feychi VR visor müley tüfachi che ñi küme rakiduam.",
    btn_start: "✨ Püle paso kintun",
    before_start_title: "Tripan mew",
    before_start_1: "Peukay ta visor mülelu llipüiñ, feychi lente kümeke.",
    before_start_2: "Kimlay küpal mew correas, femngechi fachi mañum.",
    before_start_3: "Tripan mew kimfal müten, müley küme rüpü, kintuafuy mesa, silla.",
    before_start_4: "Kümelkay ta kimün mew feychi fücha/fücha ñi gülam, tami anteojo mew.",
    pie_context_title: "PIE pichi keche mew",
    pie_context_text:
      "Tüfachi guía mülelu pu pichikeche tañi mülen ñi dungu küme, femngechi traripel, trürke dungu, narrador ka küme zugun mew.",
    hero_img_label:
      "Tüfachi trokiñ mew müley ta foto pichikeche (weku mew) ka avatar mew, visor mülelu. Kintulake feychi permiso."
  }
};

function setLanguage(lang) {
  const dict = translations[lang];
  if (!dict) return;
  document.documentElement.lang = lang === "arn" ? "es" : lang; // síntesis no soporta bien arn
  document.querySelectorAll("[data-i18n-key]").forEach((el) => {
    const key = el.getAttribute("data-i18n-key");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

if (langBtn && langMenu) {
  langBtn.addEventListener("click", () => {
    const isOpen = langMenu.classList.contains("show");
    langMenu.classList.toggle("show");
    langBtn.setAttribute("aria-expanded", String(!isOpen));
  });

  langMenu.addEventListener("click", (e) => {
    const li = e.target.closest("li[data-lang]");
    if (!li) return;
    const lang = li.getAttribute("data-lang");
    setLanguage(lang);
    langMenu.classList.remove("show");
    langBtn.setAttribute("aria-expanded", "false");
  });

  // Cerrar menú lenguaje al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!langMenu.contains(e.target) && e.target !== langBtn) {
      langMenu.classList.remove("show");
      langBtn.setAttribute("aria-expanded", "false");
    }
  });
}

// Inicial
setLanguage("es");
