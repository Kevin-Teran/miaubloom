/**
 * @file ProfilePagination.tsx
 * @description Componente de paginación visual para los pasos
 * 
 * Color activo: var(--color-theme-primary) (Rosa/Azul dinámico)
 * Color inactivo: #F0F0F0 (Gris muy claro)
 */

interface ProfilePaginationProps {
  current: number;
  total: number;
}

export function ProfilePagination({ current, total }: ProfilePaginationProps) {
  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className="h-2 rounded-full transition-all duration-300"
          style={{
            width: index === current ? '24px' : '8px',
            backgroundColor: index === current ? 'var(--color-theme-primary)' : '#F0F0F0',
          }}
        />
      ))}
    </div>
  );
}
