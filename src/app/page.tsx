"use client";

/**
 * @file page.tsx
 * @route src/app/page.tsx
 * @description Splash screen MiauBloom 
 * @author Kevin Mariano
 * @version 4.2.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import Image from 'next/image';
import React, { useEffect, useState, useLayoutEffect } from 'react';

interface PlacedElement {
  id: string;
  src: string;
  alt: string;
  style: React.CSSProperties;
  animationClass: 'animate-fall' | 'animate-float';
  left: number;
  top: number;
  width: number;
  height: number;
}

const useScreenSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const updateSize = () => setSize({ 
      width: window.innerWidth, 
      height: window.innerHeight 
    });
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

/**
 * Verifica si dos rectángulos se superponen
 */
function checkCollision(
  rect1: { left: number; top: number; width: number; height: number },
  rect2: { left: number; top: number; width: number; height: number },
  margin: number = 0
): boolean {
  return !(
    rect1.left + rect1.width + margin < rect2.left ||
    rect2.left + rect2.width + margin < rect1.left ||
    rect1.top + rect1.height + margin < rect2.top ||
    rect2.top + rect2.height + margin < rect1.top
  );
}

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [backgroundElements, setBackgroundElements] = useState<PlacedElement[]>([]);
  const screenSize = useScreenSize();
  const isClient = screenSize.width > 0;

  useEffect(() => {
    if (!isClient) return;

    const generateElements = () => {
      const { width: screenWidth, height: screenHeight } = screenSize;
      const screenArea = screenWidth * screenHeight;
      const baseArea = 1920 * 1080; 
      const areaRatio = screenArea / baseArea;
      
      const numClouds = Math.max(20, Math.min(30, Math.floor(30 * areaRatio)));
      const numPaws = Math.max(20, Math.min(30, Math.floor(30 * areaRatio)));
      const numFlowers = Math.max(20, Math.min(30, Math.floor(30 * areaRatio)));
      const numDrops = Math.max(150, Math.min(300, Math.floor(300 * areaRatio)));

      const floatConfig = [
        {
          src: '/assets/cloud.svg',
          alt: 'Nube',
          count: numClouds,
          sizeMin: 130,
          sizeMax: 170,
        },
        {
          src: '/assets/paw.svg',
          alt: 'Huella',
          count: numPaws,
          sizeMin: 130,
          sizeMax: 170,
        },
        {
          src: '/assets/flower.svg',
          alt: 'Flor',
          count: numFlowers,
          sizeMin: 130,
          sizeMax: 170,
        },
      ];

      const placedElements: PlacedElement[] = [];
      const MAX_ATTEMPTS = 250; 
      const COLLISION_MARGIN = 10; 
      //console.log('🏁 Iniciando colocación Round-Robin');
      const maxCount = Math.max(...floatConfig.map(config => config.count));
      const successfulPlacements: { [key: string]: number } = {
        Nube: 0,
        Huella: 0,
        Flor: 0,
      };

      for (let i = 0; i < maxCount; i++) {
        for (const config of floatConfig) {
          
          if (i >= config.count) {
            continue;
          }

          let attempts = 0;
          let placed = false;

          while (attempts < MAX_ATTEMPTS && !placed) {
            attempts++;
            const size = config.sizeMin + Math.random() * (config.sizeMax - config.sizeMin);
            const left = (Math.random() * screenWidth) - (size / 2);
            const top = (Math.random() * screenHeight) - (size / 2);

            const newBounds = {
              left,
              top,
              width: size,
              height: size,
            };

            let hasCollision = false;
            for (const existing of placedElements) {
              if (checkCollision(newBounds, existing, COLLISION_MARGIN)) {
                hasCollision = true;
                break;
              }
            }

            if (!hasCollision) {
              const element: PlacedElement = {
                id: `${config.alt}-${i}-${Date.now()}-${Math.random()}`,
                src: config.src,
                alt: config.alt,
                animationClass: 'animate-float',
                left,
                top,
                width: size,
                height: size,
                style: {
                  position: 'absolute',
                  left: `${left}px`,
                  top: `${top}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                },
              };

              placedElements.push(element);
              successfulPlacements[config.alt]++;
              placed = true;
            }
          } 

          if (!placed) {
            console.warn(`⚠️ No se pudo colocar ${config.alt} (ronda ${i + 1}) después de ${MAX_ATTEMPTS} intentos`);
          }
        } 
      } 

      //console.log('✅ Colocación Round-Robin finalizada:');
      //console.log(`  Nubes: ${successfulPlacements['Nube']}/${numClouds}`);
      //console.log(`  Huellas: ${successfulPlacements['Huella']}/${numPaws}`);
      //console.log(`  Flores: ${successfulPlacements['Flor']}/${numFlowers}`);
     
      const drops: PlacedElement[] = [];
      
      for (let i = 0; i < numDrops; i++) {
        const size = 12 + Math.random() * 18;
        const leftPosition = Math.random() * screenWidth;
        const duration = 20 + Math.random() * 15;
        const delay = -(Math.random() * duration);
        
        const drop: PlacedElement = {
          id: `drop-${i}-${Date.now()}-${Math.random()}`,
          src: '/assets/drop.svg',
          alt: 'Gota',
          animationClass: 'animate-fall',
          left: leftPosition,
          top: -100,
          width: size,
          height: size,
          style: {
            position: 'absolute',
            left: `${leftPosition}px`,
            top: '-100px',
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.35 + Math.random() * 0.4,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
          },
        };
        drops.push(drop);
      }
      //console.log(`💧 ${drops.length} gotas generadas`);

      setBackgroundElements([...placedElements, ...drops]);
    };

    generateElements();

    const progressInterval = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 60);

    const redirectTimer = setTimeout(() => {
      window.location.href = '/identificacion';
    }, 3000); 

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(progressInterval);
    };
  }, [screenSize, isClient]);

  if (!isClient) {
    return (
      <main 
        style={{ backgroundColor: '#EE7E7F' }} 
        className="min-h-screen flex flex-col items-center justify-center p-4"
      >
      </main>
    );
  }

  return (
    <main
      style={{ backgroundColor: '#EE7E7F' }}
      className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden"
    >
      {/* Elementos de Fondo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundElements.map((el) => (
          <div
            key={el.id}
            className={el.alt === 'Gota' ? el.animationClass : ''}
            style={el.style}
          >
            <Image
              src={el.src}
              alt={el.alt}
              fill
              style={{
                objectFit: 'contain',
              }}
              unoptimized 
            />
          </div>
        ))}
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Logo */}
        <div className="relative mb-4">
          <Image
            src="/assets/logo.svg"
            alt="Logo de MiauBloom"
            width={160}
            height={160}
            priority 
            style={{ height: 'auto' }}
            className="mx-auto drop-shadow-md"
          />
        </div>

        {/* Título */}
        <div className="flex flex-col items-center mb-2">
          <span
            className="text-white text-3xl font-bold -mb-2"
            style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}
          >
            Miau
          </span>
          <span
            className="text-white text-7xl font-bold"
            style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.3)' }}
          >
            Bloom
          </span>
        </div>

        {/* Subtítulo */}
        <p
          className="text-white text-xl font-bold mb-8"
          style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.15)' }}
        >
          Crece y siente
        </p>
        
        {/* Barra de Progreso (esta es la que se anima) */}
        <div className="w-full">
          <div className="w-40 h-1.5 bg-white/50 rounded-full overflow-hidden mx-auto">
            <div
              className="h-full bg-white rounded-full transition-all duration-150 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/90 text-xs mt-2 font-light">
            Cargando tu experiencia...
          </p>
        </div>
      </div>
    </main>
  );
}