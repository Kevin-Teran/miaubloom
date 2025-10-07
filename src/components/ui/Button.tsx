/**
 * @file Button.tsx
 * @route src/components/ui/Button.tsx
 * @description Componente de botón (Button) modular de MiauBloom.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled,
  ...props 
}) => {
  
  let baseStyle = 'w-full py-3 rounded-full text-body-1 font-bold transition-all duration-300 flex items-center justify-center gap-2';
  
  switch (variant) {
    case 'primary':
      baseStyle += ` bg-primary text-white shadow-lg shadow-primary/40 
                     hover:bg-primary/90 disabled:bg-text-light disabled:shadow-none`;
      break;
    case 'secondary':
      baseStyle += ` bg-white text-text-dark border-2 border-text-light
                     hover:border-primary disabled:opacity-50`;
      break;
    case 'link':
      baseStyle += ` bg-transparent text-primary hover:text-primary/80`;
      break;
  }

  return (
    <button
      className={`${baseStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;