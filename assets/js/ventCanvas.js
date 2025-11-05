// === Hydrothermal Vent Canvas Animation === //
window.addEventListener("DOMContentLoaded", () => {
  const canvas = document.createElement("canvas");
  canvas.id = "ventCanvas";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  // === Resize canvas for all devices ===
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // === PARTICLE SYSTEM ===
  class SmokeParticle {
    constructor(x, y, size, color, speed, drift) {
      this.x = x;
      this.y = y;
      this.baseX = x;
      this.size = size;
      this.color = color;
      this.speedY = speed;
      this.speedX = drift;
      this.opacity = 1;
      this.life = 1;
      this.age = 0;
      this.wobble = Math.random() * Math.PI * 2;
    }

    update() {
      this.age++;
      this.y -= this.speedY;
      this.wobble += 0.05;
      this.x += Math.sin(this.wobble) * 0.5 + this.speedX;
      this.speedX += 0.01;
      this.speedY *= 0.995;
      this.life -= 0.0025;
      this.opacity = Math.max(0, this.life);
      this.size += 0.4;
    }

    draw() {
      ctx.globalAlpha = this.opacity;
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, this.color + "00");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    isDead() {
      return this.life <= 0 || this.y < -50;
    }
  }

  let particles = [];
  let time = 0;

  // === VENT DRAWING ===
  function drawVent() {
    const w = canvas.width;
    const h = canvas.height;
    const scale = w / 1024;
    ctx.save();
    ctx.scale(scale, scale);

    // --- BACKGROUND GRADIENT (deep ocean effect) ---
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1024);
    bgGradient.addColorStop(0, "#0c1416");
    bgGradient.addColorStop(1, "#101c20");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1024, 1024);

    // --- LEFT MOUNTAIN ---
    ctx.fillStyle = "#234248";
    ctx.beginPath();
    ctx.moveTo(150, 820);
    ctx.bezierCurveTo(200, 750, 350, 580, 420, 530);
    ctx.bezierCurveTo(440, 520, 460, 518, 480, 522);
    ctx.bezierCurveTo(530, 580, 600, 720, 680, 820);
    ctx.closePath();
    ctx.fill();

    // Shaded areas
    ctx.fillStyle = "#1c3339";
    ctx.beginPath();
    ctx.moveTo(300, 820);
    ctx.quadraticCurveTo(340, 720, 380, 620);
    ctx.lineTo(390, 635);
    ctx.quadraticCurveTo(350, 740, 320, 820);
    ctx.closePath();
    ctx.fill();

    // --- RIGHT MOUNTAIN (main vent side) ---
    ctx.fillStyle = "#1a3238";
    ctx.beginPath();
    ctx.moveTo(550, 820);
    ctx.bezierCurveTo(600, 740, 680, 580, 740, 510);
    ctx.bezierCurveTo(755, 495, 775, 490, 790, 500);
    ctx.bezierCurveTo(850, 570, 920, 710, 1000, 820);
    ctx.closePath();
    ctx.fill();

    // Ridges
    ctx.fillStyle = "#0f2429";
    ctx.beginPath();
    ctx.moveTo(850, 820);
    ctx.quadraticCurveTo(870, 730, 820, 600);
    ctx.lineTo(830, 610);
    ctx.quadraticCurveTo(875, 740, 870, 820);
    ctx.closePath();
    ctx.fill();

    // Highlights
    ctx.fillStyle = "#2d4f57";
    ctx.beginPath();
    ctx.moveTo(380, 680);
    ctx.bezierCurveTo(400, 630, 420, 560, 445, 535);
    ctx.bezierCurveTo(450, 532, 455, 530, 460, 531);
    ctx.bezierCurveTo(470, 570, 490, 650, 510, 710);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#26444c";
    ctx.beginPath();
    ctx.moveTo(680, 660);
    ctx.bezierCurveTo(700, 600, 730, 530, 750, 505);
    ctx.bezierCurveTo(755, 500, 760, 498, 765, 500);
    ctx.bezierCurveTo(775, 540, 790, 610, 810, 680);
    ctx.closePath();
    ctx.fill();

    // --- VENT CRATER ---
    const ventX = 755;
    const ventY = 505;
    const glowGradient = ctx.createRadialGradient(ventX, ventY, 0, ventX, ventY, 25);
    glowGradient.addColorStop(0, "#ff6b35");
    glowGradient.addColorStop(0.4, "#e84e1f");
    glowGradient.addColorStop(1, "#8b2f15");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(ventX, ventY, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffb74d";
    ctx.beginPath();
    ctx.arc(ventX, ventY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return { ventX: ventX * scale, ventY: ventY * scale };
  }

  // === PARTICLE GENERATION ===
  function createParticles(ventX, ventY) {
    time++;
    const pulse = Math.sin(time * 0.05) * 0.3 + 0.7;
    const particleCount = Math.floor(3 * pulse);

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.random() - 0.5) * 0.3;
      const speed = 1.5 + Math.random() * 1.5;
      particles.push(
        new SmokeParticle(
          ventX + (Math.random() - 0.5) * 20,
          ventY + (Math.random() - 0.5) * 20,
          6 + Math.random() * 4,
          `hsla(${20 + Math.random() * 15}, 90%, 60%, 1)`,
          speed,
          Math.sin(angle) * 0.5
        )
      );
    }
  }

  // === MAIN LOOP ===
  function animate() {
    const { ventX, ventY } = drawVent();

    if (Math.random() < 0.9) {
      createParticles(ventX, ventY);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();

      const heightFromVent = ventY - p.y;
      if (heightFromVent > 100) {
        const darkness = 25 + Math.min(15, (heightFromVent - 100) / 10);
        p.color = `hsla(200, 15%, ${darkness}%, ${p.opacity})`;
      } else if (heightFromVent > 50) {
        const transition = (heightFromVent - 50) / 50;
        const hue = 20 + transition * 180;
        const sat = 90 - transition * 75;
        const light = 60 - transition * 35;
        p.color = `hsla(${hue}, ${sat}%, ${light}%, ${p.opacity})`;
      } else {
        p.color = `hsla(${20 + Math.random() * 10}, 90%, 60%, ${p.opacity})`;
      }

      p.draw();
      if (p.isDead()) particles.splice(i, 1);
    }

    requestAnimationFrame(animate);
  }

  animate();
});