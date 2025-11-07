/**
 * @file IconButton.tsx
 * @component IconButton
 * @description Botón circular minimalista con icono SVG reutilizable
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React from 'react';

interface IconButtonProps {
  /**
   * Tipo de ícono a mostrar
   * @default 'back'
   */
  icon?: 'back' | 'forward' | 'settings' | 'close' | 'menu' | 'plus' | 'check' | 'search';
  /**
   * Callback cuando se hace click
   */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Href si es un link en lugar de botón
   */
  href?: string;
  /**
   * Color del botón (background)
   * @default 'var(--color-theme-primary)'
   */
  bgColor?: string;
  /**
   * Color del ícono
   * @default 'white'
   */
  iconColor?: string;
  /**
   * Tamaño del botón en píxeles
   * @default 40
   */
  size?: number;
  /**
   * Clases de Tailwind adicionales
   */
  className?: string;
  /**
   * Deshabilitado
   */
  disabled?: boolean;
  /**
   * Tipo de botón
   */
  type?: 'button' | 'submit' | 'reset';
  /**
   * Aria-label para accesibilidad
   */
  ariaLabel?: string;
  /**
   * Variante de estilo: 'filled' (relleno) o 'outline' (solo borde)
   * @default 'filled'
   */
  variant?: 'filled' | 'outline';
  /**
   * Ancho del borde para variant outline
   * @default 2
   */
  borderWidth?: number;
}

// Mapa de iconos SVG
const iconMap: Record<string, React.ReactNode> = {
  back: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  forward: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  settings: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  close: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  menu: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  plus: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
  ),
  check: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  search: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
};

/**
 * @component IconButton
 * @description Botón circular minimalista con icono SVG reutilizable
 * @example
 * // Uso básico
 * <IconButton icon="back" onClick={() => router.back()} />
 * 
 * // Como link
 * <IconButton icon="settings" href="/settings" />
 * 
 * // Con colores personalizados
 * <IconButton icon="plus" bgColor="#FF6B9D" iconColor="white" size={48} />
 */
const IconButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  (
    {
      icon = 'back',
      onClick,
      href,
      bgColor = 'var(--color-theme-primary)',
      iconColor = 'white',
      size = 40,
      className = '',
      disabled = false,
      type = 'button',
      ariaLabel,
      variant = 'filled',
      borderWidth = 2,
      ...rest
    },
    ref
  ) => {
    const baseClasses = `flex items-center justify-center rounded-full transition-all duration-200 active:scale-95 hover:opacity-90 flex-shrink-0`;

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

    // Para outline, el fondo es transparente y el borde tiene el color
    const dynamicStyle = variant === 'outline' 
      ? {
          width: `${size}px`,
          height: `${size}px`,
          color: bgColor,
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          borderColor: bgColor,
          backgroundColor: 'transparent',
        }
      : {
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          color: iconColor,
        };

    // Si es un link
    if (href) {
      return (
        <a
          href={href}
          className={`${baseClasses} ${disabledClasses} ${className}`}
          style={dynamicStyle}
          aria-label={ariaLabel || `Navigate to ${href}`}
          {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {iconMap[icon] || iconMap['back']}
        </a>
      );
    }

    // Si es un botón
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={`${baseClasses} ${disabledClasses} ${className}`}
        style={dynamicStyle}
        aria-label={ariaLabel || `${icon} button`}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {iconMap[icon] || iconMap['back']}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export default IconButton;
