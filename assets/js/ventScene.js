// === Canvas setup ===
const mountainCanvas = document.getElementById("mountainCanvas");
const mtx = mountainCanvas.getContext("2d");

const plumeCanvas = document.getElementById("plumeCanvas");
const ptx = plumeCanvas.getContext("2d");

function resize() {
  [mountainCanvas, plumeCanvas].forEach(c => {
    c.width = window.innerWidth;
    c.height = window.innerHeight * 0.9;
  });
}
resize();
window.addEventListener("resize", resize);

// === Colors for nucleotides ===
const baseColors = {
  A: "#00d400",
  C: "#58a6ff",
  G: "#ffa600",
  T: "#ff005d"
};

// === Mountain and vents ===
function drawMountains() {
  const h = mountainCanvas.height;
  const w = mountainCanvas.width;
  const baseY = h * 0.95;

  mtx.fillStyle = "#0b0b0b";
  mtx.fillRect(0, 0, w, h);

  mtx.beginPath();
  mtx.moveTo(0, baseY);
  for (let x = 0; x <= w; x += 40) {
    const y = baseY - Math.sin(x * 0.01) * 30 - 50;
    mtx.lineTo(x, y);
  }
  mtx.lineTo(w, baseY);
  mtx.closePath();

  const grad = mtx.createLinearGradient(0, baseY - 100, 0, baseY);
  grad.addColorStop(0, "#004400");
  grad.addColorStop(1, "#002200");
  mtx.fillStyle = grad;
  mtx.fill();

  // Vents (chimneys)
  const vents = 5;
  for (let i = 0; i < vents; i++) {
    const vx = (w / vents) * (i + 0.5);
    const vy = baseY - 20;
    mtx.fillStyle = "#222";
    mtx.fillRect(vx - 6, vy - 50, 12, 50);
  }
}

// === Plume particles ===
const particles = [];
const vents = [];

function initPlumes() {
  particles.length = 0;
  vents.length = 0;
  const h = plumeCanvas.height;
  const w = plumeCanvas.width;
  const baseY = h * 0.93;
  const ventCount = 5;

  for (let i = 0; i < ventCount; i++) {
    const vx = (w / ventCount) * (i + 0.5);
    const vy = baseY - 60;
    vents.push({ x: vx, y: vy });
  }

  vents.forEach(v => {
    for (let i = 0; i < 250; i++) {
      const relY = Math.random(); // 0 base, 1 top
      const spread = 20 + relY * 200; // expands upward
      const px = v.x + (Math.random() - 0.5) * spread;
      const py = v.y - relY * 300;
      particles.push({
        x: px,
        y: py,
        base: ["A", "C", "G", "T"][Math.floor(Math.random() * 4)],
        phase: Math.random() * Math.PI * 2,
        alpha: 0.6 + Math.random() * 0.3
      });
    }
  });
}

function drawPlumes() {
  const h = plumeCanvas.height;
  const w = plumeCanvas.width;

  ptx.fillStyle = "rgba(10,10,10,0.25)";
  ptx.fillRect(0, 0, w, h);

  particles.forEach(p => {
    p.phase += 0.03;
    const flicker = Math.sin(p.phase) * 0.2;
    ptx.globalAlpha = p.alpha + flicker * 0.3;
    ptx.fillStyle = baseColors[p.base];
    ptx.font = "18px JetBrains Mono";
    ptx.fillText(p.base, p.x, p.y);

    // Movement: slight turbulent drift
    p.x += Math.sin(p.phase) * 0.2;
    p.y -= 0.15 + Math.random() * 0.1;

    // Reset if out of top bounds
    if (p.y < 100) {
      p.y = h * 0.93;
      p.x = p.x + (Math.random() - 0.5) * 50;
    }
  });

  // Soft top fade-out
  const grad = ptx.createLinearGradient(0, 0, 0, h * 0.4);
  grad.addColorStop(0, "rgba(10,10,10,0.8)");
  grad.addColorStop(1, "rgba(10,10,10,0)");
  ptx.fillStyle = grad;
  ptx.fillRect(0, 0, w, h);
}

// === Animation loop ===
function animate() {
  drawPlumes();
  requestAnimationFrame(animate);
}

// === Start ===
drawMountains();
initPlumes();
animate();