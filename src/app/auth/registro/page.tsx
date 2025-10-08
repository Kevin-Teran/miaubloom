/**
 * @file page.tsx
 * @route app/auth/registro/page.tsx
 * @description Página de registro de nuevos usuarios (pacientes y psicólogos).
 * Incluye formulario de creación de cuenta con validación.
 * @author Kevin Mariano
 * @version 2.0.5
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Cat, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { useAuth } from '@/lib/auth-context;
import { toast } from 'sonner';

export default function RegistroPage() {
  const searchParams = useSearchParams();
  const rol = searchParams.get('rol') as 'paciente' | 'psicologo' | null;
  const router = useRouter();
  const { signUp } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!rol || (rol !== 'paciente' && rol !== 'psicologo')) {
      router.push('/');
    }
  }, [rol, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!rol) return;

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, formData.nombre, rol);

    if (error) {
      toast.error(error.message || 'Error al crear la cuenta');
      setLoading(false);
      return;
    }

    toast.success('Cuenta creada exitosamente');
    router.push(`/onboarding/${rol}`);
  };

  if (!rol) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F2C2C1]/30 to-white">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver
        </button>

        <Card>
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-[#F2C2C1] rounded-full flex items-center justify-center">
                <Cat className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Crea Tu Cuenta</CardTitle>
            <p className="text-sm text-gray-600">
              Creemos una cuenta juntos como {rol}
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="rounded-lg pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="rounded-lg"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F2C2C1] hover:bg-[#E5B5B4] text-white font-medium py-6 rounded-full"
              >
                {loading ? 'Creando cuenta...' : 'Siguiente'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Ya Tienes Una Cuenta? <span className="underline">Inicia Sesión</span>
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
