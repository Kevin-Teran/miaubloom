/**
 * @file UsageDuration.tsx
 * @description Componente para seleccionar duración de uso
 * 
 * Tipografía (Roboto):
 * - Título: 18px SemiBold (#070806)
 * - Botones: 16px Medium (#070806)
 */

interface UsageDurationProps {
  selectedDuration: string;
  onDurationChange: (duration: string) => void;
}

const durationOptions = [
  { id: '3-8', label: '3-8 Horas' },
  { id: '8-14', label: '8-14 Horas' },
  { id: '14-20', label: '14-20 Horas' },
  { id: '20-24', label: '20-24 Horas' },
  { id: '24-30', label: '24-30 Horas' },
];

export function UsageDuration({ selectedDuration, onDurationChange }: UsageDurationProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 md:gap-3">
        {durationOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onDurationChange(option.id)}
            className="px-4 md:px-5 py-2 rounded-full font-roboto text-sm md:text-base transition-all duration-300"
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: selectedDuration === option.id ? '#FFFFFF' : '#070806',
              backgroundColor: selectedDuration === option.id ? 'var(--color-theme-primary)' : '#F0F0F0',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
