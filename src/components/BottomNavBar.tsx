import React from 'react';
import {
  IconHome,
  IconReceipt,
  IconShoppingBag,
  IconHeart,
  IconSettings,
} from '@tabler/icons-react';

interface BottomNavBarProps {
  activeTab: string;
  cartCount: number;
  onSelectTab: (tab: string) => void;
  onOpenCart: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  cartCount,
  onSelectTab,
  onOpenCart,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/60 pb-safe">
      <div className="max-w-md mx-auto px-6 py-2.5 flex items-center justify-between">
        {/* Home */}
        <button
          type="button"
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'home' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
          }`}
          aria-label="Beranda"
        >
          <div className={`p-1 rounded-xl ${activeTab === 'home' ? 'bg-stone-100' : ''}`}>
            <IconHome size={22} stroke={activeTab === 'home' ? 2.25 : 1.5} />
          </div>
        </button>

        {/* Pesanan / Riwayat */}
        <button
          type="button"
          onClick={() => onSelectTab('orders')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'orders' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
          }`}
          aria-label="Riwayat Pesanan"
        >
          <div className={`p-1 rounded-xl ${activeTab === 'orders' ? 'bg-stone-100' : ''}`}>
            <IconReceipt size={22} stroke={activeTab === 'orders' ? 2.25 : 1.5} />
          </div>
        </button>

        {/* Keranjang / Bag Belanja */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center gap-1 transition-colors text-stone-900"
          aria-label="Keranjang Belanja"
        >
          <div className="p-1 rounded-xl relative">
            <IconShoppingBag size={22} stroke={1.75} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
        </button>

        {/* Favorit */}
        <button
          type="button"
          onClick={() => onSelectTab('favorites')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'favorites' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
          }`}
          aria-label="Favorit"
        >
          <div className={`p-1 rounded-xl ${activeTab === 'favorites' ? 'bg-stone-100' : ''}`}>
            <IconHeart size={22} stroke={activeTab === 'favorites' ? 2.25 : 1.5} />
          </div>
        </button>

        {/* Pengaturan / Profil */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${
            activeTab === 'settings' ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
          }`}
          aria-label="Pengaturan"
        >
          <div className={`p-1 rounded-xl ${activeTab === 'settings' ? 'bg-stone-100' : ''}`}>
            <IconSettings size={22} stroke={activeTab === 'settings' ? 2.25 : 1.5} />
          </div>
        </button>
      </div>
    </nav>
  );
};
