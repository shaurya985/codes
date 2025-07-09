// Theme toggle (dark/light mode)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    btn.classList.toggle('active');
    if(document.body.classList.contains('light-theme')) {
      btn.textContent = '🌞';
    } else {
      btn.textContent = '🌓';
    }
  });
});
// Fade-in animation for hero text on scroll (if not already visible)



const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');

let w = window.innerWidth;
let h = window.innerHeight;

canvas.width = w;
canvas.height = h;

// Iron Man palette: arc reactor blue, gold, red, dark red
const colors = ['#00f0ff', '#ffe064', '#c40202', '#a60505', '#ffb300'];
const particles = [];
const particleCount = 70;

// Mouse position for movement
let mouse = { x: w/2, y: h/2, active: false };

// Responsive canvas
window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
});

// Interactivity
canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});
canvas.addEventListener('touchmove', (e) => {
  const t = e.touches[0];
  mouse.x = t.clientX;
  mouse.y = t.clientY;
  mouse.active = true;
});
canvas.addEventListener('mouseleave', () => mouse.active = false);
canvas.addEventListener('touchend', () => mouse.active = false);

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Particle {
  constructor() {
    this.radius = randomBetween(3, 9);
    this.x = randomBetween(0, w);
    this.y = randomBetween(0, h);
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.alpha = randomBetween(0.6, 0.9);
    this.speed = randomBetween(0.5, 1.4);
    this.angle = randomBetween(0, 2 * Math.PI);
    this.orbit = randomBetween(30, 140);
    this.baseX = this.x;
    this.baseY = this.y;
    this.time = Math.random() * 1000;
    // For Iron Man: some particles are glowing "arc reactors"
    this.arcReactor = Math.random() < 0.1;
  }
  update() {
    this.time += 0.009 * this.speed;
    // Iron Man effect: particles orbit mouse or initial base
    let targetX = mouse.active ? mouse.x : this.baseX;
    let targetY = mouse.active ? mouse.y : this.baseY;
    this.x = targetX + Math.cos(this.time + this.angle) * this.orbit;
    this.y = targetY + Math.sin(this.time + this.angle) * this.orbit;
    // Subtle drift
    this.x += Math.sin(this.time * 0.7) * 1;
    this.y += Math.cos(this.time * 0.6) * 1;
    // Respawn if out of bounds
    if (this.x < -50 || this.x > w + 50 || this.y < -50 || this.y > h + 50) {
      this.baseX = randomBetween(0, w);
      this.baseY = randomBetween(0, h);
      this.orbit = randomBetween(30, 140);
      this.time = Math.random() * 1000;
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    if (this.arcReactor) {
      // Draw a glowing arc reactor
      let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 2.5);
      grad.addColorStop(0, '#00f0ff');
      grad.addColorStop(0.2, '#a0ffff');
      grad.addColorStop(0.7, 'rgba(0,240,255,0.3)');
      grad.addColorStop(1, 'rgba(0,240,255,0)');
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 2.5, 0, Math.PI*2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * (this.arcReactor ? 0.5 : 1), 0, Math.PI*2);
    ctx.fillStyle = this.arcReactor ? '#00f0ff' : this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = this.arcReactor ? 25 : 12;
    ctx.fill();
    ctx.restore();
  }
}

// Generate particles
for(let i=0; i<particleCount; i++){
  particles.push(new Particle());
}

function drawIronManHUD() {
  // Draw a subtle arc reactor HUD at mouse
  if (!mouse.active) return;
  let R = 54;
  ctx.save();
  ctx.globalAlpha = 0.35;
  ctx.translate(mouse.x, mouse.y);

  // Outer glow
  let grad = ctx.createRadialGradient(0,0,0,0,0, R*1.25);
  grad.addColorStop(0, 'rgba(0,240,255,0.45)');
  grad.addColorStop(0.6, 'rgba(0,240,255,0.12)');
  grad.addColorStop(1, 'rgba(0,240,255,0)');
  ctx.beginPath();
  ctx.arc(0,0,R*1.25,0,Math.PI*2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Main blue circle
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.arc(0,0,R,0,Math.PI*2);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.shadowBlur = 18;
  ctx.shadowColor = '#00f0ff';
  ctx.stroke();

  // Inner lines (HUD effect)
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = '#ffe064';
  ctx.lineWidth = 1.8;
  for(let i=0;i<6;i++){
    ctx.save();
    ctx.rotate((Math.PI*2/6)*i);
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(0,-R*0.82);
    ctx.stroke();
    ctx.restore();
  }
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  ctx.arc(0,0,R*0.55,0,Math.PI*2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ffe064';
  ctx.stroke();

  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, w, h);

  // Stark background gradient glow
  let gradient = ctx.createRadialGradient(w/2, h/2, w/6, w/2, h/2, w);
  gradient.addColorStop(0, "rgba(255,200,50,0.07)");
  gradient.addColorStop(0.55, "rgba(166,5,5,0.18)");
  gradient.addColorStop(1, "rgba(27,21,18,0.9)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Draw particles and connect nearby ones
  for(let i=0; i<particles.length; i++){
    particles[i].update();
    particles[i].draw(ctx);
    // connect to nearby particles
    for(let j=i+1; j<particles.length; j++){
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100){
        ctx.save();
        ctx.globalAlpha = 0.09;
        ctx.strokeStyle = (particles[i].arcReactor || particles[j].arcReactor) ? '#00f0ff' : '#ffe064';
        ctx.lineWidth = (particles[i].arcReactor || particles[j].arcReactor) ? 2 : 1.2;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Iron Man HUD
  drawIronManHUD();

  requestAnimationFrame(animate);
}

animate();