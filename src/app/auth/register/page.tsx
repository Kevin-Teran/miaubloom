/**
 * @file page.tsx
 * @route src/app/auth/register/page.tsx
 * @description Página de registro multi-paso V2.2 (Fechas Corregidas)
 * @author Kevin Mariano
 * @version 1.0.1
 * @since 1.0.0
 * @copyright MiauBloom
 */

"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import React, { Suspense, useState, ChangeEvent, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import { EllipseCorner } from '@/components/EllipseCorner';

function PaginationDots({ current, total, color = '#F4A9A0', inactiveColor = '#FDE6E6' }: { current: number; total: number; color?: string; inactiveColor?: string }) {
 return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`rounded-full transition-all duration-300 ${ index === current ? 'w-8 h-2.5' : 'w-2.5 h-2.5' }`}
          style={{ backgroundColor: index === current ? color : inactiveColor }}
        />
      ))}
    </div>
  );
}

/**
 * @component RegisterForm
 * @description Formulario de registro multi-paso
 */
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleQuery = searchParams.get('role');
  const role = roleQuery === 'psicologo' || roleQuery === 'psicólogo' ? 'psicologo' : 'paciente';
  const isPatient = role === 'paciente';

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 3;
  const isLastStep = currentStep === totalSteps - 1;

  const [formData, setFormData] = useState({
    nombreCompleto: '', email: '', password: '', confirmPassword: '',
    day: '', month: '', year: '', genero: '', contactoEmergencia: '', institucionReferida: 'Privada', nombreInstitucion: '',
    idNombreAvatar: 'Nikky01', horarioUso: '', duracionUso: '',
   });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
       if ((e.target as HTMLInputElement).checked) setFormData(prev => ({ ...prev, [name]: value }));
    } else { setFormData(prev => ({ ...prev, [name]: value })); }
    setErrors(prev => { const newErrors = { ...prev }; delete newErrors[name]; return newErrors; });
    setApiError('');
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}; let isValid = true;
    if (step === 0) {
      if (!formData.nombreCompleto.trim() || formData.nombreCompleto.trim().length < 3) { newErrors.nombreCompleto = 'Nombre inválido'; isValid = false; }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; if (!formData.email || !emailRegex.test(formData.email)) { newErrors.email = 'Correo inválido'; isValid = false; }
      if (!formData.password || formData.password.length < 6) { newErrors.password = 'Contraseña inválida (mín. 6 caracteres)'; isValid = false; }
      if (!formData.confirmPassword || formData.password !== formData.confirmPassword) { newErrors.confirmPassword = 'Las contraseñas no coinciden'; isValid = false; }
    } else if (step === 1) {
      if (!formData.day || !formData.month || !formData.year) { newErrors.edad = 'Fecha de nacimiento requerida'; isValid = false; }
      if (!formData.genero) { newErrors.genero = 'Género requerido'; isValid = false; }
      if (!formData.contactoEmergencia.trim()) { newErrors.contactoEmergencia = 'Contacto requerido'; isValid = false; }
      if (formData.institucionReferida === 'Pública' && !formData.nombreInstitucion.trim()) { newErrors.nombreInstitucion = 'Nombre de institución requerido'; isValid = false;}
    } else if (step === 2) {
      if (!formData.idNombreAvatar.trim()) { newErrors.idNombreAvatar = 'ID Avatar requerido'; isValid = false; }
      if (!formData.horarioUso) { newErrors.horarioUso = 'Selecciona un horario'; isValid = false; }
      if (!formData.duracionUso) { newErrors.duracionUso = 'Selecciona una duración'; isValid = false; }
    }
    setErrors(newErrors); return isValid;
  };

  const handleNextOrSubmit = async (e: FormEvent) => {
     e.preventDefault(); if (!validateStep(currentStep)) { return; }
    if (currentStep < totalSteps - 1) { setCurrentStep(currentStep + 1); }
    else { setIsLoading(true); setApiError(''); console.log('Enviando datos completos:', formData);
      try {
        const response = await fetch('/api/auth/register', { //
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email, password: formData.password, nombreCompleto: formData.nombreCompleto, rol: isPatient ? 'Paciente' : 'Psicólogo',
          }),
        }); const data = await response.json();
        if (data.success) { 
          const dashboardRoute = isPatient ? '/dashboard/paciente' : '/dashboard/psicologo'; router.push(dashboardRoute);
        } else { setApiError(data.message || 'Error al registrar usuario'); } //
      } catch (error) { console.error('Error en registro final:', error); setApiError('Error de conexión.'); }
      finally { setIsLoading(false); }
    }
  };

  const handleGoogleSignIn = async () => {
    console.log("Google Sign In - Placeholder");
  };

  const themeColor = '#F1A9A0';
  const titles = ["Crea Tu Cuenta", "Información", "Personaliza"];
  const subtitles = ["Creemos una cuenta juntos", "Personal", "Tu perfil"];

  const MainButton = () => (
     <button type="button" onClick={handleNextOrSubmit} disabled={isLoading /*<<<--- ELIMINADO || isGoogleLoading*/} style={{ backgroundColor: isLoading ? '#cccccc' : themeColor }} className={`w-full text-white py-2 rounded-full font-bold text-lg shadow-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-5 select-none cursor-pointer`}>
       {isLoading ? 'Procesando...' : isLastStep ? 'Comenzar' : 'Siguiente'}
     </button>
   );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6 relative select-none">
      {/* FRANJA ROSA DECORATIVA */}
      <EllipseCorner />

      {/* 'cursor-pointer' */}
      <button onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.push('/identificacion')} style={{ backgroundColor: themeColor }} className="absolute top-8 left-6 flex items-center justify-center w-10 h-10 rounded-full text-white hover:opacity-90 transition-opacity z-10 cursor-pointer" aria-label="Volver">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>

      <main className="flex-grow flex flex-col items-center justify-center pt-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-6"> <h1 className="text-3xl font-bold mb-1" style={{ color: themeColor }}> {titles[currentStep]} </h1> <p className="text-gray-600"> {subtitles[currentStep]} </p> </div>
            {isLastStep && ( <div className="flex justify-center mb-4"> <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"> <span className="text-gray-400 text-sm">Perfil</span> </div> </div> )}

            <form onSubmit={handleNextOrSubmit} className="space-y-3">
              {apiError && ( <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center"><span>{apiError}</span></div> )}

              {currentStep === 0 && ( <>
                <Input label="Nombre Completo" type="text" id="nombreCompleto" name="nombreCompleto" value={formData.nombreCompleto} onChange={handleInputChange} placeholder="Alisson Becker" error={errors.nombreCompleto} disabled={isLoading} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-900 font-semibold mb-1 ml-3"/>
                <Input label="Correo Electrónico" type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="alissonbecker@gmail.com" error={errors.email} disabled={isLoading} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-900 font-semibold mb-1 ml-3"/>
                <Input label="Contraseña" type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" error={errors.password} disabled={isLoading} showPasswordToggle={true} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-900 font-semibold mb-1 ml-3"/>
                <Input label="Confirmar Contraseña" type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="••••••••" error={errors.confirmPassword} disabled={isLoading} showPasswordToggle={true} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-900 font-semibold mb-1 ml-3"/>
                {/* Botón Google */}
                 <button type="button" disabled={isLoading} onClick={handleGoogleSignIn} className={`w-full bg-white border-none text-gray-800 py-2 rounded-full font-bold text-lg shadow-sm hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 select-none cursor-pointer`}>
                      Inicia con google
                 </button>
               </> )}
              {currentStep === 1 && ( <>
                  <div> <label className="block text-sm font-semibold text-gray-700 mb-1 ml-3">Nombre</label> <div className="bg-gray-100 border border-gray-300 rounded-full text-gray-700 px-5 py-3 text-sm">{formData.nombreCompleto || 'Nombre no ingresado'}</div> </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 ml-3">Edad</label>
                    <div className="flex gap-2">
                      <select name="day" value={formData.day} onChange={handleInputChange} disabled={isLoading} className={`flex-1 appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 text-gray-700 text-center text-sm focus:outline-none focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] ${errors.edad && !formData.day ? 'border-red-400' : ''}`}>
                         <option value="" disabled>Día</option>
                         {Array.from({ length: 31 }, (_, i) => i + 1).map(day => ( <option key={day} value={day}>{day}</option> ))}
                      </select>
                      <select name="month" value={formData.month} onChange={handleInputChange} disabled={isLoading} className={`flex-1 appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 text-gray-700 text-center text-sm focus:outline-none focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] ${errors.edad && !formData.month ? 'border-red-400' : ''}`}>
                         <option value="" disabled>Mes</option>
                         {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, i) => ( <option key={month} value={String(i + 1).padStart(2, '0')}>{month}</option> ))}
                      </select>
                      <select name="year" value={formData.year} onChange={handleInputChange} disabled={isLoading} className={`flex-1 appearance-none bg-white border border-gray-300 rounded-full px-4 py-3 text-gray-700 text-center text-sm focus:outline-none focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] ${errors.edad && !formData.year ? 'border-red-400' : ''}`}>
                         <option value="" disabled>Año</option>
                         {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => ( <option key={year} value={year}>{year}</option> ))}
                      </select>
                    </div>
                     {errors.edad && <p className="mt-1 text-sm text-red-600 ml-3">{errors.edad}</p>}
                  </div>
                  <div> <label className="block text-sm font-semibold text-gray-700 mb-2 ml-3">Género</label> <div className="flex justify-start gap-4 px-3"> {['Masculino', 'Femenino', 'Otro'].map(gen => ( <label key={gen} className="flex items-center gap-1.5 cursor-pointer"> <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.genero === gen ? `border-[${themeColor}]` : 'border-gray-300'}`}> {formData.genero === gen && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>} </span> <input type="radio" name="genero" value={gen} checked={formData.genero === gen} onChange={handleInputChange} disabled={isLoading} className="sr-only"/> <span className="text-gray-700 text-sm">{gen}</span> </label> ))} </div> {errors.genero && <p className="mt-1 text-sm text-red-600 ml-3">{errors.genero}</p>} </div>
                  <Input label="Contacto de familiar / amigo de confianza" type="tel" id="contactoEmergencia" name="contactoEmergencia" value={formData.contactoEmergencia} onChange={handleInputChange} placeholder="+573009873587" error={errors.contactoEmergencia} disabled={isLoading} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-700 font-semibold mb-1 ml-3"/>
                  <div> <label className="block text-sm font-semibold text-gray-700 mb-2 ml-3">Institución referida</label> <div className="flex justify-start gap-6 px-3"> <label className="flex items-center gap-1.5 cursor-pointer"> <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.institucionReferida === 'Privada' ? `border-[${themeColor}]` : 'border-gray-300'}`}> {formData.institucionReferida === 'Privada' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>} </span> <input type="radio" name="institucionReferida" value="Privada" checked={formData.institucionReferida === 'Privada'} onChange={handleInputChange} disabled={isLoading} className="sr-only"/> <span className="text-gray-700 text-sm">Privada</span> </label> <label className="flex items-center gap-1.5 cursor-pointer"> <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.institucionReferida === 'Pública' ? `border-[${themeColor}]` : 'border-gray-300'}`}> {formData.institucionReferida === 'Pública' && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColor }}></span>} </span> <input type="radio" name="institucionReferida" value="Pública" checked={formData.institucionReferida === 'Pública'} onChange={handleInputChange} disabled={isLoading} className="sr-only"/> <span className="text-gray-700 text-sm">Pública</span> </label> </div> </div>
                  {formData.institucionReferida === 'Pública' && ( <Input label="Nombre de institución" type="text" id="nombreInstitucion" name="nombreInstitucion" value={formData.nombreInstitucion} onChange={handleInputChange} placeholder="I.P.S LA DIVINA MISERICORDIA S.A.S." error={errors.nombreInstitucion} disabled={isLoading} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-700 font-semibold mb-1 ml-3"/> )}
               </> )}
              {currentStep === 2 && ( <>
                  <div className="text-center mb-2"> <span className="font-semibold text-lg text-gray-900">{formData.nombreCompleto}</span> </div>
                  <Input label="ID Nombre avatar" type="text" id="idNombreAvatar" name="idNombreAvatar" value={formData.idNombreAvatar} onChange={handleInputChange} placeholder="Nikky01" error={errors.idNombreAvatar} disabled={isLoading} className={`bg-white border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:border-[${themeColor}] focus:ring-1 focus:ring-[${themeColor}] px-5 py-3`} labelClassName="text-gray-900 font-semibold mb-1 ml-3"/>
                  <div> <label className="block text-sm font-semibold text-gray-900 mb-2 ml-3">Horario de Uso</label> <div className="grid grid-cols-3 gap-2 px-1"> {['3-8 Horas', '8-14 Horas', '14-20 Horas', '20-24 Horas', '24-30 Horas'].map(horario => ( <label key={horario} className={`text-center text-sm rounded-full py-2 px-1 border cursor-pointer transition-colors ${formData.horarioUso === horario ? 'bg-pink-100 border-pink-300 text-pink-700 font-medium' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}> <input type="radio" name="horarioUso" value={horario} checked={formData.horarioUso === horario} onChange={handleInputChange} disabled={isLoading} className="sr-only"/> {horario} </label> ))} </div> {errors.horarioUso && <p className="mt-1 text-sm text-red-600 ml-3">{errors.horarioUso}</p>} </div>
                  <div> <label className="block text-sm font-semibold text-gray-900 mb-2 ml-3">Duración de Uso</label> <div className="grid grid-cols-3 gap-2 px-1"> {['3-8 Horas', '8-14 Horas', '14-20 Horas', '20-24 Horas', '24-30 Horas'].map(duracion => ( <label key={duracion} className={`text-center text-sm rounded-full py-2 px-1 border cursor-pointer transition-colors ${formData.duracionUso === duracion ? 'bg-pink-100 border-pink-300 text-pink-700 font-medium' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}> <input type="radio" name="duracionUso" value={duracion} checked={formData.duracionUso === duracion} onChange={handleInputChange} disabled={isLoading} className="sr-only"/> {duracion} </label> ))} </div> {errors.duracionUso && <p className="mt-1 text-sm text-red-600 ml-3">{errors.duracionUso}</p>} </div>
               </> )}

              {/* Paginación y Botón Principal */}
              <div className="pt-4 flex justify-center"> <PaginationDots current={currentStep} total={totalSteps} /> </div>
              <MainButton />

            </form>
          </div>
      </main>

      <footer className="w-full max-w-sm mx-auto pb-8 pt-4"> <div className="text-center"> <p className="text-sm text-gray-600"> ¿Ya Tienes Una Cuenta?{' '} <Link href={`/auth/login/${role}`} style={{ color: themeColor }} className="font-semibold hover:underline transition-colors cursor-pointer"> Inicia Sesión </Link> </p> </div> </footer>
    </div>
  );
}

const themeColorForFallback = '#F1A8A9';
export default function RegisterPage() { return ( <Suspense fallback={ <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{borderColor: themeColorForFallback}}></div></div> }> <RegisterForm /> </Suspense> ); }