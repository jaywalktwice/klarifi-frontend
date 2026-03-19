import React, { useEffect, useRef } from 'react';

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    let mouse = { x: -1000, y: -1000, vx: 0, vy: 0 };
    let lastMouse = { x: -1000, y: -1000 };
    let lastScrollY = window.scrollY;
    
    // Create dense particle field for fluid flow
    const particleCount = Math.min(Math.floor((width * height) / 4500), 350);
    const particles = [];
    
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = (Math.random() - 0.5) * 0.2;
        this.baseX = this.x;
        this.baseY = this.y;
        this.radius = Math.random() * 1.5 + 0.5;
        this.colorAlpha = Math.random() * 0.3 + 0.1;
      }
      
      update() {
        // Fluid Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 250) {
          const force = (250 - dist) / 250;
          // Apply velocity drag from mouse + repel force
          this.vx += mouse.vx * force * 0.015 - (dx / dist) * force * 1.2;
          this.vy += mouse.vy * force * 0.015 - (dy / dist) * force * 1.2;
        }
        
        // Gentle spring back to origin to maintain mesh density
        const homeDx = this.baseX - this.x;
        const homeDy = this.baseY - this.y;
        this.vx += homeDx * 0.003; 
        this.vy += homeDy * 0.003;
        
        // Friction
        this.vx *= 0.94;
        this.vy *= 0.94;
        
        // Add subtle wander
        this.vx += (Math.random() - 0.5) * 0.08;
        this.vy += (Math.random() - 0.5) * 0.08;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap edges to keep dots on screen infinitely during scrolling
        if (this.x < -100) { this.x += width + 200; this.baseX += width + 200; }
        if (this.x > width + 100) { this.x -= width + 200; this.baseX -= width + 200; }
        if (this.y < -100) { this.y += height + 200; this.baseY += height + 200; }
        if (this.y > height + 100) { this.y -= height + 200; this.baseY -= height + 200; }
      }
      
      draw() {
        // Velocity determines brightness and size
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        const activeAlpha = Math.min(this.colorAlpha + speed * 0.15, 1);
        const drawRadius = this.radius + speed * 0.4;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, drawRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92, 180, 247, ${activeAlpha})`;
        ctx.fill();
      }
    }
    
    function init() {
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    
    function animate() {
      // Use fillRect with opacity for beautiful motion trails
      ctx.fillStyle = 'rgba(9, 11, 15, 0.4)'; // Matching #090B0F var(--bg)
      ctx.fillRect(0, 0, width, height);
      
      // Decay mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;
      
      // Draw Connections (the mesh)
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();
        
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 100) {
            let opacity = 1 - (dist / 100);
            
            // Highlight connections near mouse
            const mdx = mouse.x - p1.x;
            const mdy = mouse.y - p1.y;
            const mouseDist = Math.sqrt(mdx*mdx + mdy*mdy);
            if (mouseDist < 250) {
              opacity += (1 - mouseDist / 250) * 0.8;
            }
            
            if (opacity > 0.02) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(46, 139, 216, ${opacity * 0.4})`; // Klarifi blue
              ctx.stroke();
            }
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    }
    
    init();
    animate();
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      init();
    };
    
    const handleMouseMove = (e) => {
      if (lastMouse.x !== -1000) {
        mouse.vx = e.clientX - lastMouse.x;
        mouse.vy = e.clientY - lastMouse.y;
      }
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      lastMouse.x = e.clientX;
      lastMouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.vx = 0;
      mouse.vy = 0;
    };
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // Parallax shift the particles (0.5 = move at 50% scroll speed)
      particles.forEach(p => {
        p.y -= deltaScroll * 0.5;
        p.baseY -= deltaScroll * 0.5;
      });
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
