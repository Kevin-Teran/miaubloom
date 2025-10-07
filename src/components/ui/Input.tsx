/**
 * @file Input.tsx
 * @route src/components/ui/Input.tsx
 * @description Componente de entrada (Input) modular de MiauBloom.
 * @author Kevin Mariano
 * @version 1.0.0
 * @since 1.0.0
 * @copyright MiauBloom
 */

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full p-4 border border-text-light rounded-xl 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  placeholder-text-light transition duration-200 text-body-1 ${className}`}
      {...props}
    />
  );
};

export default Input;