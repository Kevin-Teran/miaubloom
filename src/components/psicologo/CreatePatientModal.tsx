'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface CreatePatientModalProps {
  isOpen: boolean;
  onClose: (success?: boolean) => void;
}

const initialState = {
  nombreCompleto: '',
  email: '',
  password: '',
  day: '',
  month: '',
  year: '',
  genero: '',
};

export function CreatePatientModal({ isOpen, onClose }: CreatePatientModalProps) {
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/psicologo/crear-paciente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear');
      }
      
      setSuccess(data.message);
      setFormData(initialState);
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
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-lg w-full">
        {/* Encabezado del Modal */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Crear Nueva Cuenta de Paciente
          </h2>
          <button
            onClick={() => onClose()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <Input
            label="Nombre Completo"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Contraseña Temporal"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />
          
          {/* Fecha de Nacimiento */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Nacimiento</label>
            <div className="flex gap-2">
              <select 
                name="day" 
                value={formData.day} 
                onChange={handleChange} 
                required
                className="flex-1 appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-900"
              >
                <option value="">Día</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (<option key={d} value={d}>{d}</option>))}
              </select>
              <select 
                name="month" 
                value={formData.month} 
                onChange={handleChange} 
                required
                className="flex-1 appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-900"
              >
                <option value="">Mes</option>
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((m, i) => (<option key={m} value={String(i + 1)}>{m}</option>))}
              </select>
              <select 
                name="year" 
                value={formData.year} 
                onChange={handleChange} 
                required
                className="flex-1 appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 text-center text-gray-900"
              >
                <option value="">Año</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(y => (<option key={y} value={y}>{y}</option>))}
              </select>
            </div>
          </div>

          {/* Género */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Género</label>
            <div className="flex justify-start gap-4 px-1">
              {['Masculino', 'Femenino', 'Otro'].map(gen => (
                <label key={gen} className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="radio" 
                    name="genero" 
                    value={gen} 
                    checked={formData.genero === gen} 
                    onChange={handleChange} 
                    required
                    className="h-4 w-4"
                  />
                  <span className="text-gray-700 text-sm">{gen}</span>
                </label>
              ))}
            </div>
          </div>
          
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-3">{success}</p>}

          {/* Footer del Modal */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={() => onClose()} fullWidth disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading} loadingText="Creando..." fullWidth>
              Crear y Asignar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
