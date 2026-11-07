import { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Chip,
} from '@heroui/react';
import {
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
      if (cartItems.length > 0) {
        setCartItems([]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-xs">
              <IconCoffee size={20} stroke={1.75} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground block leading-tight">
                Jasdor
              </span>
              <span className="text-[10px] text-muted font-medium">
                Pesan Cepat via WhatsApp
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onPress={() => setIsCartOpen(true)}
            className="relative gap-2"
          >
            <IconShoppingCart size={16} stroke={2} />
            <span>Keranjang</span>
            {totalQuantity > 0 && (
              <Chip size="sm" variant="primary" color="accent" className="h-5 min-w-5 px-1 text-[11px] font-bold">
                {totalQuantity}
              </Chip>
            )}
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
        {/* Outlet Selector Card */}
        <OutletSelector
          outlets={mockOutlets}
          currentOutlet={currentOutlet}
          onSelectOutlet={handleChangeOutlet}
        />

        {/* Banner Gerai */}
        <Card variant="tertiary" className="relative overflow-hidden p-5 sm:p-6 text-white bg-black">
          <img
            src={currentOutlet.bannerUrl}
            alt={currentOutlet.name}
            className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
          />
          <div className="relative z-10 max-w-lg">
            <Chip size="sm" variant="soft" color="accent" className="mb-2 gap-1">
              <IconSparkles size={12} />
              <span>{currentOutlet.brand}</span>
            </Chip>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              {currentOutlet.tagline}
            </h1>
            <p className="text-xs text-snow/80 mt-1 line-clamp-1">
              {currentOutlet.address} • Jam: {currentOutlet.openingHours}
            </p>
          </div>
        </Card>

        {/* Search & Category Filter Section */}
        <div className="space-y-3 pt-2">
          {/* Input Search HeroUI */}
          <Input
            fullWidth
            variant="secondary"
            value={searchMenuQuery}
            onChange={(e) => setSearchMenuQuery(e.target.value)}
            placeholder={`Cari menu di ${currentOutlet.brand}...`}
            aria-label="Cari menu"
          />

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <Button
                  key={cat}
                  size="sm"
                  variant={isActive ? 'primary' : 'outline'}
                  onPress={() => setSelectedCategory(cat)}
                  className={`rounded-full whitespace-nowrap text-xs ${
                    isActive ? '' : 'border-border'
                  }`}
                >
                  {cat === 'All' ? 'Semua Menu' : cat}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-muted uppercase tracking-wider">
              {selectedCategory === 'All' ? 'Daftar Menu' : selectedCategory}
            </h2>
            <span className="text-xs text-muted">
              {filteredMenus.length} item ditemukan
            </span>
          </div>

          {filteredMenus.length === 0 ? (
            <Card variant="secondary" className="text-center py-12 p-6">
              <p className="text-sm text-foreground">Menu tidak ditemukan.</p>
              <p className="text-xs text-muted mt-1">Coba kata kunci pencarian lain.</p>
            </Card>
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

      {/* Floating Bottom Cart Bar (HeroUI Button/Card) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-4 inset-x-4 max-w-lg mx-auto z-40">
          <Button
            variant="primary"
            fullWidth
            size="lg"
            className="p-3.5 h-auto justify-between shadow-xl"
            onPress={() => setIsCartOpen(true)}
          >
            <div className="flex items-center gap-2.5">
              <Chip size="sm" variant="primary" color="default" className="font-bold text-xs">
                {totalQuantity}
              </Chip>
              <div className="text-left">
                <span className="text-[11px] opacity-80 block font-normal leading-tight">
                  Total Pesanan
                </span>
                <span className="text-sm font-bold leading-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <span>Lihat Pesanan</span>
              <IconShoppingCart size={16} stroke={2} />
            </div>
          </Button>
        </div>
      )}

      {/* HeroUI Variant Modal */}
      <VariantModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* HeroUI Cart Drawer */}
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
