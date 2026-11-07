import React, { useState } from 'react';
import {
  IconBuildingStore,
  IconChevronDown,
  IconSearch,
  IconMapPin,
  IconClock,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface OutletSelectorProps {
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
}

export const OutletSelector: React.FC<OutletSelectorProps> = ({
  outlets,
  currentOutlet,
  onSelectOutlet,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOutlets = outlets.filter(
    (outlet) =>
      outlet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      outlet.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Trigger Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between w-full p-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-xs hover:border-amber-700/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 border border-amber-200/60">
            <IconBuildingStore size={22} stroke={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-medium tracking-wide text-stone-500">
                Pilih Gerai
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-emerald-700 font-medium">Buka</span>
            </div>
            <p className="text-sm font-semibold text-stone-900 truncate">
              {currentOutlet.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-stone-400 shrink-0 pl-2">
          <span className="text-xs font-medium hidden sm:inline text-stone-500">Ganti</span>
          <IconChevronDown size={18} stroke={1.75} />
        </div>
      </button>

      {/* Modal / Sheet Pemilihan Outlet */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/40 backdrop-blur-xs">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-stone-900 text-base">Pilih Gerai Outlet</h3>
                <p className="text-xs text-stone-500">Pilih outlet terdekat dengan lokasimu</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
              >
                <IconX size={18} stroke={1.75} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-stone-100">
              <div className="relative">
                <IconSearch
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama gerai atau area..."
                  className="w-full pl-9 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 focus:bg-white"
                />
              </div>
            </div>

            {/* List Outlet */}
            <div className="p-3 overflow-y-auto space-y-2">
              {filteredOutlets.map((outlet) => {
                const isSelected = outlet.id === currentOutlet.id;
                return (
                  <button
                    key={outlet.id}
                    type="button"
                    onClick={() => {
                      onSelectOutlet(outlet);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start justify-between gap-3 transition-colors ${
                      isSelected
                        ? 'border-amber-700/60 bg-amber-50/50'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-stone-900 truncate">
                          {outlet.name}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-800 text-white font-medium">
                            Aktif
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <IconMapPin size={14} className="shrink-0 text-stone-400" />
                        <span className="truncate">{outlet.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500">
                        <IconClock size={14} className="shrink-0 text-stone-400" />
                        <span>{outlet.openingHours}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0 mt-1">
                        <IconCheck size={14} stroke={2.5} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
