import { useState } from 'react';
import {
  IconSearch,
  IconShoppingCart,
  IconCoffee,
  IconSparkles,
} from '@tabler/icons-react';
import { mockOutlets } from './data/mockOutlets';
import type { Outlet, MenuItem } from './types/catalog';
import type { CartItem } from './types/cart';
import { OutletSelector } from './components/OutletSelector';
import { ProductCard } from './components/ProductCard';
import { VariantModal } from './components/VariantModal';
import { CartDrawer } from './components/CartDrawer';
import { formatRupiah } from './utils/whatsapp';

export default function App() {
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(mockOutlets[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchMenuQuery, setSearchMenuQuery] = useState<string>('');

  // Cart & Modal States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filter Categories
  const categories = ['All', ...currentOutlet.categories];

  const filteredMenus = currentOutlet.menus.filter((item) => {
    const matchCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchSearch =
      item.name.toLowerCase().includes(searchMenuQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchMenuQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleChangeOutlet = (newOutlet: Outlet) => {
    if (newOutlet.id !== currentOutlet.id) {
      setCurrentOutlet(newOutlet);
      setSelectedCategory('All');
      setSearchMenuQuery('');
      // Jika ganti outlet dan ada cart, bisa ditanyakan atau reset
      if (cartItems.length > 0) {
        setCartItems([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-28">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <IconCoffee size={18} stroke={1.75} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-stone-900 block leading-tight">
                Jasdor
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                Pesan Cepat via WhatsApp
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors"
          >
            <IconShoppingCart size={16} stroke={2} />
            <span>Keranjang</span>
            {totalQuantity > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold">
                {totalQuantity}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Outlet Selector Card di Paling Atas */}
        <OutletSelector
          outlets={mockOutlets}
          currentOutlet={currentOutlet}
          onSelectOutlet={handleChangeOutlet}
        />

        {/* Banner Gerai Singkat */}
        <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white p-4 sm:p-6">
          <img
            src={currentOutlet.bannerUrl}
            alt={currentOutlet.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          <div className="relative z-10 max-w-lg">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 mb-2">
              <IconSparkles size={12} />
              {currentOutlet.brand}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentOutlet.tagline}
            </h1>
            <p className="text-xs text-stone-300 mt-1 line-clamp-1">
              {currentOutlet.address} • Jam: {currentOutlet.openingHours}
            </p>
          </div>
        </div>

        {/* Search & Category Filter Section */}
        <div className="space-y-3 pt-2">
          {/* Menu Search Input */}
          <div className="relative">
            <IconSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchMenuQuery}
              onChange={(e) => setSearchMenuQuery(e.target.value)}
              placeholder={`Cari menu di ${currentOutlet.brand}...`}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-stone-200/80 rounded-2xl focus:outline-none focus:border-amber-700 shadow-xs"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {cat === 'All' ? 'Semua Menu' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              {selectedCategory === 'All' ? 'Daftar Menu' : selectedCategory}
            </h2>
            <span className="text-xs text-stone-400">
              {filteredMenus.length} item ditemukan
            </span>
          </div>

          {filteredMenus.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200/60 p-6">
              <p className="text-sm text-stone-500">Menu tidak ditemukan.</p>
              <p className="text-xs text-stone-400 mt-1">Coba kata kunci pencarian lain.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {filteredMenus.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onSelect={(selected) => setSelectedProduct(selected)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Cart Bar (Muncul saat keranjang terisi) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-stone-950 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between hover:bg-amber-900 transition-colors animate-in slide-in-from-bottom duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center">
                {totalQuantity}
              </span>
              <div className="text-left">
                <span className="text-xs text-stone-400 block font-normal leading-tight">
                  Total Pesanan
                </span>
                <span className="text-sm font-bold leading-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <span>Lihat Pesanan</span>
              <IconShoppingCart size={16} stroke={2} />
            </div>
          </button>
        </div>
      )}

      {/* Modal Pilihan Varian */}
      <VariantModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Drawer Keranjang & Checkout WhatsApp */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        outlet={currentOutlet}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
