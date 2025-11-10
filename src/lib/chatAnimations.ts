/**
 * @file chatAnimations.ts
 * @description Animaciones tipo Apple/iOS para el chat usando GSAP
 * @author Kevin Mariano
 * @version 1.0.0
 */

import gsap from 'gsap';

/**
 * 1. SPRING ANIMATION - Entrada de burbujas de mensaje
 * Simula un resorte físico como en iOS
 */
export const messageSpringIn = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.5,
      y: 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.6,
      ease: 'back.out(1.7)', // Rebote tipo iOS
      delay,
    }
  );
};

/**
 * 2. SLIDE TRANSITION - Navegación entre lista y chat
 * Deslizamiento direccional como en iOS Mail
 */
export const slideTransition = (
  element: HTMLElement,
  direction: 'left' | 'right',
  onComplete?: () => void
) => {
  const startX = direction === 'left' ? 100 : -100;
  
  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: startX,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.4,
      ease: 'power2.out',
      onComplete,
    }
  );
};

/**
 * 3. SCALE FEEDBACK - Botones con feedback táctil
 * Simula el efecto de "presionar" en iOS
 */
export const buttonPressAnimation = (element: HTMLElement) => {
  const timeline = gsap.timeline();
  
  timeline
    .to(element, {
      scale: 0.92,
      duration: 0.1,
      ease: 'power2.in',
    })
    .to(element, {
      scale: 1,
      duration: 0.15,
      ease: 'elastic.out(1, 0.3)',
    });
  
  return timeline;
};

/**
 * 4. CROSSFADE - Transición suave entre contenidos
 * Como en Photos de iOS
 */
export const crossfade = (elementOut: HTMLElement, elementIn: HTMLElement) => {
  const timeline = gsap.timeline();
  
  timeline
    .to(elementOut, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })
    .fromTo(
      elementIn,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      },
      '-=0.15' // Overlap para suavidad
    );
  
  return timeline;
};

/**
 * 5. PARALLAX SCROLL - Profundidad en scroll
 * Usado en páginas de producto de Apple
 */
export const parallaxScroll = (element: HTMLElement, speed = 0.5) => {
  const handleScroll = () => {
    const scrollY = window.scrollY;
    gsap.to(element, {
      y: scrollY * speed,
      duration: 0,
    });
  };
  
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
};

/**
 * 6. BLUR FOCUS - Desenfoque de fondo al abrir modal
 * Como Control Center en iOS
 */
export const blurFocusAnimation = (backdrop: HTMLElement, show: boolean) => {
  gsap.to(backdrop, {
    backdropFilter: show ? 'blur(10px)' : 'blur(0px)',
    opacity: show ? 1 : 0,
    duration: 0.3,
    ease: 'power2.out',
  });
};

/**
 * 7. INTERACTIVE HOVER - Feedback visual al hover
 * Como en macOS y iPadOS
 */
export const setupInteractiveHover = (element: HTMLElement) => {
  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: 1.03,
      y: -2,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

/**
 * 8. STAGGER ANIMATION - Aparición escalonada de lista
 * Como al abrir app drawer en iOS
 */
export const staggerListAnimation = (elements: HTMLElement[]) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08, // Delay escalonado
      ease: 'power2.out',
    }
  );
};

/**
 * 9. REVEAL ANIMATION - Aparición tipo máscara
 * Como en presentaciones de productos Apple
 */
export const revealAnimation = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    {
      clipPath: 'inset(0 100% 0 0)',
      opacity: 0,
    },
    {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      duration: 0.8,
      ease: 'power3.inOut',
    }
  );
};

/**
 * 10. ELASTIC BOUNCE - Rebote elástico
 * Para acciones exitosas o notificaciones
 */
export const elasticBounce = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { scale: 1 },
    {
      scale: 1.2,
      duration: 0.4,
      ease: 'elastic.out(1, 0.3)',
      yoyo: true,
      repeat: 1,
    }
  );
};

/**
 * 11. FADE SCALE - Aparición con escala (tipo notificaciones iOS)
 */
export const fadeScaleIn = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.9,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    }
  );
};

/**
 * 12. MORPHING - Cambio de forma suave
 * Para iconos que se transforman
 */
export const morphIcon = (element: HTMLElement, rotation = 180) => {
  gsap.to(element, {
    rotation,
    duration: 0.3,
    ease: 'power2.inOut',
  });
};

