import { motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
}

interface ParticleEffectProps {
  x: number;
  y: number;
  color?: string;
  count?: number;
}

function ParticleEffect({ x, y, color = '#667eea', count = 10 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: x + (Math.random() - 0.5) * 100,
      y: y + (Math.random() - 0.5) * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 0.5 + 0.5,
    }));
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
    }, 1000);

    return () => clearTimeout(timer);
  }, [x, y, count]);

  return (
    <>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          style={{
            position: 'fixed',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            background: color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          initial={{ opacity: 1, scale: 1 }}
          animate={{
            opacity: 0,
            scale: 0,
            x: (Math.random() - 0.5) * 200,
            y: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: particle.duration,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  );
}

export default memo(ParticleEffect);

