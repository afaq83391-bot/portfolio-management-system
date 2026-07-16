import { useEffect, useRef } from 'react';

export default function BackgroundAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let shapes = [];
    let mouse = { x: -1000, y: -1000 };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouse);

    // Create floating particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.3 + 0.05,
        color: ['#d97706', '#f59e0b', '#0891b2', '#7c3aed', '#059669'][Math.floor(Math.random() * 5)]
      });
    }

    // Create floating geometric shapes
    for (let i = 0; i < 8; i++) {
      shapes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 60 + 30,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.06 + 0.02,
        type: ['circle', 'ring', 'triangle', 'square', 'cross'][Math.floor(Math.random() * 5)],
        color: ['#d97706', '#f59e0b', '#0891b2', '#7c3aed', '#2563eb'][Math.floor(Math.random() * 5)]
      });
    }

    const drawShape = (s) => {
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rotation);
      ctx.globalAlpha = s.opacity;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = 1.5;

      switch (s.type) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'ring':
          ctx.beginPath();
          ctx.arc(0, 0, s.size, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, s.size * 0.6, 0, Math.PI * 2);
          ctx.stroke();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -s.size);
          ctx.lineTo(s.size * 0.866, s.size * 0.5);
          ctx.lineTo(-s.size * 0.866, s.size * 0.5);
          ctx.closePath();
          ctx.stroke();
          break;
        case 'square':
          ctx.strokeRect(-s.size * 0.7, -s.size * 0.7, s.size * 1.4, s.size * 1.4);
          break;
        case 'cross':
          ctx.beginPath();
          ctx.moveTo(-s.size, 0);
          ctx.lineTo(s.size, 0);
          ctx.moveTo(0, -s.size);
          ctx.lineTo(0, s.size);
          ctx.stroke();
          break;
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient orbs
      const time = Date.now() * 0.0005;
      const orb1X = canvas.width * 0.2 + Math.sin(time * 0.7) * 120;
      const orb1Y = canvas.height * 0.3 + Math.cos(time * 0.5) * 80;
      const grad1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, 300);
      grad1.addColorStop(0, 'rgba(217, 119, 6, 0.06)');
      grad1.addColorStop(1, 'rgba(217, 119, 6, 0)');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orb2X = canvas.width * 0.8 + Math.cos(time * 0.6) * 100;
      const orb2Y = canvas.height * 0.7 + Math.sin(time * 0.8) * 100;
      const grad2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, 250);
      grad2.addColorStop(0, 'rgba(8, 145, 178, 0.04)');
      grad2.addColorStop(1, 'rgba(8, 145, 178, 0)');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const orb3X = canvas.width * 0.5 + Math.sin(time * 0.4) * 150;
      const orb3Y = canvas.height * 0.15 + Math.cos(time * 0.9) * 60;
      const grad3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, 200);
      grad3.addColorStop(0, 'rgba(124, 58, 237, 0.03)');
      grad3.addColorStop(1, 'rgba(124, 58, 237, 0)');
      ctx.fillStyle = grad3;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw connection lines near mouse
      particles.forEach(p => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(217, 119, 6, ${0.08 * (1 - dist / 180)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });

      // Draw particles
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse repel
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Wrap around
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw particle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(148, 163, 184, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw shapes
      shapes.forEach(s => {
        s.x += s.speedX;
        s.y += s.speedY;
        s.rotation += s.rotationSpeed;

        // Mouse interaction - gentle push
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200 * 0.3;
          s.x -= (dx / dist) * force;
          s.y -= (dy / dist) * force;
          s.rotationSpeed += 0.0002;
        }

        // Wrap
        if (s.x < -100) s.x = canvas.width + 100;
        if (s.x > canvas.width + 100) s.x = -100;
        if (s.y < -100) s.y = canvas.height + 100;
        if (s.y > canvas.height + 100) s.y = -100;

        drawShape(s);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouse);
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
        zIndex: 0
      }}
    />
  );
}