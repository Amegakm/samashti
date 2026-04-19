import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 120;
const PARTICLE_COLOR = '255, 200, 0'; // gold, matches --accent

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    const { width, height } = this.canvas;
    this.x = randomBetween(0, width);
    this.y = randomBetween(0, height);
    this.baseX = this.x;
    this.baseY = this.y;
    this.size = randomBetween(1, 3);
    this.speedX = randomBetween(-0.3, 0.3);
    this.speedY = randomBetween(-0.3, 0.3);
    this.opacity = randomBetween(0.15, 0.6);
    this.life = 0;
    this.maxLife = randomBetween(200, 600);
  }

  update(mouseX, mouseY) {
    // Drift naturally
    this.x += this.speedX;
    this.y += this.speedY;

    // Cursor repulsion
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 120;

    if (dist < repelRadius && dist > 0) {
      const force = (repelRadius - dist) / repelRadius;
      this.x += (dx / dist) * force * 3;
      this.y += (dy / dist) * force * 3;
    }

    this.life++;

    // Wrap around edges
    const { width, height } = this.canvas;
    if (this.x < -10) this.x = width + 10;
    if (this.x > width + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;

    // Fade in/out based on life
    if (this.life > this.maxLife) this.reset();
  }

  draw(ctx) {
    const fade = Math.min(this.life / 60, 1, (this.maxLife - this.life) / 60);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${this.opacity * fade})`;
    ctx.fill();
  }
}

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const animFrameRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    // Init particles
    particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => new Particle(canvas));

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseLeave = () => {
      mouse.current.x = -1000;
      mouse.current.y = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { x: mx, y: my } = mouse.current;

      // Draw connecting lines between nearby particles
      const pts = particlesRef.current;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${PARTICLE_COLOR}, ${0.08 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw glow spotlight that follows cursor
      if (mx > 0) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 200);
        grad.addColorStop(0, `rgba(${PARTICLE_COLOR}, 0.04)`);
        grad.addColorStop(1, `rgba(${PARTICLE_COLOR}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mx, my, 200, 0, Math.PI * 2);
        ctx.fill();
      }

      pts.forEach(p => {
        p.update(mx, my);
        p.draw(ctx);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
};

export default ParticleBackground;
