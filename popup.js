const translations = {
  pt: {
    title: 'Conversor de Texto',
    subtitle: 'Transforme seu texto em segundos',
    inputPlaceholder: 'Cole ou digite seu texto aqui...',
    outputPlaceholder: 'O texto convertido aparecerá aqui...',
    charCount: 'Caracteres: {count}',
    upper: 'MAIÚSCULAS',
    lower: 'minúsculas',
    invert: 'Inverter Caso',
    titleCase: 'Caso de Título',
    sentence: 'Caso de Sentença',
    clear: 'Limpar Tudo',
    copy: 'Copiar',
    toast: 'Texto copiado!'
  },
  en: {
    title: 'Text Converter',
    subtitle: 'Transform your text in seconds',
    inputPlaceholder: 'Paste or type your text here...',
    outputPlaceholder: 'Converted text will appear here...',
    charCount: 'Characters: {count}',
    upper: 'UPPERCASE',
    lower: 'lowercase',
    invert: 'Invert Case',
    titleCase: 'Title Case',
    sentence: 'Sentence Case',
    clear: 'Clear All',
    copy: 'Copy',
    toast: 'Copied to clipboard!'
  },
  es: {
    title: 'Convertidor de Texto',
    subtitle: 'Transforma tu texto en segundos',
    inputPlaceholder: 'Pega o escribe tu texto aquí...',
    outputPlaceholder: 'El texto aparecerá aquí...',
    charCount: 'Caracteres: {count}',
    upper: 'MAYÚSCULAS',
    lower: 'minúsculas',
    invert: 'Invertir Caso',
    titleCase: 'Caso de Título',
    sentence: 'Caso de Oración',
    clear: 'Limpiar Todo',
    copy: 'Copiar',
    toast: '¡Copiado!'
  },
  fr: {
    title: 'Convertisseur de Texte',
    subtitle: 'Transformez votre texte en secondes',
    inputPlaceholder: 'Collez ou tapez votre texte ici...',
    outputPlaceholder: 'Le texte apparaîtra ici...',
    charCount: 'Caractères: {count}',
    upper: 'MAJUSCULES',
    lower: 'minuscules',
    invert: 'Inverser la Casse',
    titleCase: 'Casse de Titre',
    sentence: 'Casse de Phrase',
    clear: 'Effacer Tout',
    copy: 'Copier',
    toast: 'Copié !'
  }
};

const input = document.getElementById('input');
const output = document.getElementById('output');
const charCount = document.getElementById('char-count');
const toast = document.getElementById('toast');
const themeToggle = document.querySelector('.theme-toggle');
const copyBtn = document.querySelector('.copy-btn');
const langSelect = document.getElementById('lang-select');

// Pix Support
const modalPix = document.getElementById('modal-pix');
const btnPix = document.getElementById('btn-pix');
const btnCloseModal = document.querySelector('.close-modal');
const btnCopyPix = document.getElementById('copy-pix');
const pixKey = document.getElementById('pix-key');

function updateLanguage(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
  const trans = translations[lang];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (trans[key]) el.textContent = trans[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (trans[key]) {
      el.placeholder = trans[key];
      if (el.tagName === 'DIV') el.setAttribute('data-placeholder', trans[key]);
    }
  });

  const count = input.value.length;
  charCount.textContent = trans.charCount.replace('{count}', count);
  output.setAttribute('data-placeholder', trans.outputPlaceholder);
}

const conversions = {
  upper: text => text.toUpperCase(),
  lower: text => text.toLowerCase(),
  invert: text => text.split('').map(c => 
    c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join(''),
  title: text => text.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase()),
  sentence: text => {
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
};

function autoConvert() {
  const text = input.value.trim();
  if (!text) {
    output.textContent = '';
    updateCopyBtn();
    return;
  }

  if (text === text.toUpperCase()) {
    output.textContent = text.toLowerCase();
  } else if (text === text.toLowerCase()) {
    output.textContent = text.toUpperCase();
  } else {
    output.textContent = conversions.invert(text);
  }
  updateCopyBtn();
}

function updateCopyBtn() {
  if (output.textContent.trim()) {
    copyBtn.style.opacity = '1';
    copyBtn.style.pointerEvents = 'auto';
  } else {
    copyBtn.style.opacity = '0.5';
    copyBtn.style.pointerEvents = 'none';
  }
}

function convert(action) {
  const text = input.value.trim();
  if (!text && action !== 'clear') return;
  
  if (action === 'clear') {
    input.value = '';
    output.textContent = '';
    const lang = document.documentElement.getAttribute('data-lang');
    const trans = translations[lang];
    charCount.textContent = trans.charCount.replace('{count}', 0);
    updateCopyBtn();
    return;
  }
  
  if (action === 'copy') {
    if (!output.textContent.trim()) return;
    navigator.clipboard.writeText(output.textContent).then(() => {
      showToast();
    });
    return;
  }

  output.textContent = conversions[action](text);
  updateCopyBtn();
}

function showToast() {
  const lang = document.documentElement.getAttribute('data-lang');
  toast.textContent = translations[lang].toast;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Event Listeners
langSelect.addEventListener('change', (e) => {
  const lang = e.target.value;
  chrome.storage.local.set({ lang });
  updateLanguage(lang);
});

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  chrome.storage.local.set({ theme: next });
});

input.addEventListener('input', () => {
  const lang = document.documentElement.getAttribute('data-lang');
  const trans = translations[lang];
  charCount.textContent = trans.charCount.replace('{count}', input.value.length);
  autoConvert();
});

document.querySelectorAll('[data-action]').forEach(btn => {
  btn.addEventListener('click', () => convert(btn.dataset.action));
});

// Pix Modal Logic
btnPix.addEventListener('click', () => {
  modalPix.classList.add('show');
});

btnCloseModal.addEventListener('click', () => {
  modalPix.classList.remove('show');
});

window.addEventListener('click', (e) => {
  if (e.target === modalPix) {
    modalPix.classList.remove('show');
  }
});

btnCopyPix.addEventListener('click', () => {
  navigator.clipboard.writeText(pixKey.textContent).then(() => {
    const originalIcon = btnCopyPix.innerHTML;
    btnCopyPix.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    btnCopyPix.style.background = '#10b981';
    
    setTimeout(() => {
      btnCopyPix.innerHTML = originalIcon;
      btnCopyPix.style.background = '';
    }, 2000);

    // Also show global toast
    showToast();
  });
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['lang', 'theme'], (result) => {
    const lang = result.lang || 'pt';
    const theme = result.theme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    langSelect.value = lang;
    updateLanguage(lang);
    
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    updateCopyBtn();
  });
});
