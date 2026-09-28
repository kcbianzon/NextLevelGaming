import { useEffect, useRef } from 'react';

function controllerTargets() {
  const stencil = document.createElement('canvas');
  stencil.width = 520;
  stencil.height = 300;
  const pen = stencil.getContext('2d');
  if (!pen) return [];

  pen.translate(12, 17);
  pen.strokeStyle = '#fff';
  pen.lineWidth = 5;
  pen.lineJoin = 'round';
  pen.lineCap = 'round';
  pen.shadowColor = '#fff';
  pen.shadowBlur = 0;

  const shell = new Path2D('M 88 69 C 66 58 45 70 38 96 L 17 174 C 8 207 33 230 63 220 L 105 202 C 129 193 151 190 178 190 L 276 190 C 303 190 325 193 349 202 L 391 220 C 421 230 446 207 437 174 L 416 96 C 409 70 388 58 366 69 L 315 93 C 293 102 270 107 227 107 C 184 107 161 102 139 93 Z');
  pen.stroke(shell);

  // D-pad
  pen.lineWidth = 7;
  pen.beginPath();
  pen.moveTo(93, 120); pen.lineTo(93, 170);
  pen.moveTo(68, 145); pen.lineTo(118, 145);
  pen.stroke();

  // Four face buttons
  [[344, 124], [369, 145], [319, 145], [344, 166]].forEach(([x, y]) => {
    pen.beginPath(); pen.arc(x, y, 6, 0, Math.PI * 2); pen.stroke();
  });

  // Sticks and the small center controls
  [[169, 150], [268, 150]].forEach(([x, y]) => {
    pen.beginPath(); pen.arc(x, y, 18, 0, Math.PI * 2); pen.stroke();
    pen.beginPath(); pen.arc(x, y, 5, 0, Math.PI * 2); pen.stroke();
  });
  pen.lineWidth = 4;
  pen.beginPath(); pen.roundRect(205, 131, 27, 8, 4); pen.stroke();
  pen.beginPath(); pen.roundRect(205, 150, 27, 8, 4); pen.stroke();

  const { data } = pen.getImageData(0, 0, stencil.width, stencil.height);
  const points = [];
  for (let y = 0; y < stencil.height; y += 4) {
    for (let x = 0; x < stencil.width; x += 4) {
      if (data[(y * stencil.width + x) * 4 + 3] > 30) points.push({ x, y });
    }
  }
  return points;
}

export default function ControllerParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return undefined;

    const source = controllerTargets();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointer = { x: -1000, y: -1000, active: false };
    let particles = [];
    let width = 0;
    let height = 0;
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let frameId = 0;
    let lastTime = 0;
    let elapsed = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      scale = Math.min(width / 520, height / 300);
      offsetX = (width - 520 * scale) / 2;
      offsetY = (height - 300 * scale) / 2;
      particles = source.map((point, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        tx: offsetX + point.x * scale,
        ty: offsetY + point.y * scale,
        size: 1.1 + (index % 4) * 0.22,
        phase: index * 0.73,
      }));
      elapsed = 0;
      draw(0);
    };

    const draw = (time) => {
      frameId = 0;
      if (!width || !height) return;
      const dt = Math.min((time - (lastTime || time)) / 16.67, 2.5);
      lastTime = time;
      elapsed += dt;
      context.clearRect(0, 0, width, height);

      const reveal = reducedMotion ? 1 : Math.min(elapsed / 105, 1);
      const radius = 128;
      particles.forEach((particle, index) => {
        const driftX = reducedMotion ? 0 : Math.sin(elapsed * 0.018 + particle.phase) * 1.8;
        const driftY = reducedMotion ? 0 : Math.cos(elapsed * 0.016 + particle.phase * 1.2) * 1.6;
        let tx = offsetX + (particle.tx - offsetX) * reveal + driftX;
        let ty = offsetY + (particle.ty - offsetY) * reveal + driftY;
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (pointer.active && distance < radius && distance > 0.1) {
          const force = (1 - distance / radius) * 30;
          tx += (dx / distance) * force;
          ty += (dy / distance) * force;
        }

        particle.vx += (tx - particle.x) * (reducedMotion ? 0.09 : 0.043) * dt;
        particle.vy += (ty - particle.y) * (reducedMotion ? 0.09 : 0.043) * dt;
        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;

        context.fillStyle = index % 5 === 0 ? 'rgba(30, 205, 255, .94)' : 'rgba(28, 127, 255, .82)';
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size * scale, 0, Math.PI * 2);
        context.fill();
      });

      // A sparse field gives the controller a soft particle trail without filling the hero.
      context.fillStyle = 'rgba(27, 125, 255, .44)';
      for (let i = 0; i < 34; i += 1) {
        const x = ((i * 137.5 + 71) % Math.max(width, 1));
        const y = ((i * 89.3 + 19) % Math.max(height, 1));
        const pulse = reducedMotion ? 1 : 0.6 + Math.sin(elapsed * 0.018 + i) * 0.25;
        context.globalAlpha = pulse;
        context.fillRect(x, y, 1.4, 1.4);
      }
      context.globalAlpha = 1;

      if (!reducedMotion || pointer.active) frameId = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
      if (reducedMotion && !frameId) frameId = window.requestAnimationFrame(draw);
    };
    const onPointerLeave = () => { pointer.active = false; pointer.x = -1000; pointer.y = -1000; };
    const onPointerDown = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      particles.forEach((particle) => {
        const dx = particle.x - x;
        const dy = particle.y - y;
        const distance = Math.hypot(dx, dy);
        if (distance < 170 && distance > 0.1) {
          const impulse = (1 - distance / 170) * 7;
          particle.vx += (dx / distance) * impulse;
          particle.vy += (dy / distance) * impulse;
        }
      });
      if (!frameId) frameId = window.requestAnimationFrame(draw);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    resize();

    return () => {
      observer.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="controller-particles" aria-hidden="true" />;
}
