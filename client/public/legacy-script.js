// ══════════════════════════════════════════════════
//  STRNG — shared.js  (header, footer, particles, theme)
// ══════════════════════════════════════════════════

function buildHeader(activePage, basePath = '') {
  const pages = [
    { href: `${basePath}index.html`,                    label: 'Inicio' },
    { href: `${basePath}pages/rutinas.html`,          label: 'Rutinas' },
    { href: `${basePath}pages/alimentacion.html`,     label: 'Alimentación' },
    { href: `${basePath}pages/suplementacion.html`,   label: 'Suplementación' },
    { href: `${basePath}pages/implementos.html`,      label: 'Implementos' },
    { href: `${basePath}pages/IMC.html`,              label: 'Calc. IMC' },
    { href: `${basePath}pages/tienda.html`,           label: '🛒 Tienda' },
    { href: `${basePath}pages/rastreo.html`,          label: '📦 Rastrear' },
  ];
  const links = pages.map(p => {
    const isActive = p.label === activePage;
    return `<li><a href="${p.href}"${isActive ? ' class="active"' : ''}>${p.label}</a></li>`;
  }).join('');

  return `
<header>
  <div class="header-inner">
    <a href="${basePath}index.html" class="logo-wrap">
      <img src="${basePath}assets/images/logo.png" alt="STRNG" class="logo-img" onerror="this.style.display='none'">
      <span class="logo-text">STRNG</span>
    </a>
    <nav>
      <ul class="nav-links" id="navLinks">${links}</ul>
    </nav>
    <div class="header-controls">
      <button id="themeBtn">☀ CLARO</button>
      <button class="hamburger" id="hamburger" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;
}

function buildTicker(msgs) {
  const doubled = [...msgs, ...msgs];
  const spans = doubled.map((m, i) => `<span>${m}</span>${i < doubled.length - 1 ? '<span class="dot">•</span>' : ''}`).join('');
  return `<div class="ticker"><div class="ticker-inner">${spans}</div></div>`;
}

function buildFooter(basePath = '') {
  return `
<footer>
  <div class="footer-inner">
    <div class="footer-brand">
      <span class="logo-text">STRNG</span>
      <p>Entrenamiento, nutrición y salud. Sin excusas, sin atajos.</p>
    </div>
    <div class="footer-col">
      <h4>Páginas</h4>
      <ul>
        <li><a href="${basePath}index.html">Inicio</a></li>
        <li><a href="${basePath}pages/rutinas.html">Rutinas</a></li>
        <li><a href="${basePath}pages/alimentacion.html">Alimentación</a></li>
        <li><a href="${basePath}pages/suplementacion.html">Suplementación</a></li>
        <li><a href="${basePath}pages/implementos.html">Implementos GYM</a></li>
        <li><a href="${basePath}pages/IMC.html">Calculadora IMC</a></li>
        <li><a href="${basePath}pages/tienda.html">🛒 Tienda</a></li>
        <li><a href="${basePath}pages/rastreo.html">📦 Rastrear Pedido</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h4>Recursos</h4>
      <ul>
        <li><a href="https://www.acefitness.org" target="_blank" rel="noopener">ACE Fitness</a></li>
        <li><a href="https://www.bodybuilding.com/exercises/" target="_blank" rel="noopener">Ejercicios BB.com</a></li>
        <li><a href="https://www.healthline.com/nutrition" target="_blank" rel="noopener">Healthline Nutrición</a></li>
        <li><a href="mailto:contacto@strngfit.com">contacto@strngfit.com</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 STRNG. Todos los derechos reservados.</p>
    <p>Hecho para los que no se rinden.</p>
  </div>
</footer>`;
}

// ── INIT ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Theme
  const themeBtn = document.getElementById('themeBtn');
  const saved    = localStorage.getItem('strng-theme');
  const apply = (theme) => {
    if (theme === 'light') {
      document.body.classList.add('light');
      if (themeBtn) themeBtn.textContent = '☾ OSCURO';
    } else {
      document.body.classList.remove('light');
      if (themeBtn) themeBtn.textContent = '☀ CLARO';
    }
  };
  apply(saved || 'dark');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      const t = isLight ? 'light' : 'dark';
      localStorage.setItem('strng-theme', t);
      themeBtn.textContent = isLight ? '☾ OSCURO' : '☀ CLARO';
    });
  }

  // Hamburger
  const ham  = document.getElementById('hamburger');
  const nav  = document.getElementById('navLinks');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !nav.contains(e.target)) nav.classList.remove('open');
    });
  }

  // External link confirm
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    a.addEventListener('click', e => {
      if (!confirm('Vas a salir del sitio. ¿Continuar?')) e.preventDefault();
    });
  });

  // Scroll fade-in
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));

  // Particle canvas
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });

    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.3 + 0.2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.05),
      a: Math.random() * 0.5 + 0.1,
    }));

    (function draw() {
      ctx.clearRect(0, 0, W, H);
      const isLight = document.body.classList.contains('light');
      pts.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? `rgba(180,30,20,${p.a * 0.5})` : `rgba(214,48,49,${p.a})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < -5) p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
      });
      requestAnimationFrame(draw);
    })();
  }

  // Stat counter animation
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      let cur = 0;
      const step = Math.ceil(target / 55);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        el.textContent = cur + suffix;
      }, 18);
      cObs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cObs.observe(el));

  // IMC
  const form = document.getElementById('imcForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const peso   = parseFloat(document.getElementById('peso').value);
      const altura = parseFloat(document.getElementById('altura').value);
      if (!peso || !altura || altura <= 0) return;

      const imc = peso / (altura * altura);
      const numEl  = document.getElementById('imcNum');
      const statEl = document.getElementById('imcStatus');
      const msgEl  = document.getElementById('imcMsg');

      let status, msg, color;
      if      (imc < 18.5) { status = 'BAJO PESO';  color = '#3498db'; msg = 'Enfócate en ganar masa muscular. Aumenta calorías con proteína de calidad.'; }
      else if (imc < 25)   { status = 'NORMAL';      color = '#2ecc71'; msg = 'Estás en tu rango saludable. Mantén la disciplina y optimiza tu composición.'; }
      else if (imc < 30)   { status = 'SOBREPESO';   color = '#f39c12'; msg = 'El déficit calórico y el entrenamiento de fuerza son tus mejores aliados ahora.'; }
      else                  { status = 'OBESIDAD';    color = '#d63031'; msg = 'Es momento de actuar. Consulta un profesional y da el primer paso hoy.'; }

      if (numEl)  { numEl.textContent = imc.toFixed(1); numEl.style.color = color; }
      if (statEl) { statEl.textContent = status; }
      if (msgEl)  { msgEl.textContent = msg; }

      // highlight table
      document.querySelectorAll('.imc-row').forEach(r => r.classList.remove('active-row'));
      const map = { low: imc < 18.5, normal: imc >= 18.5 && imc < 25, over: imc >= 25 && imc < 30, obese: imc >= 30 };
      document.querySelectorAll('.imc-row').forEach(r => {
        const cl = [...r.classList].find(c => map[c]);
        if (cl && map[cl]) r.classList.add('active-row');
      });
    });
  }

  // ── TEMA 21: Audio de fondo ──────────────────────
