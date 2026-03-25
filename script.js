/* ═══════════════════════════════════════════════════
   ALAN JOHN PORTFOLIO — JavaScript
   3D Interactions, Animations, Canvas Background
═══════════════════════════════════════════════════ */

/* ── Typewriter Roles ────────────────────────────── */
const roles = [
  "Full-Stack Developer",
  "Blockchain Engineer",
  "ML Enthusiast",
  "React Developer",
  "Smart Contract Dev",
  "Problem Solver"
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

/* ── Custom Cursor ───────────────────────────────── */
const cursor = document.getElementById('cursor');
const trail  = document.getElementById('cursor-trail');
let mx = 0, my = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  trail.style.left  = mx + 'px';
  trail.style.top   = my + 'px';
});

document.querySelectorAll('a, button, .card-3d, .skill-pill').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2)';
    trail.style.transform  = 'translate(-50%,-50%) scale(1.5)';
    cursor.style.opacity   = '0.7';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    trail.style.transform  = 'translate(-50%,-50%) scale(1)';
    cursor.style.opacity   = '1';
  });
});

/* ── Navbar Scroll ───────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── Hamburger Menu ──────────────────────────────── */
const ham  = document.getElementById('hamburger');
const navL = document.querySelector('.nav-links');
ham.addEventListener('click', () => {
  navL.classList.toggle('open');
  const spans = ham.querySelectorAll('span');
  if (navL.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});
navL.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navL.classList.remove('open');
    const spans = ham.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

/* ── Intersection Observer — Reveal ─────────────── */
const reveals = document.querySelectorAll('.reveal');
const revObs  = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      const delay = parseFloat(e.target.style.animationDelay || 0) * 1000;
      setTimeout(() => e.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revObs.observe(el));

/* ── Animated Counter ────────────────────────────── */
const statNums = document.querySelectorAll('.stat-num');
const numObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-target'));
      const hasDecimal = el.hasAttribute('data-decimal');
      let current = 0;
      const step = target / 60;
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = hasDecimal
          ? current.toFixed(1)
          : Math.round(current);
        if (current >= target) clearInterval(interval);
      }, 25);
      numObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => numObs.observe(n));

/* ── 3D Tilt on Cards ─────────────────────────────── */
document.querySelectorAll('.card-3d').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `
      perspective(900px)
      rotateX(${-dy * 8}deg)
      rotateY(${dx * 8}deg)
      translateY(-8px)
      scale(1.02)
    `;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Active Nav Link on Scroll ───────────────────── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let pos = window.scrollY + 100;
  sections.forEach(sec => {
    if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nav-links a').forEach(a => {
        a.style.color = '';
      });
      const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (active) active.style.color = 'var(--text)';
    }
  });
});

/* ══════════════════════════════════════════════════
   CANVAS BACKGROUND — Particles & Connections
══════════════════════════════════════════════════ */
const canvas  = document.getElementById('bg-canvas');
const ctx     = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r  = Math.random() * 2.5 + 0.5;
    this.a  = Math.random() * 0.6 + 0.2;
    this.color = Math.random() > 0.5 ?
      `rgba(124,58,237,${this.a})` :
      `rgba(6,182,212,${this.a})`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  const count = Math.min(Math.floor((W * H) / 10000), 150);
  particles = Array.from({ length: count }, () => new Particle());
}

function drawConnections() {
  const maxDist = 130;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.25;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}

// Mouse repulsion
let mouseX = -9999, mouseY = -9999;
document.addEventListener('mousemove', e => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

function animate() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    // Mouse interaction
    const dx = p.x - mouseX;
    const dy = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      const angle = Math.atan2(dy, dx);
      const force = (100 - dist) / 100;
      p.vx += Math.cos(angle) * force * 0.08;
      p.vy += Math.sin(angle) * force * 0.08;
      // Clamp velocity
      const maxV = 3;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxV) { p.vx *= maxV / speed; p.vy *= maxV / speed; }
    }
    p.update();
    p.draw();
  });
  drawConnections();
  requestAnimationFrame(animate);
}

initParticles();
animate();

/* ── Smooth Scroll Active ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Parallax subtle on scroll ───────────────────── */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const hero = document.querySelector('.hero-content');
  const avatar = document.querySelector('.hero-avatar');
  if (hero && avatar && window.innerWidth > 900) {
    hero.style.transform = `translateY(${y * 0.15}px)`;
    avatar.style.transform = `translateY(${y * 0.08}px)`;
  }
});

/* ── Page Load Progress Bar ──────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 3px; width: 0%;
  background: linear-gradient(90deg, #7c3aed, #06b6d4);
  z-index: 99999; transition: width 0.3s ease;
  box-shadow: 0 0 8px rgba(6,182,212,0.6);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = scrollPct + '%';
});

console.log('%c Alan John Portfolio ', 'background: #7c3aed; color: white; font-size: 16px; padding: 8px 16px; border-radius: 8px; font-weight: bold;');
console.log('%c Full-Stack · Blockchain · ML', 'color: #06b6d4; font-size: 12px;');
