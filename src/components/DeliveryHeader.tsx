import React from 'react';
import { Chip } from '@heroui/react';
import { IconMapPin, IconChevronDown, IconBell } from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface DeliveryHeaderProps {
  currentOutlet: Outlet;
  onOpenOutletPicker: () => void;
}

export const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({
  currentOutlet,
  onOpenOutletPicker,
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <button
        type="button"
        onClick={onOpenOutletPicker}
        className="flex items-start gap-2.5 text-left group"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
          <IconMapPin size={18} stroke={2} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-full">
              {currentOutlet.location.city || 'Semarang'}
            </span>
            <Chip size="sm" variant="soft" color="success" className="h-4 px-1.5 text-[9px] font-semibold">
              Buka
            </Chip>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <h2 className="font-bold text-stone-900 text-sm tracking-tight truncate max-w-[220px]">
              {currentOutlet.name}
            </h2>
            <IconChevronDown size={14} className="text-stone-400 group-hover:text-stone-700 transition-colors" />
          </div>
        </div>
      </button>

      {/* Notifikasi Icon */}
      <button
        type="button"
        className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
        aria-label="Notifikasi"
      >
        <IconBell size={18} stroke={1.75} />
      </button>
    </div>
  );
};
