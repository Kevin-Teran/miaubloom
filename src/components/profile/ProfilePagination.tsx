/**
 * @file ProfilePagination.tsx
 * @description Componente de indicadores de progreso
 * 
 * Color activo: #F2C2C1 (Rosa)
 * Color inactivo: #B6BABE (Gris)
 */

interface ProfilePaginationProps {
  current: number;
  total: number;
}

export function ProfilePagination({ current, total }: ProfilePaginationProps) {
  return (
    <div className="flex items-center justify-center gap-2 my-6">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="h-1.5 rounded-full transition-all duration-300"
          style={{
            backgroundColor: index === current ? '#F2C2C1' : '#B6BABE',
            width: index === current ? '32px' : '6px',
          }}
        />
      ))}
    </div>
  );
}
