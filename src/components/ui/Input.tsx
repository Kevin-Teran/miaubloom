/**
 * @file Input.tsx
 * @route src/components/ui/Input.tsx
 * @description Componente de input reutilizable. Aplica estilos de diseño consistentes
 * con Tailwind CSS para un look más profesional (border redondeado, color de borde/focus).
 * @author Gemini Refactor
 * @version 1.0.0
 * @since 1.0.1
 * @copyright MiauBloom
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
    const baseClasses = "w-full p-3 border rounded-xl text-text-dark border-text-light focus:ring-primary focus:ring-2 focus:ring-opacity-75 focus:outline-none placeholder:text-text-light text-body-1";

    return (
        <input 
            {...props} 
            className={`${baseClasses} ${props.className || ''}`}
        />
    );
};

export default Input;