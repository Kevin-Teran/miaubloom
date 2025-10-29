/**
 * @file EllipseCorner.tsx
 * @description Componente decorativo de franja rosa reutilizable
 */

import Image from 'next/image';

export function EllipseCorner() {
  return (
    <div className="absolute top-0 right-0 w-full h-1/3 z-10 pointer-events-none opacity-50">
      <Image
        src="/assets/ellipse-corner.svg"
        alt=""
        fill
        className="object-contain object-top-right"
        unoptimized
        priority
      />
    </div>
  );
}
