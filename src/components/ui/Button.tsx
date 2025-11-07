/**
 * @file Button.tsx
 * @route src/components/ui/Button.tsx
 * @description Componente de botón reutilizable con variantes y estados
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import React, { ButtonHTMLAttributes, forwardRef } from 'react';

/**
 * @type ButtonVariant
 * @description Variantes de estilo del botón
 */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

/**
 * @type ButtonSize
 * @description Tamaños disponibles del botón
 */
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * @interface ButtonProps
 * @extends {ButtonHTMLAttributes<HTMLButtonElement>}
 * @description Propiedades del componente Button
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * @component Button
 * @description Botón personalizado con múltiples variantes y estados
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Cargando...',
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    /**
     * @function getVariantStyles
     * @description Retorna los estilos según la variante del botón
     */
    const getVariantStyles = (): string => {
      const variants = {
        primary: `
          bg-[var(--color-theme-primary)] 
          hover:bg-[var(--color-theme-primary-dark)] 
          text-white shadow-lg hover:shadow-xl
          disabled:bg-gray-300
        `,
        secondary: `
          bg-gradient-to-r from-purple-400 to-purple-500 
          hover:from-purple-500 hover:to-purple-600 
          text-white shadow-lg hover:shadow-xl
          disabled:from-gray-300 disabled:to-gray-400
        `,
        outline: `
          bg-white border-2 border-[var(--color-theme-primary)] 
          text-[var(--color-theme-primary)] hover:bg-[var(--color-theme-primary-light)]
          disabled:border-gray-300 disabled:text-gray-400
        `,
        ghost: `
          bg-transparent text-[var(--color-theme-primary)] 
          hover:bg-[var(--color-theme-primary-light)]
          disabled:text-gray-400
        `,
        danger: `
          bg-gradient-to-r from-red-400 to-red-500 
          hover:from-red-500 hover:to-red-600 
          text-white shadow-lg hover:shadow-xl
          disabled:from-gray-300 disabled:to-gray-400
        `,
      };

      return variants[variant] || variants.primary;
    };

    /**
     * @function getSizeStyles
     * @description Retorna los estilos según el tamaño del botón
     */
    const getSizeStyles = (): string => {
      const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
        xl: 'px-8 py-3.5 text-xl',
      };

      return sizes[size] || sizes.md;
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          font-bold rounded-full
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-[var(--color-theme-primary)] focus:ring-offset-2
          disabled:cursor-not-allowed disabled:opacity-50
          transform hover:-translate-y-0.5 active:translate-y-0
          disabled:transform-none
          ${getVariantStyles()}
          ${getSizeStyles()}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {/* Icono izquierdo o spinner de carga */}
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}

        {/* Texto del botón */}
        <span>{isLoading ? loadingText : children}</span>

        {/* Icono derecho */}
        {!isLoading && rightIcon && (
          <span className="flex-shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;