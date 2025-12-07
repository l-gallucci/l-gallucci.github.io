// === Hydrothermal Vent Canvas Animation (Continuous & Visible V6) === //
window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.createElement("canvas");
    canvas.id = "ventCanvas";
    document.body.prepend(canvas);
    const ctx = canvas.getContext("2d");
  
    // Canvas off-screen per salvare lo sfondo statico (montagne)
    const bgCanvas = document.createElement("canvas");
    const bgCtx = bgCanvas.getContext("2d");
  
    let width, height, scale;
    let ventPos = { x: 0, y: 0 };
  
    // === CONFIGURAZIONE FISICA ===
    const CONFIG = {
      particleCount: 1500,      // AUMENTATO: Garantisce un flusso continuo senza "buchi"
      emissionRate: 5,          // Costante: 5 particelle per frame
      turbulence: 0.03,         // Leggera turbolenza naturale
      riseSpeed: 2.5,           // Velocità di risalita
      expansion: 1.003          // Espansione graduale
    };
  
    // === RESIZE & BACKGROUND GENERATION ===
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      
      // Setup background canvas
      bgCanvas.width = width;
      bgCanvas.height = height;
      scale = width / 1024;
  
      // Disegniamo le montagne una volta sola
      drawStaticBackground(bgCtx, width, height, scale);
    }
  
    // Funzione che disegna solo la parte immobile
    function drawStaticBackground(context, w, h, s) {
      context.save();
      context.scale(s, s);
  
      // --- BACKGROUND GRADIENT ---
      const bgGradient = context.createLinearGradient(0, 0, 0, 1024);
      bgGradient.addColorStop(0, "#080e10"); 
      bgGradient.addColorStop(1, "#101c20");
      context.fillStyle = bgGradient;
      context.fillRect(0, 0, 1024 / s * w, 1024 / s * h);
  
      // --- LEFT MOUNTAIN ---
      context.fillStyle = "#1b3338";
      context.beginPath();
      context.moveTo(150, 850);
      context.bezierCurveTo(200, 750, 350, 580, 420, 530);
      context.bezierCurveTo(440, 520, 460, 518, 480, 522);
      context.bezierCurveTo(530, 580, 600, 720, 680, 850);
      context.fill();
  
      // --- RIGHT MOUNTAIN (Main Vent) ---
      context.fillStyle = "#152a30";
      context.beginPath();
      context.moveTo(550, 850);
      context.bezierCurveTo(600, 740, 680, 580, 740, 510);
      context.bezierCurveTo(755, 495, 775, 490, 790, 500);
      context.bezierCurveTo(850, 570, 920, 710, 1000, 850);
      context.fill();
  
      // Highlights & Shadows
      context.fillStyle = "#26444c";
      context.beginPath();
      context.moveTo(680, 660);
      context.bezierCurveTo(700, 600, 730, 530, 750, 505);
      context.bezierCurveTo(760, 498, 770, 500, 780, 510);
      context.bezierCurveTo(790, 610, 810, 680, 810, 680);
      context.fill();
  
      ventPos.x = 755 * s;
      ventPos.y = 505 * s;
  
      context.restore();
    }
  
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    // === PARTICLE SYSTEM ===
    class SmokeParticle {
      constructor() {
        this.reset();
      }
  
      reset() {
        const spread = 20 * scale;
        this.x = ventPos.x + (Math.random() - 0.5) * spread;
        this.y = ventPos.y + (Math.random() - 0.5) * (spread / 2);
        
        // Fisica iniziale
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = -(CONFIG.riseSpeed + Math.random()); 
        
        this.size = (5 + Math.random() * 5) * scale;
        this.life = 1;
        this.decay = 0.001 + Math.random() * 0.002;
        
        // Colore iniziale (Magma/Rosso Arancio)
        this.hue = 15 + Math.random() * 15;
        this.sat = 90;
        this.light = 60;
      }
  
      update() {
        // Movimento
        this.x += this.vx;
        this.y += this.vy;
  
        // Fisica
        this.vx += (Math.random() - 0.5) * CONFIG.turbulence;
        this.size *= CONFIG.expansion;
        this.vy *= 0.99;
  
        // Invecchiamento
        this.life -= this.decay;
  
        // Cambio colore progressivo
        if (this.life < 0.8) {
          // Vira verso il freddo/grigio
          this.hue += 0.5; 
          this.sat *= 0.98; // Desaturazione graduale
          
          // === FIX VISIBILITÀ ===
          // Impedisce al fumo di scendere sotto il 40% di luminosità.
          // Rimarrà un GRIGIO CHIARO invece di diventare nero.
          if (this.light > 40) { 
             this.light *= 0.99; 
          }
        }
      }
  
      draw(ctx) {
        // La sparizione è gestita SOLO dall'opacità (Alpha)
        ctx.globalAlpha = Math.max(0, this.life * 0.6); 
        ctx.fillStyle = `hsl(${this.hue}, ${this.sat}%, ${this.light}%)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  
    // Pool di particelle AUMENTATO per evitare interruzioni
    const particles = [];
    for(let i=0; i < CONFIG.particleCount; i++) {
        particles.push(new SmokeParticle());
        particles[i].life = 0; 
    }
  
    let time = 0;
  
    // === ANIMATION LOOP ===
    function animate() {
      // 1. Pulisci e disegna lo sfondo
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(bgCanvas, 0, 0);
  
      time += 0.05;
  
      // 2. GLOW PULSANTE (Mantenuto perché piaceva)
      const pulse = Math.sin(time) * 0.1 + 0.9;
      const glowSize = 40 * scale * pulse;
      
      const glow = ctx.createRadialGradient(ventPos.x, ventPos.y, 0, ventPos.x, ventPos.y, glowSize * 2);
      glow.addColorStop(0, "rgba(255, 100, 50, 0.4)");
      glow.addColorStop(1, "rgba(255, 100, 50, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(ventPos.x, ventPos.y, glowSize * 2, 0, Math.PI * 2);
      ctx.fill();
  
      ctx.fillStyle = `rgba(255, 180, 50, ${0.8 * pulse})`;
      ctx.beginPath();
      ctx.arc(ventPos.x, ventPos.y, 10 * scale, 0, Math.PI * 2);
      ctx.fill();
  
      // 3. Gestione Particelle (Flusso continuo)
      let emitted = 0;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        if (p.life <= 0) {
            // Emette costantemente finché non raggiunge il rate per frame
            if (emitted < CONFIG.emissionRate) {
                p.reset();
                emitted++;
            }
        } else {
            p.update();
            p.draw(ctx);
        }
      }
  
      requestAnimationFrame(animate);
    }
  
    animate();
  });