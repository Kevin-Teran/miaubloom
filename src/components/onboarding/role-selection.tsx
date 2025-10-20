/**
 * @file role-selection.tsx
 * @route components/onboarding/role-selection.tsx
 * @description Pantalla de selección de rol
 * @author Kevin Mariano
 * @version 3.0.2
 * @since 1.0.0
 * @copyright MiauBloom
 */

'use client';

import { useState, useEffect } from 'react';
import { Cat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type RoleKeys = 'patient' | 'psychologist' | 'admin';

interface RoleSelectionProps {
  onSelect: (role: RoleKeys) => void;
  initialSelection: RoleKeys | 'none';
}

export default function RoleSelection({ onSelect, initialSelection }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<RoleKeys | null>(null);

  useEffect(() => {
    if (initialSelection !== 'none') {
      setSelectedRole(initialSelection);
    }
  }, [initialSelection]);

  const handleContinue = () => {
    if (selectedRole) {
      onSelect(selectedRole); 
    }
  };
  
  const roleOptions: { key: RoleKeys, label: string, iconColor: string }[] = [
    { key: 'patient', label: 'Paciente', iconColor: 'text-[#F2C2C1]' },
    { key: 'psychologist', label: 'Psicólogo', iconColor: 'text-primary' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-[#F2C2C1] rounded-full flex items-center justify-center shadow-md">
              <Cat className="w-12 h-12 text-white" />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Miau Bloom
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Crece y siente
            </p>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold text-foreground">
              ¿Cuál eres tú?
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {roleOptions.map((role) => (
            <Card
              key={role.key}
              className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-xl rounded-xl border-2 ${
                selectedRole === role.key
                  ? 'ring-4 ring-[#F2C2C1] bg-[#F2C2C1]/20 border-[#F2C2C1]'
                  : 'hover:bg-muted/50 border-border'
              }`}
              onClick={() => setSelectedRole(role.key)}
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-20 h-20 bg-card rounded-full flex items-center justify-center shadow-inner border-2 border-border">
                  <Cat className={`w-10 h-10 ${role.iconColor}`} />
                </div>
                <span className="font-semibold text-foreground">{role.label}</span>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full bg-[#F2C2C1] hover:bg-[#E5B5B4] text-white font-medium py-6 text-lg rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Comenzar
        </Button>
      </div>
    </div>
  );
}