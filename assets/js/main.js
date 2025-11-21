
function speakText(text, lang) {
  if (!('speechSynthesis' in window)) {
    alert('El narrador no está disponible en este navegador.');
    return;
  }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang || 'es-CL';
  window.speechSynthesis.speak(utter);
}

document.addEventListener('DOMContentLoaded', () => {
  const main = document.getElementById('main-content');
  const btnVoice = document.getElementById('btn-voice');
  if (btnVoice && main) {
    btnVoice.addEventListener('click', () => {
      const text = main.innerText.replace(/\s+/g, ' ').trim();
      speakText(text, 'es-CL');
    });
  }

  document.querySelectorAll('.btn-tts').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-tts') || '';
      speakText(text, 'es-CL');
    });
  });

  const btnTheme = document.getElementById('btn-theme');
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      document.documentElement.classList.toggle('light');
    });
  }

  let fontScale = 1;
  const inc = document.getElementById('btn-font-inc');
  const dec = document.getElementById('btn-font-dec');
  function applyFont() {
    document.documentElement.style.fontSize = (fontScale * 100) + '%';
  }
  if (inc) {
    inc.addEventListener('click', () => {
      fontScale = Math.min(1.6, fontScale + 0.1);
      applyFont();
    });
  }
  if (dec) {
    dec.addEventListener('click', () => {
      fontScale = Math.max(0.8, fontScale - 0.1);
      applyFont();
    });
  }

  const btnLang = document.getElementById('btn-lang');
  const langSelect = document.getElementById('lang-select');
  if (btnLang && langSelect) {
    btnLang.addEventListener('click', () => {
      langSelect.style.display = langSelect.style.display === 'flex' ? 'none' : 'flex';
    });
    langSelect.querySelectorAll('button[data-lang]').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        document.documentElement.setAttribute('lang', lang);
        langSelect.style.display = 'none';
      });
    });
  }
});
