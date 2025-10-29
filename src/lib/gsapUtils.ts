/**
 * @file gsapUtils.ts
 * @description Utilidades y presets de animaciones GSAP para MiauBloom
 * @author Kevin Mariano
 * @version 1.0.0
 */

import gsap from 'gsap';

/**
 * Animación de entrada del gato (desde abajo con rotación)
 */
export const catEntranceAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.set(element, {
    opacity: 0,
    scale: 0.3,
    y: 100,
    rotationZ: -15,
  });

  gsap.to(element, {
    opacity: 1,
    scale: 1,
    y: 0,
    rotationZ: 0,
    duration: 0.8,
    ease: 'back.out',
    delay: 0.2,
  });

  // Salto de celebración
  gsap.to(element, {
    y: -15,
    duration: 0.6,
    ease: 'sine.inOut',
    delay: 1,
    yoyo: true,
    repeat: 1,
  });
};

/**
 * Animación de entrada de textos
 */
export const textEntranceAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.set(element, {
    opacity: 0,
    y: 20,
  });

  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay: 0.5,
  });
};

/**
 * Animación de transición entre pasos
 */
export const stepTransitionAnimation = (element: HTMLElement | null, isAnimating: boolean) => {
  if (!element) return;

  if (isAnimating) {
    gsap.to(element, {
      opacity: 0,
      duration: 0.3,
    });
  }
};

/**
 * Animación de hover para botones
 */
export const buttonHoverAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

/**
 * Animación de fade in
 */
export const fadeInAnimation = (element: HTMLElement | null, delay = 0) => {
  if (!element) return;

  gsap.set(element, { opacity: 0 });
  gsap.to(element, {
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    delay,
  });
};

/**
 * Animación de slide up
 */
export const slideUpAnimation = (element: HTMLElement | null, delay = 0) => {
  if (!element) return;

  gsap.set(element, {
    opacity: 0,
    y: 30,
  });

  gsap.to(element, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    delay,
  });
};

/**
 * Timeline para animaciones complejas
 */
export const createWelcomeTimeline = (catElement: HTMLElement | null, textElement: HTMLElement | null) => {
  const timeline = gsap.timeline();

  timeline
    .fromTo(
      catElement,
      {
        opacity: 0,
        scale: 0.3,
        y: 100,
        rotationZ: -15,
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        rotationZ: 0,
        duration: 0.8,
        ease: 'back.out',
      },
      0
    )
    .fromTo(
      textElement,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      },
      0.3
    )
    .to(
      catElement,
      {
        y: -15,
        duration: 0.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
      },
      1
    );

  return timeline;
};
