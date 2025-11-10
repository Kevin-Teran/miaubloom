/**
 * @file animations.ts
 * @description Librería de animaciones sutiles para toda la aplicación (estilo iOS/Apple)
 * @author Kevin Mariano
 * @version 1.0.0
 * @copyright MiauBloom
 */

import gsap from 'gsap';

// ============================================================================
// ANIMACIONES DE ENTRADA PARA PÁGINAS Y CONTENEDORES
// ============================================================================

/**
 * Fade in suave para páginas completas
 * Animación muy sutil, casi imperceptible pero mejora la UX
 */
export const pageTransition = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, y: 8 },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.4, 
      delay,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Fade in con escala muy sutil para cards y contenedores
 */
export const cardFadeIn = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0, scale: 0.98 },
    { 
      opacity: 1, 
      scale: 1, 
      duration: 0.5, 
      delay,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Animación escalonada para listas (muy sutil)
 */
export const staggerFadeIn = (elements: HTMLElement[], staggerDelay = 0.06) => {
  gsap.fromTo(
    elements,
    { opacity: 0, y: 12 },
    {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: staggerDelay,
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

// ============================================================================
// MICRO-INTERACCIONES PARA BOTONES Y ELEMENTOS CLICABLES
// ============================================================================

/**
 * Animación de press para botones (tipo iOS)
 * Se aplica al hacer mousedown/touchstart
 */
export const buttonPress = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 0.96,
    duration: 0.1,
    ease: 'power2.in'
  });
};

/**
 * Animación de release para botones
 * Se aplica al hacer mouseup/touchend
 */
export const buttonRelease = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 1,
    duration: 0.15,
    ease: 'power2.out'
  });
};

/**
 * Hover suave para cards y elementos interactivos
 */
export const cardHoverIn = (element: HTMLElement) => {
  gsap.to(element, {
    y: -4,
    scale: 1.01,
    duration: 0.3,
    ease: 'power2.out'
  });
};

export const cardHoverOut = (element: HTMLElement) => {
  gsap.to(element, {
    y: 0,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
};

// ============================================================================
// ANIMACIONES PARA MODALES Y OVERLAYS
// ============================================================================

/**
 * Modal fade in con backdrop blur
 */
export const modalFadeIn = (modalElement: HTMLElement, backdropElement?: HTMLElement) => {
  // Backdrop
  if (backdropElement) {
    gsap.fromTo(
      backdropElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
  }

  // Modal content
  gsap.fromTo(
    modalElement,
    { opacity: 0, scale: 0.95, y: 20 },
    { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      duration: 0.35, 
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Modal fade out
 */
export const modalFadeOut = (
  modalElement: HTMLElement, 
  backdropElement?: HTMLElement,
  onComplete?: () => void
) => {
  // Modal content
  gsap.to(modalElement, {
    opacity: 0,
    scale: 0.95,
    y: 10,
    duration: 0.2,
    ease: 'power2.in'
  });

  // Backdrop
  if (backdropElement) {
    gsap.to(backdropElement, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete
    });
  } else if (onComplete) {
    setTimeout(onComplete, 200);
  }
};

// ============================================================================
// ANIMACIONES PARA INPUTS Y FORMULARIOS
// ============================================================================

/**
 * Shake suave para errores de validación
 */
export const shakeError = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { x: -4 },
    {
      x: 4,
      duration: 0.08,
      repeat: 3,
      yoyo: true,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set(element, { x: 0 });
      }
    }
  );
};

/**
 * Pulse suave para destacar un elemento
 */
export const pulseHighlight = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { scale: 1 },
    {
      scale: 1.03,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut'
    }
  );
};

// ============================================================================
// ANIMACIONES PARA TRANSICIONES DE ESTADO
// ============================================================================

/**
 * Fade simple para cambios de contenido
 */
export const contentFade = (element: HTMLElement, delay = 0) => {
  gsap.fromTo(
    element,
    { opacity: 0 },
    { 
      opacity: 1, 
      duration: 0.3, 
      delay,
      ease: 'power1.out',
      clearProps: 'opacity'
    }
  );
};

/**
 * Slide suave desde arriba (para notificaciones/toasts)
 */
export const slideFromTop = (element: HTMLElement) => {
  gsap.fromTo(
    element,
    { y: -100, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.4, 
      ease: 'power2.out',
      clearProps: 'all'
    }
  );
};

/**
 * Slide hacia arriba para ocultar (toasts)
 */
export const slideToTop = (element: HTMLElement, onComplete?: () => void) => {
  gsap.to(element, {
    y: -100,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    onComplete
  });
};

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Limpia todas las propiedades de animación de un elemento
 */
export const clearAnimations = (element: HTMLElement) => {
  gsap.set(element, { clearProps: 'all' });
};

/**
 * Hook personalizado para animaciones en React
 */
export const usePageTransition = (ref: React.RefObject<HTMLElement>, delay = 0) => {
  if (ref.current) {
    pageTransition(ref.current, delay);
  }
};

