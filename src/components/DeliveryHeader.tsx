import React from 'react';
import { Chip } from '@heroui/react';
import { IconCoffee, IconBell } from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface DeliveryHeaderProps {
  currentOutlet?: Outlet;
  ownerName?: string;
  storeName?: string;
}

export const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({
  currentOutlet,
  ownerName = 'Jasdor Partner',
  storeName,
}) => {
  const displayName = storeName || currentOutlet?.brand || 'Kopi Kenangan';

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3 text-left">
        {/* Avatar / Brand Icon */}
        <div className="w-10 h-10 rounded-2xl bg-stone-900 text-white flex items-center justify-center shrink-0 shadow-xs">
          <IconCoffee size={20} stroke={2} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-stone-400 uppercase tracking-wider">
              {ownerName}
            </span>
            <Chip size="sm" variant="soft" color="success" className="h-4 px-1.5 text-[9px] font-semibold">
              Buka
            </Chip>
          </div>
          <h2 className="font-extrabold text-stone-900 text-base tracking-tight truncate max-w-[230px] leading-tight">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Notifikasi Icon */}
      <button
        type="button"
        className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors cursor-pointer"
        aria-label="Notifikasi"
      >
        <IconBell size={18} stroke={1.75} />
      </button>
    </div>
  );
};

