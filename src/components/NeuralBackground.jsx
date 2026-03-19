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
    
    const particles = [];
    
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.vx = 0;
        this.vy = 0;
        // Tiny dots like stars
        this.radius = Math.random() * 0.8 + 0.4;
        // Very dim by default
        this.baseAlpha = Math.random() * 0.15 + 0.05;
        this.currentAlpha = this.baseAlpha;
      }
      
      update() {
        // Fluid Mouse interaction (Subtle)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let mouseForceAlpha = 0;
        
        if (dist < 200) {
          const force = (200 - dist) / 200;
          // Apply gentle velocity drag from mouse + repel force
          this.vx += mouse.vx * force * 0.004 - (dx / dist) * force * 0.3;
          this.vy += mouse.vy * force * 0.004 - (dy / dist) * force * 0.3;
          
          // Illuminate when near mouse
          mouseForceAlpha = force * 0.8; 
        }
        
        // Gentle spring back to origin
        const homeDx = this.baseX - this.x;
        const homeDy = this.baseY - this.y;
        this.vx += homeDx * 0.03; // Stronger spring so they stay near grid
        this.vy += homeDy * 0.03;
        
        // Friction
        this.vx *= 0.85;
        this.vy *= 0.85;
        
        // Very subtle wander
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap edges to keep dots on screen infinitely during scrolling
        const spacing = 35;
        if (this.baseY < -spacing * 2) { 
           this.baseY += height + spacing * 4; 
           this.y += height + spacing * 4; 
        }
        if (this.baseY > height + spacing * 2) { 
           this.baseY -= height + spacing * 4; 
           this.y -= height + spacing * 4; 
        }
        
        this.currentAlpha = Math.min(this.baseAlpha + mouseForceAlpha, 1);
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92, 180, 247, ${this.currentAlpha})`;
        ctx.fill();
      }
    }
    
    function init() {
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      
      // Invisible grid spawn
      const spacing = 35;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      
      for (let i = -2; i <= cols + 2; i++) {
        for (let j = -2; j <= rows + 2; j++) {
           // Add a tiny bit of random offset to the grid so it behaves organically
           const offsetX = (Math.random() - 0.5) * 15;
           const offsetY = (Math.random() - 0.5) * 15;
           particles.push(new Particle(i * spacing + offsetX, j * spacing + offsetY));
        }
      }
    }
    
    function animate() {
      // Use standard clear for stars instead of blur trails (matching requested subtle look)
      ctx.clearRect(0, 0, width, height);
      
      // Decay mouse velocity
      mouse.vx *= 0.9;
      mouse.vy *= 0.9;
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
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
