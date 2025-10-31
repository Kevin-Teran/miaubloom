export default function TestErrorPage() {
  // throw new Error('Este es un error de prueba para ver la página 500');
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Página de Prueba</h1>
        <p className="text-gray-600">Esta es una página de prueba para errores</p>
      </div>
    </div>
  );
}
