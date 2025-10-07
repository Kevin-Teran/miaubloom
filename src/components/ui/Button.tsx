/**
 * @file Button.tsx
 * @route src/components/ui/Button.tsx
 * @description Componente de botón reutilizable. Aplica estilos de diseño consistentes
 * con Tailwind CSS (color primario, redondeo completo, sombra).
 * @author Gemini Refactor
 * @version 1.0.0
 * @since 1.0.1
 * @copyright MiauBloom
 */

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'link';
    href?: string; 
    children: React.ReactNode; 
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, disabled, className, href, ...props }) => {
    let baseClasses = "w-full p-3 font-bold rounded-full transition-colors duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-body-1 text-center";

    switch (variant) {
        case 'primary':
            baseClasses += " bg-primary text-white hover:bg-opacity-90";
            break;
        case 'secondary':
            baseClasses += " border border-text-light text-text-dark bg-white hover:bg-background-light";
            baseClasses = baseClasses.replace('shadow-lg', 'shadow-md'); 
            break;
        case 'link':
            baseClasses += " bg-white text-primary border border-primary hover:bg-primary hover:text-white";
            break;
    }

    const buttonContent = (
        <span className={`${baseClasses} ${className || ''}`}>
            {children}
        </span>
    );

    if (href) {
        return (
            <Link href={href} passHref legacyBehavior>
                <a {...props} className="w-full"> 
                    {buttonContent}
                </a>
            </Link>
        );
    }

    return (
        <button 
            {...props} 
            disabled={disabled}
            className={`${baseClasses} ${className || ''}`}
        >
            {children}
        </button>
    );
};

export default Button;