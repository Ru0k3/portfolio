// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
}
animRing();

document.querySelectorAll('a, button, .skill-tag, .project-card, .bento-cell, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '16px'; cursor.style.height = '16px';
    ring.style.width = '50px'; ring.style.height = '50px';
    ring.style.borderColor = 'rgba(0,255,157,0.7)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '8px'; cursor.style.height = '8px';
    ring.style.width = '32px'; ring.style.height = '32px';
    ring.style.borderColor = 'rgba(0,255,157,0.4)';
  });
});

// CANVAS PARTICLES
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

function initParticles() {
  particles = [];
  const count = Math.floor((W * H) / 14000);
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vy: -(Math.random() * 0.3 + 0.05),
      vx: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.1,
      type: Math.random() > 0.85 ? 'cross' : 'dot'
    });
  }
}
initParticles();

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => {
    p.y += p.vy;
    p.x += p.vx;
    if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }

    ctx.globalAlpha = p.opacity;
    if (p.type === 'cross') {
      ctx.strokeStyle = 'rgba(0,255,157,0.6)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.x - 4, p.y); ctx.lineTo(p.x + 4, p.y);
      ctx.moveTo(p.x, p.y - 4); ctx.lineTo(p.x, p.y + 4);
      ctx.stroke();
    } else {
      ctx.fillStyle = Math.random() > 0.9 ? 'rgba(0,207,255,0.8)' : 'rgba(255,255,255,0.7)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(drawParticles);
}
drawParticles();

// SCROLL PROGRESS
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  document.getElementById('scroll-line').style.setProperty('--progress', pct + '%');
});

// REVEAL ON SCROLL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// TEXT SCRAMBLE
const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function scramble(el) {
  const target = el.dataset.text || el.textContent;
  let iter = 0;
  const interval = setInterval(() => {
    el.textContent = target.split('').map((c, i) => {
      if (i < iter) return target[i];
      return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    iter += 0.5;
    if (iter >= target.length) { el.textContent = target; clearInterval(interval); }
  }, 30);
}

document.querySelectorAll('.scramble').forEach(el => {
  el.addEventListener('mouseenter', () => scramble(el));
});

// AUTO-SCRAMBLE on load for hero
setTimeout(() => {
  document.querySelectorAll('.section-title').forEach(el => scramble(el));
}, 1200);

// BENTO GLOW TRACK
document.querySelectorAll('.bento-cell').forEach(cell => {
  cell.addEventListener('mousemove', e => {
    const rect = cell.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
    cell.style.setProperty('--mx', x + '%');
    cell.style.setProperty('--my', y + '%');
  });
});

// 3D TILT on project cards
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) translateZ(0)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1)';
  });
  card.addEventListener('mouseenter', () => { card.style.transition = 'none'; });
});

// SPACE KEY — gravity pulse
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    document.querySelectorAll('.float-obj').forEach(obj => {
      const dx = (Math.random() - 0.5) * 300;
      const dy = (Math.random() - 0.5) * 200;
      obj.style.transition = 'transform 0.4s cubic-bezier(0.16,1,0.3,1)';
      obj.style.transform = `translate(${dx}px, ${dy}px) scale(1.5) rotate(${Math.random()*360}deg)`;
      setTimeout(() => {
        obj.style.transition = 'transform 1.2s cubic-bezier(0.16,1,0.3,1)';
        obj.style.transform = '';
      }, 400);
    });

    // flash effect
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:rgba(0,255,157,0.04);z-index:9999;pointer-events:none;animation:flashout 0.5s forwards;';
    document.head.insertAdjacentHTML('beforeend', '<style>@keyframes flashout{to{opacity:0}}</style>');
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 500);
  }
});

// FOOTER CLOCK
function updateClock() {
  const now = new Date();
  document.getElementById('footer-time').textContent =
    now.toUTCString().replace('GMT', 'UTC');
}
updateClock();
setInterval(updateClock, 1000);

// STAGGER FLOAT OBJ positions
document.querySelectorAll('.float-obj').forEach((obj, i) => {
  obj.style.animationDelay = -(i * 1.7) + 's';
});
