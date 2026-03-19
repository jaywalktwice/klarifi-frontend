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
    
    let mouse = { x: -1000, y: -1000 };
    let lastScrollY = window.scrollY;
    
    const particles = [];
    
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        
        // 3D Depth layering
        this.z = Math.random(); // 0 to 1
        
        // Size and base brightness depend on depth
        this.radius = this.z * 2.0 + 0.8; 
        this.baseAlpha = this.z * 0.3 + 0.18; 
        this.currentAlpha = this.baseAlpha;
        
        // Twinkle phase
        this.phase = Math.random() * Math.PI * 2;
        this.phaseSpeed = (Math.random() * 0.02) + 0.005;
      }
      
      update(time) {
        // Natural twinkle
        this.phase += this.phaseSpeed;
        const twinkle = (Math.sin(this.phase) * 0.5 + 0.5) * 0.2;
        
        // Mouse interaction (Gentle fluid wake)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        let mouseForceAlpha = 0;
        let repelX = 0;
        let repelY = 0;
        
        const interactionRadius = 250;
        if (dist < interactionRadius) {
          // Non-linear falloff for butter-smooth edges
          const force = Math.pow((interactionRadius - dist) / interactionRadius, 2); 
          
          // Push away slightly, scaled by depth (foreground moves more)
          repelX = -(dx / dist) * force * 20 * this.z;
          repelY = -(dy / dist) * force * 20 * this.z;
          
          // Illuminate spectacularly when near mouse
          mouseForceAlpha = force * 0.8; 
        }
        
        // Smoothly interpolate current position to target for graceful floating
        const targetX = this.baseX + repelX;
        const targetY = this.baseY + repelY;
        
        this.x += (targetX - this.x) * 0.08; 
        this.y += (targetY - this.y) * 0.08;
        
        // Add subtle organic drift to base position
        this.baseX += (Math.random() - 0.5) * 0.15;
        this.baseY += (Math.random() - 0.5) * 0.15;
        
        // Infinite scrolling wrap
        const spacing = 45;
        if (this.baseY < -spacing * 2) { 
           this.baseY += height + spacing * 4; 
           this.y = this.baseY;
        }
        if (this.baseY > height + spacing * 2) { 
           this.baseY -= height + spacing * 4; 
           this.y = this.baseY;
        }
        
        this.currentAlpha = Math.min(this.baseAlpha + twinkle + mouseForceAlpha, 1);
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Elegant glow for highly active particles (replaces visible lines)
        if (this.currentAlpha > 0.3) {
           ctx.shadowColor = `rgba(92, 180, 247, ${this.currentAlpha})`;
           ctx.shadowBlur = 12 * this.currentAlpha;
        } else {
           ctx.shadowBlur = 0;
        }
        
        ctx.fillStyle = `rgba(92, 180, 247, ${this.currentAlpha})`;
        ctx.fill();
      }
    }
    
    function init() {
      canvas.width = width;
      canvas.height = height;
      particles.length = 0;
      
      // Invisible grid spawn with organic offset
      const spacing = 45;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      
      for (let i = -2; i <= cols + 2; i++) {
        for (let j = -2; j <= rows + 2; j++) {
           const offsetX = (Math.random() - 0.5) * 20;
           const offsetY = (Math.random() - 0.5) * 20;
           particles.push(new Particle(i * spacing + offsetX, j * spacing + offsetY));
        }
      }
    }
    
    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      time++;
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(time);
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
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaScroll = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;
      
      // True volumetric 3D parallax! Shift particles based on their Z depth
      particles.forEach(p => {
        const parallaxFactor = 0.2 + (p.z * 0.4); // Background moves at 0.2x speed, foreground at 0.6x
        p.y -= deltaScroll * parallaxFactor;
        p.baseY -= deltaScroll * parallaxFactor;
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
