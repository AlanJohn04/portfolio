/* ════════════════════════════════════════════════
   ALAN JOHN PORTFOLIO  ·  script.js
   Creative Mints Bento Interactions
 ════════════════════════════════════════════════ */

/* ── Theme Switcher (Persistent LocalStorage) ─── */
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load stored theme
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  body.classList.add('dark-theme');
} else {
  body.classList.remove('dark-theme');
}

// Toggle listener
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    // Notify particle system to update colors
    if (typeof updateParticleColors === 'function') {
      updateParticleColors();
    }
  });
}

/* ── Scroll Progress Bar ──────────────────────── */
const bar = document.createElement('div');
bar.id = 'progress-bar';
body.prepend(bar);

window.addEventListener('scroll', () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  bar.style.width = percentage + '%';
}, { passive: true });

/* ── Custom Hover Cursor ───────────────────────── */
const cur = document.getElementById('cur');
let cx = 0, cy = 0;
document.addEventListener('mousemove', e => {
  cx = e.clientX;
  cy = e.clientY;
  if (cur) {
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
  }
}, { passive: true });

document.querySelectorAll('a, button, .bento-card, .proj-card, .skill-pills-list span, .contact-item-link').forEach(el => {
  el.addEventListener('mouseenter', () => body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => body.classList.remove('cursor-hover'));
});

/* ── Navbar Scroll Effect ──────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (nav) {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
}, { passive: true });

/* ── Active Navigation Link Tracking ───────────── */
const navLinks = document.querySelectorAll('.nav-center a');
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(a => a.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-center a[href="#${e.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, { threshold: 0.25 });
sections.forEach(s => sectionObserver.observe(s));

/* ── Hamburger Mobile Menu ─────────────────────── */
const ham = document.getElementById('ham');
const mobMenu = document.getElementById('mob-menu');
if (ham && mobMenu) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobMenu.classList.toggle('open');
    body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
  });
  
  document.querySelectorAll('.mob-link, .mob-hire').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      mobMenu.classList.remove('open');
      body.style.overflow = '';
    });
  });
}

/* ── Smooth Scroll Offset ──────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const targetId = a.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 70;
      const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - navHeight - 15,
        behavior: 'smooth'
      });
    }
  });
});

/* ── Stat Metric Counters ──────────────────────── */
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const targetValue = parseFloat(el.dataset.target);
    const hasDecimal = el.hasAttribute('data-decimal');
    let currentValue = 0;
    const steps = 40;
    const stepIncrement = targetValue / steps;
    
    const countTimer = setInterval(() => {
      currentValue = Math.min(currentValue + stepIncrement, targetValue);
      el.textContent = hasDecimal ? currentValue.toFixed(2) : Math.round(currentValue);
      if (currentValue >= targetValue) {
        clearInterval(countTimer);
      }
    }, 25);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.dash-num').forEach(el => statObserver.observe(el));

/* ── Typewriter Console Effect ─────────────────── */
const roles = [
  'Full-Stack Developer',
  'Blockchain Engineer',
  'ML Specialist',
  'Problem Solver',
  'CUSAT AI Student'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typewriterSpan = document.getElementById('typewriter');

if (typewriterSpan) {
  (function writeLoop() {
    const currentWord = roles[roleIndex];
    typewriterSpan.textContent = isDeleting 
      ? currentWord.slice(0, --charIndex) 
      : currentWord.slice(0, ++charIndex);
      
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(writeLoop, 2000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
    setTimeout(writeLoop, isDeleting ? 40 : 80);
  })();
}

/* ── 3D Card Parallax Tilt on Hover ────────────── */
document.querySelectorAll('.bento-card, .proj-card, .cert-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    // Calculate cursor location relative to card center (-0.5 to 0.5)
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Max rotation 8 degrees
    const rotateX = -relativeY * 10;
    const rotateY = relativeX * 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Parallax Hero Canvas ──────────────────────── */
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H;
  let particles = [];
  
  function resizeCanvas() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    setupParticles();
  }, { passive: true });
  
  let primaryColor, lineColor;
  
  window.updateParticleColors = function() {
    const isDark = document.body.classList.contains('dark-theme');
    if (isDark) {
      primaryColor = 'rgba(93, 173, 226, 0.4)';  // Slate Blue
      lineColor = 'rgba(93, 173, 226, 0.08)';
    } else {
      primaryColor = 'rgba(211, 84, 0, 0.35)';   // Terracotta Orange
      lineColor = 'rgba(211, 84, 0, 0.06)';
    }
    
    particles.forEach(p => {
      p.color = primaryColor;
    });
  };
  
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.5;
      this.color = primaryColor;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  function setupParticles() {
    particles = Array.from({ length: Math.min(Math.floor(W * H / 18000), 75) }, () => new Particle());
    updateParticleColors();
  }
  
  let mouseX = -9999, mouseY = -9999;
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }, { passive: true });
  
  canvas.parentElement.addEventListener('mouseleave', () => {
    mouseX = -9999;
    mouseY = -9999;
  });
  
  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    
    particles.forEach(p => {
      // Mouse push/pull physics
      if (mouseX !== -9999) {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.vx += (dx / dist) * force * 0.015;
          p.vy += (dy / dist) * force * 0.015;
          
          // Clamp velocity
          const currentSpeed = Math.hypot(p.vx, p.vy);
          if (currentSpeed > 1.2) {
            p.vx = (p.vx / currentSpeed) * 1.2;
            p.vy = (p.vy / currentSpeed) * 1.2;
          }
        }
      }
      p.update();
      p.draw();
    });
    
    // Draw connection lines
    const lineLimit = 130;
    ctx.lineWidth = 0.8;
    ctx.strokeStyle = lineColor;
    
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < lineLimit) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(drawFrame);
  }
  
  setupParticles();
  drawFrame();
}

/* ── Console Branding ─────────────────────────── */
console.log(
  '%c ALAN JOHN · WEB BLUEPRINT ',
  'background:#D35400; color:#FFFFFF; font-weight:900; font-size:14px; padding:6px 12px; border-radius:4px;'
);
console.log('%c Full-Stack Developer · Blockchain Engineer · ML Specialist ', 'color:#D35400; font-size:11px;');
