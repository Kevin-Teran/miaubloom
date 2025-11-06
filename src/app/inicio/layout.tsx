/**
 * @file layout.tsx
 * @route src/app/inicio/layout.tsx
 * @description Layout para rutas de inicio (protegidas)
 */

export const dynamic = 'force-dynamic';

export default function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
