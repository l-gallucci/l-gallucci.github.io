const canvas = document.getElementById("ventScene");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const baseColors = {
  A: "#00d400",
  C: "#58a6ff",
  G: "#ffa600",
  T: "#ff005d",
};

// --- Draw seafloor (mountains) ---
function drawMountains() {
  const baseY = canvas.height * 0.9;
  const peaks = 8;
  const width = canvas.width / (peaks - 1);

  ctx.beginPath();
  ctx.moveTo(0, baseY);
  for (let i = 0; i < peaks; i++) {
    const peakY = baseY - Math.random() * 40 - 30;
    const peakX = i * width;
    ctx.lineTo(peakX, peakY);
  }
  ctx.lineTo(canvas.width, baseY);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, baseY - 80, 0, baseY);
  gradient.addColorStop(0, "#006600");
  gradient.addColorStop(1, "#003300");
  ctx.fillStyle = gradient;
  ctx.fill();
}

// --- Create vents (5 plumes) ---
const vents = [];
function initVents() {
  vents.length = 0;
  for (let i = 0; i < 5; i++) {
    vents.push({
      x: (canvas.width / 5) * (i + 0.5),
      y: canvas.height * 0.87,
      radius: 80 + Math.random() * 30,
      chars: Array.from({ length: 100 }, () => ({
        base: ["A", "C", "G", "T"][Math.floor(Math.random() * 4)],
        offsetX: (Math.random() - 0.5) * 80,
        offsetY: -Math.random() * 100,
        phase: Math.random() * Math.PI * 2,
      })),
    });
  }
}
initVents();

// --- Draw each plume ---
function drawPlume(vent) {
  vent.chars.forEach((c) => {
    c.phase += 0.02;
    const flicker = Math.sin(c.phase) * 0.4;
    ctx.globalAlpha = 0.6 + flicker * 0.4;
    ctx.fillStyle = baseColors[c.base];
    ctx.font = "18px JetBrains Mono";
    const x = vent.x + c.offsetX;
    const y = vent.y + c.offsetY;
    ctx.fillText(c.base, x, y);
  });
  ctx.globalAlpha = 1;
}

// --- Main loop ---
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawMountains();
  vents.forEach(drawPlume);

  requestAnimationFrame(animate);
}
animate();