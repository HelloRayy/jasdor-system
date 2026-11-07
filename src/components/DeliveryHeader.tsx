import React from 'react';
import { Chip } from '@heroui/react';
import { IconBuildingStore } from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface DeliveryHeaderProps {
  currentOutlet?: Outlet;
  ownerName?: string;
  storeName?: string;
  onOpenOutletPicker?: () => void;
}

export const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({
  currentOutlet,
  ownerName = 'Jasdor Partner',
  storeName,
  onOpenOutletPicker,
}) => {
  const displayName = storeName || currentOutlet?.brand || 'Kopi Kenangan';

  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-3 text-left min-w-0">
        {/* Brand Icon / Avatar: Gallery White (#ffffff) & Hairline Silver (#d6d6d6) */}
        <div className="w-11 h-11 rounded-2xl bg-gallery-white border border-hairline p-2 flex items-center justify-center shrink-0 shadow-2xs">
          <img
            src="/images/kopi-kenangan-cup.png"
            alt={displayName}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate font-medium">
              {ownerName}
            </span>
            <Chip size="sm" variant="secondary" className="h-4.5 px-2 text-[10px] font-semibold text-pricing-blue bg-paper-frost border border-hairline">
              Buka
            </Chip>
          </div>
          <h2 className="font-semibold text-ink text-lg tracking-tight truncate leading-tight mt-0.5">
            {displayName}
          </h2>
        </div>
      </div>

      {/* Button Pilih Gerai Minimalis */}
      <button
        type="button"
        onClick={onOpenOutletPicker}
        className="w-10 h-10 rounded-2xl bg-gallery-white border border-hairline hover:bg-studio-mist flex items-center justify-center text-ink transition-colors cursor-pointer shrink-0 shadow-2xs"
        aria-label="Pilih cabang gerai"
      >
        <IconBuildingStore size={19} stroke={1.75} />
      </button>
    </div>
  );
};
