"use client";

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface AssignPatientModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
}

export function AssignPatientModal({ isOpen, onClose }: AssignPatientModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/psicologo/asignar-paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al asignar');
      }
      
      setSuccess(data.message);
      setEmail('');
      setTimeout(() => onClose(true), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Un error ocurrió');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md w-full">
        {/* Botón de Cerrar */}
        <button
          onClick={() => onClose()}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} className="text-gray-500" />
        </button>

        {/* Contenido */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Asignar Paciente Existente
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Introduce el email del paciente que se registró y no tiene psicólogo. Se añadirá a tu lista.
        </p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Email del Paciente"
            type="email"
            id="email_assign"
            name="email_assign"
            placeholder="paciente@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-3">{success}</p>}

          <div className="flex gap-3 mt-8">
            <Button type="button" variant="outline" onClick={() => onClose()} fullWidth disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading} loadingText="Asignando..." fullWidth>
              Asignar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
