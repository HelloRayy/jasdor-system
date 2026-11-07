import React, { useState, useMemo } from 'react';
import { Modal } from '@heroui/react';
import {
  IconSearch,
  IconMapPin,
  IconCheck,
  IconBuildingStore,
  IconChevronRight,
  IconNavigation,
} from '@tabler/icons-react';
import type { Outlet } from '../types/catalog';

interface OutletComboboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  outlets: Outlet[];
  currentOutlet: Outlet;
  onSelectOutlet: (outlet: Outlet) => void;
}

export const OutletComboboxModal: React.FC<OutletComboboxModalProps> = ({
  isOpen,
  onClose,
  outlets,
  currentOutlet,
  onSelectOutlet,
}) => {
  // Ambil daftar kota unik
  const cities = useMemo(() => {
    const list = Array.from(new Set(outlets.map((o) => o.location.city || 'Semarang')));
    // Prioritaskan Semarang di paling depan
    return list.sort((a, b) => (a === 'Semarang' ? -1 : b === 'Semarang' ? 1 : a.localeCompare(b)));
  }, [outlets]);

  const [selectedCity, setSelectedCity] = useState<string>(currentOutlet.location.city || 'Semarang');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter cabang berdasarkan kota dan kata kunci pencarian
  const filteredOutlets = useMemo(() => {
    return outlets.filter((o) => {
      const matchCity = selectedCity === 'Semua Kota' || o.location.city === selectedCity;
      const matchQuery =
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [outlets, selectedCity, searchQuery]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <Modal.Backdrop variant="blur" className="flex items-center justify-center p-3 sm:p-4">
        <Modal.Container size="md" className="w-full max-w-lg my-auto">
          <Modal.Dialog className="w-full rounded-3xl bg-white border border-stone-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Header Modal */}
            <Modal.Header className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white flex items-center justify-center">
                  <IconBuildingStore size={18} stroke={2} />
                </div>
                <div>
                  <Modal.Heading className="text-sm font-bold text-stone-900">
                    Pilih Kota & Gerai Kopi Kenangan
                  </Modal.Heading>
                  <p className="text-[11px] text-stone-500">
                    Tersedia di berbagai kota besar di Indonesia
                  </p>
                </div>
              </div>
              <Modal.CloseTrigger className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors flex items-center justify-center focus:outline-none" />
            </Modal.Header>

            {/* Input Pencarian Cerdas */}
            <div className="p-4 pb-2 space-y-3 shrink-0 bg-stone-50/50 border-b border-stone-100">
              <div className="relative flex items-center">
                <IconSearch size={16} className="absolute left-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama mall, jalan, atau area..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-all shadow-xs"
                />
              </div>

              {/* Selector Baris Kota (Pills) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <button
                  type="button"
                  onClick={() => setSelectedCity('Semua Kota')}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedCity === 'Semua Kota'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-100'
                  }`}
                >
                  Semua Kota
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => {
                      setSelectedCity(city);
                      setSearchQuery('');
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCity === city
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200/80 hover:bg-stone-100'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* List Cabang Outlet Terverifikasi */}
            <div className="p-3 overflow-y-auto space-y-2 flex-1 divide-y divide-stone-100">
              <div className="px-1 pb-1 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-stone-400">
                <span>Daftar Gerai Resmi di {selectedCity}</span>
                <span>{filteredOutlets.length} Lokasi</span>
              </div>

              {filteredOutlets.length === 0 ? (
                <div className="text-center py-10 text-stone-400 space-y-1">
                  <p className="text-xs font-semibold text-stone-600">Tidak ada gerai yang cocok</p>
                  <p className="text-[11px]">Coba cari nama mall atau ganti pilihan kota di atas.</p>
                </div>
              ) : (
                filteredOutlets.map((outlet) => {
                  const isSelected = outlet.id === currentOutlet.id;
                  return (
                    <div
                      key={outlet.id}
                      onClick={() => {
                        onSelectOutlet(outlet);
                        onClose();
                      }}
                      className={`pt-2.5 first:pt-0 pb-1 cursor-pointer group flex items-start justify-between gap-3 p-3 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-stone-900 text-white shadow-sm'
                          : 'hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`font-semibold text-xs truncate ${
                              isSelected ? 'text-white' : 'text-stone-900'
                            }`}
                          >
                            {outlet.name}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                              isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {outlet.location.city}
                          </span>
                        </div>

                        <p
                          className={`text-[11px] line-clamp-2 leading-relaxed ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          <IconMapPin size={12} className="inline mr-1 shrink-0 -mt-0.5" />
                          {outlet.address}
                        </p>
                      </div>

                      <div className="shrink-0 mt-0.5">
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                            <IconCheck size={14} stroke={3} />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-stone-200 text-stone-400 group-hover:text-stone-700 flex items-center justify-center transition-colors">
                            <IconChevronRight size={14} stroke={2} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Modal */}
            <Modal.Footer className="px-4 py-3 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                <IconNavigation size={13} className="text-emerald-600" />
                <span>Format nama resmi siap copy ke Google Maps</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
