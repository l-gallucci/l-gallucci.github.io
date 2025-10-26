const canvas = document.getElementById('dnaCanvas');
const ctx = canvas.getContext('2d');

// === Fix dimensioni canvas ===
function resizeCanvas() {
  // Imposta larghezza e altezza precise senza pixel frazionali
  const width = Math.round(window.innerWidth);
  const height = Math.round(window.innerHeight);

  // Forza lo stile per evitare colonna nera
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  // Imposta dimensioni canvas interne
  canvas.width = width;
  canvas.height = height;

  // Riempi sfondo
  ctx.fillStyle = '#141414ff';
  ctx.fillRect(0, 0, width, height);

  return { width, height };
}

let { width, height } = resizeCanvas();
window.addEventListener('resize', () => {
  ({ width, height } = resizeCanvas());
});

// === Impostazioni DNA ===
const bases = ['A', 'T', 'G', 'C'];
const colors = { A: '#00ff00', T: '#ff3333', G: '#3399ff', C: '#ffcc00' };
const NUM_LINES = 30;

const FONT_SIZE = 15;
ctx.font = `${FONT_SIZE}px Courier New`;
ctx.textBaseline = 'top';

// Crea le righe
let lines = Array.from({ length: NUM_LINES }, (_, i) => ({
  seq: Array.from({ length: 80 }, () => bases[Math.floor(Math.random() * 4)]),
  progress: 0,
  deleting: false,
  speed: 0.9 + Math.random() * 0.4,
  delay: Math.random() * 120,
  y: (i + 1) * (height / NUM_LINES),
  dir: Math.random() > 0.5 ? 1 : -1
}));

// === Funzione di disegno ===
function draw() {
  // leggero fade nero per effetto scia
  ctx.fillStyle = '#141414ff';
  ctx.fillRect(0, 0, width, height);

  lines.forEach(line => {
    if (line.delay > 0) {
      line.delay -= 1;
      return;
    }

    // Aggiorna stato scrittura/cancellazione
    if (!line.deleting) {
      line.progress += line.speed;
      if (line.progress >= line.seq.length) {
        line.progress = line.seq.length;
        line.deleting = true;
        line.delay = 50 + Math.random() * 40;
      }
    } else {
      line.progress -= line.speed;
      if (line.progress <= 0) {
        line.progress = 0;
        line.deleting = false;
        line.seq = Array.from({ length: 80 }, () => bases[Math.floor(Math.random() * 4)]);
        line.delay = 40 + Math.random() * 40;
      }
    }

    const visible = line.seq.slice(0, Math.floor(line.progress));

    // Calcolo di posizione più preciso (fino al bordo)
    visible.forEach((base, j) => {
      const x = (line.dir === 1)
        ? (j * (FONT_SIZE - 1)) % width   // sinistra → destra
        : width - ((j * (FONT_SIZE - 1)) % width) - FONT_SIZE; // destra → sinistra

      ctx.fillStyle = colors[base];
      ctx.fillText(base, x, line.y);
    });
  });

  requestAnimationFrame(draw);
}

draw();