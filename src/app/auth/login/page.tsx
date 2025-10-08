/**
 * @file page.tsx
 * @route app/auth/login/page.tsx
 * @description Página de inicio de sesión para usuarios existentes.
 * @author Kevin Mariano
 * @version 2.0.7
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// Solo un bloque de importación de lucide-react
import { Cat, Eye, EyeOff, ArrowLeft } from 'lucide-react';

// CORRECCIÓN: Se eliminó el prefijo 'src/' de todas las rutas de alias (@/)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error, redirectUrl } = await signIn(formData.email, formData.password); 

    if (error) {
      toast.error(error || 'Credenciales incorrectas');
      setLoading(false);
      return;
    }
    
    toast.success('Sesión iniciada');
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#F2C2C1]/30 to-background">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => router.push('/')}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Seleccionar Rol
        </button>

        <Card className="rounded-xl shadow-lg">
          <CardHeader className="text-center space-y-2 pt-8">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-[#F2C2C1] rounded-full flex items-center justify-center shadow-md">
                <Cat className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Hola de nuevo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder a MiauBloom.
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-lg h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="rounded-lg pr-10 h-12"
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

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => router.push('/auth/recuperar')}
                  className="text-sm text-primary hover:underline"
                >
                  Recuperación de contraseña
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F2C2C1] hover:bg-[#E5B5B4] text-white font-semibold py-3 rounded-full transition-colors"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
            
            <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                    Si tienes problemas para acceder, por favor contacta al administrador.
                </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}