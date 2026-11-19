// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorBlur = document.getElementById('cursorBlur');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorBlur.style.left = e.clientX + 'px';
  cursorBlur.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
    cursor.style.background = '#a855f7';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.background = '#a855f7';
  });
});

// ===== PARTICLES =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const stars = Array.from({ length: 120 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  r: Math.random() * 1.5 + 0.3,
  alpha: Math.random(),
  speed: Math.random() * 0.3 + 0.1,
  dir: Math.random() > 0.5 ? 1 : -1
}));

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => {
    s.alpha += s.speed * 0.02 * s.dir;
    if (s.alpha >= 1 || s.alpha <= 0) s.dir *= -1;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168, 85, 247, ${s.alpha * 0.6})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ===== NAVBAR =====
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5)';
  } else {
    navbar.style.boxShadow = 'none';
  }
});

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
document.querySelectorAll('.about-card, .skill-group, .contact-card, .goal-box').forEach(el => observer.observe(el));

// ===== GAME =====
let gameState = 'idle'; // idle, playing, done
let clicks = 0;
let timeLeft = 10;
let timer = null;
let best = 0;

const clickCountEl = document.getElementById('clickCount');
const timeLeftEl = document.getElementById('timeLeft');
const bestEl = document.getElementById('bestScore');
const gameBtn = document.getElementById('gameBtn');
const gameBtnText = document.getElementById('gameBtnText');
const gameMsg = document.getElementById('gameMsg');

function handleClick() {
  if (gameState === 'idle') {
    startGame();
  } else if (gameState === 'playing') {
    clicks++;
    clickCountEl.textContent = clicks;
    gameBtn.classList.add('clicked');
    setTimeout(() => gameBtn.classList.remove('clicked'), 100);
    
    // Motivatsiya xabarlari
    const msgs = ['🔥 Davom et!', '💪 Zo\'r!', '⚡ Tez!', '🚀 Ajoyib!', '🎯 Super!'];
    if (clicks % 5 === 0) {
      gameMsg.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    }
  } else if (gameState === 'done') {
    resetGame();
  }
}

function startGame() {
  gameState = 'playing';
  clicks = 0;
  timeLeft = 10;
  clickCountEl.textContent = 0;
  timeLeftEl.textContent = 10;
  gameMsg.textContent = '🔥 Bosing!';
  gameBtnText.textContent = '👆 BOSING!';
  
  timer = setInterval(() => {
    timeLeft--;
    timeLeftEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  gameState = 'done';
  
  if (clicks > best) {
    best = clicks;
    bestEl.textContent = best;
    gameMsg.textContent = `🏆 Yangi rekord! ${clicks} ta bosish!`;
  } else {
    gameMsg.textContent = `✅ ${clicks} ta bosding! Rekord: ${best}`;
  }
  gameBtnText.textContent = '🔄 Qaytadan';
}

function resetGame() {
  gameState = 'idle';
  clicks = 0;
  timeLeft = 10;
  clickCountEl.textContent = 0;
  timeLeftEl.textContent = 10;
  gameMsg.textContent = '';
  gameBtnText.textContent = '🚀 Boshlash uchun bosing!';
}

// ===== EMOJI RAIN on click =====
document.getElementById('gameBtn').addEventListener('click', function(e) {
  if (gameState !== 'playing') return;
  const emojis = ['🚀','⚡','🔥','💜','✨','🎯'];
  const em = document.createElement('div');
  em.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  em.style.cssText = `
    position:fixed; left:${e.clientX}px; top:${e.clientY}px;
    font-size:1.5rem; pointer-events:none; z-index:9998;
    animation: float-up 0.8s ease forwards;
  `;
  document.body.appendChild(em);
  setTimeout(() => em.remove(), 800);
});

// CSS for float-up animation
const style = document.createElement('style');
style.textContent = `
  @keyframes float-up {
    0%{opacity:1;transform:translateY(0) scale(1)}
    100%{opacity:0;transform:translateY(-80px) scale(0.5)}
  }
`;
document.head.appendChild(style);