const bgAudio  = document.getElementById('bgAudio');
const audioBtn = document.getElementById('audioBtn');
if (bgAudio && audioBtn) {
  bgAudio.volume = 0.04;
  let playing = false;

  audioBtn.addEventListener('click', () => {
    if (playing) {
      bgAudio.pause();
      audioBtn.textContent       = '🔇';
      audioBtn.style.borderColor = '';
      audioBtn.style.color       = '#aaa';
    } else {
      bgAudio.play().catch(() => {});
      audioBtn.textContent       = '🔊';
      audioBtn.style.borderColor = '#d63031';
      audioBtn.style.color       = '#fff';
    }
    playing = !playing;
  });
}
  // ── AGENTE SECRETO STRNG ──────────────────────────────────────────
  let condicion1_cumplida = false; // Usuario ingresó peso
  let condicion2_cumplida = false; // Usuario ingresó altura
  let condicion3_cumplida = false; // Usuario calculó su IMC
  let agente_activado     = false; // Evita que se active más de una vez

  function verificarMision() {
    if (condicion1_cumplida && condicion2_cumplida && condicion3_cumplida && !agente_activado) {
      agente_activado = true;

      // 1. Cambiar el estilo del <h1> principal
      const titulo = document.querySelector('h1');
      if (titulo) {
        titulo.style.backgroundColor = '#FFD700';
        titulo.style.color           = '#000000';
        titulo.style.padding         = '8px 16px';
        titulo.style.borderRadius    = '6px';
        titulo.style.transition      = 'all 0.5s ease';
      }

      // 2. Crear el párrafo secreto y colocarlo justo después del <h1>
      const mensaje = document.createElement('p');
      mensaje.textContent = 'Misión Cumplida: Agente DOM activado.';
      mensaje.style.fontWeight  = 'bold';
      mensaje.style.color       = '#15803d';
      mensaje.style.marginTop   = '10px';
      mensaje.style.fontSize    = '1rem';
      mensaje.style.textAlign   = 'center';
      mensaje.style.animation   = 'fadeIn 0.8s ease';

      if (titulo && titulo.parentNode) {
        titulo.parentNode.insertBefore(mensaje, titulo.nextSibling);
      }
    }
  }

  // Condición 1 — el usuario escribe algo en el campo de peso
  const campoPeso = document.getElementById('peso');
  if (campoPeso) {
    campoPeso.addEventListener('input', function () {
      if (this.value.trim() !== '') {
        condicion1_cumplida = true;
        verificarMision();
      }
    });
  }

  // Condición 2 — el usuario escribe algo en el campo de altura
  const campoAltura = document.getElementById('altura');
  if (campoAltura) {
    campoAltura.addEventListener('input', function () {
      if (this.value.trim() !== '') {
        condicion2_cumplida = true;
        verificarMision();
      }
    });
  }

  // Condición 3 — el usuario envía el formulario (clic en CALCULAR IMC)
  const formulario = document.getElementById('imcForm');
  if (formulario) {
    formulario.addEventListener('submit', function () {
      condicion3_cumplida = true;
      verificarMision();
    });
  }
});
