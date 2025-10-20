import Button from '@/components/ui/Button';

/**
 * @file page.tsx
 * @route src/app/(main)/dashboard/page.tsx
 * @description Página de inicio (Dashboard) para usuarios logueados.
 * Se puede dividir en componentes específicos para Paciente o Psicólogo.
 */
export default function DashboardPage() {
    // Lógica para determinar el rol (se usaría un hook de contexto/sesión real)
    const userRole = 'Psicólogo'; 
    const userName = 'Andrés Márquez';

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-text-dark">
                ¡Hola {userName}! Empecemos
            </h2>
            
            {userRole === 'Psicólogo' ? (
                // Simulación de la vista del Psicólogo (Pág. 13 del PDF)
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-heading-1 font-bold mb-4">Mis pacientes</h3>
                    <p className="text-body-1 text-text-light mb-4">
                        Revisa el estado general de tus pacientes asignados.
                    </p>
                    [cite_start]{/* Simulación de la Lista de Pacientes (Lucas Luna, Mia Paz, etc.) [cite: 625] */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 border rounded-lg">
                            <div className="w-12 h-12 bg-primary/20 rounded-full mx-auto mb-2"></div>
                            <p className="font-semibold text-body-1">Lucas Luna</p>
                            <span className="text-xs text-green-600">Normal</span>
                        </div>
                        {/* Más pacientes... */}
                    </div>
                    
                    <Button variant='primary' className='mt-6 w-auto'>
                        [cite_start]Ver Próximas Citas [cite: 618]
                    </Button>
                </section>
            ) : (
                // Simulación de la vista del Paciente (Pág. 15 del PDF)
                <section className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-heading-1 font-bold mb-4">Mi jardín emocional</h3>
                    <p className="text-body-1 text-text-light mb-4">
                        Mira el porcentaje de tus emociones registradas este mes.
                    </p>
                    
                    {/* Simulación de Porcentajes de Emoción (Pág. 15 del PDF) */}
                    <div className="flex justify-around text-center mb-6">
                        <div>
                            <p className="text-2xl font-bold text-primary">95%</p>
                            <p className="text-body-2">Alegría</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-yellow-600">75%</p>
                            <p className="text-body-2">Tristeza</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-purple-600">65%</p>
                            <p className="text-body-2">Frustración</p>
                        </div>
                    </div>

                    <Button variant='primary' className='mt-6 w-auto'>
                        Registrar Emoción
                    </Button>
                </section>
            )}
        </div>
    );
}