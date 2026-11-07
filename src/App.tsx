import { useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Dropdown,
  Label,
  Modal,
} from '@heroui/react';
import {
  IconSearch,
  IconAdjustmentsHorizontal,
  IconClock,
  IconMapPin,
  IconCheck,
  IconSparkles,
  IconChevronDown,
} from '@tabler/icons-react';
import { mockOutlets } from './data/mockOutlets';
import type { Outlet, MenuItem } from './types/catalog';
import type { CartItem } from './types/cart';
import { DeliveryHeader } from './components/DeliveryHeader';
import { OutletScrollList } from './components/OutletScrollList';
import { CleanProductCard } from './components/CleanProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { VariantModal } from './components/VariantModal';
import { CartDrawer } from './components/CartDrawer';
import { BottomNavBar } from './components/BottomNavBar';
import { formatRupiah } from './utils/whatsapp';

export default function App() {
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(mockOutlets[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Modal & Drawer States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [detailProduct, setDetailProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOutletPickerOpen, setIsOutletPickerOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', ...currentOutlet.categories];

  const filteredMenus = currentOutlet.menus
    .filter((item) => {
      const matchCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      return 0;
    });

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
  };

  const handleQuickAdd = (menuItem: MenuItem) => {
    if (menuItem.optionGroups && menuItem.optionGroups.length > 0) {
      setSelectedProduct(menuItem);
      return;
    }
    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity: 1,
      selectedOptions: [],
      unitPrice: menuItem.basePrice,
      totalPrice: menuItem.basePrice,
    };
    handleAddToCart(cartItem);
  };

  const handleBuyNow = (cartItem: CartItem) => {
    handleAddToCart(cartItem);
    setDetailProduct(null);
    setIsCartOpen(true);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
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
      setSearchQuery('');
      if (cartItems.length > 0) {
        setCartItems([]);
      }
    }
  };

  if (detailProduct) {
    return (
      <ProductDetailPage
        item={detailProduct}
        onBack={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        isFavorite={favorites.includes(detailProduct.id)}
        onToggleFavorite={handleToggleFavorite}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-stone-900 pb-28 font-sans antialiased">
      {/* App Shell Container Maksimal Mobile-First seperti di Referensi */}
      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* 1. Header Lokasi & Notifikasi (Mirip iPhone Top Header) */}
        <DeliveryHeader
          currentOutlet={currentOutlet}
          onOpenOutletPicker={() => setIsOutletPickerOpen(true)}
        />

        {/* 2. Search Bar Bersih dengan Dropdown Filter Popover (Bukan Popup Modal) */}
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <IconSearch
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search coffee, tea, meals..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-100 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-stone-900/10 placeholder:text-stone-400"
            />
          </div>

          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                  sortBy !== 'default'
                    ? 'bg-[#0a2e1f] text-[#2fdc8f]'
                    : 'bg-stone-100 text-stone-700'
                }`}
                aria-label="Filter dan sortir menu"
              >
                <IconAdjustmentsHorizontal size={18} stroke={1.75} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom end">
              <Dropdown.Menu onAction={(key) => setSortBy(key as any)}>
                <Dropdown.Item id="default" textValue="Default">
                  <div className="flex items-center justify-between w-full py-0.5 text-xs">
                    <Label className="font-medium text-stone-900">Rekomendasi</Label>
                    {sortBy === 'default' && <IconCheck size={14} className="text-[#0a2e1f]" stroke={2.5} />}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="price-asc" textValue="Termurah">
                  <div className="flex items-center justify-between w-full py-0.5 text-xs">
                    <Label className="font-medium text-stone-900">Harga Terendah</Label>
                    {sortBy === 'price-asc' && <IconCheck size={14} className="text-[#0a2e1f]" stroke={2.5} />}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="price-desc" textValue="Termahal">
                  <div className="flex items-center justify-between w-full py-0.5 text-xs">
                    <Label className="font-medium text-stone-900">Harga Tertinggi</Label>
                    {sortBy === 'price-desc' && <IconCheck size={14} className="text-[#0a2e1f]" stroke={2.5} />}
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>
        </div>

        {/* 3. Horizontal Scrollable Outlet Logo Placeholders (Width > Height) */}
        <OutletScrollList
          outlets={mockOutlets}
          currentOutlet={currentOutlet}
          onSelectOutlet={handleChangeOutlet}
        />

        {/* 4. Promo Dark Banner (Presisi Banner di Gambar Referensi: Hijau Tua Elegan #0d3826 + Pill Button) */}
        <div className="relative rounded-[20px] overflow-hidden bg-[#0a2e1f] text-white px-5 py-4 flex items-center justify-between border border-[#144732]/40 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[15px] tracking-tight text-white">
                Pesan Cepat via WhatsApp
              </span>
              <IconSparkles size={15} className="text-amber-300 shrink-0" />
            </div>
            <p className="text-xs text-[#2fdc8f] font-normal tracking-tight">
              Otomatis rapi tanpa ngetik manual
            </p>
          </div>

          <div className="px-4 py-2 rounded-full bg-white text-stone-900 text-xs font-semibold tracking-tight shadow-xs shrink-0 ml-3">
            {currentOutlet.brand}
          </div>
        </div>

        {/* 5. Sub-filter Dropdown & Category Pills */}
        <div className="flex items-center justify-between pt-1 overflow-x-auto no-scrollbar gap-2">
          {/* Dropdown Kategori Menu (Bukan Popup Modal) */}
          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#0a2e1f] text-[#2fdc8f] text-xs font-semibold shrink-0"
              >
                <span>{selectedCategory === 'All' ? 'Semua Kategori' : selectedCategory}</span>
                <IconChevronDown size={14} stroke={2} />
              </button>
            </Dropdown.Trigger>
            <Dropdown.Popover placement="bottom start">
              <Dropdown.Menu onAction={(key) => setSelectedCategory(key as string)}>
                {categories.map((cat) => (
                  <Dropdown.Item key={cat} id={cat} textValue={cat}>
                    <div className="flex items-center justify-between w-full py-0.5 text-xs">
                      <Label className="font-medium text-stone-900">
                        {cat === 'All' ? 'Semua Menu' : cat}
                      </Label>
                      {selectedCategory === cat && (
                        <IconCheck size={14} className="text-[#0a2e1f]" stroke={2.5} />
                      )}
                    </div>
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <div className="flex items-center gap-2 shrink-0 py-0.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium ${
                    isActive
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {cat === 'All' ? 'Semua' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Grid Produk 2 Kolom Bersih (Mirip Phone 1 & 2 di Referensi Desain) */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {filteredMenus.map((item) => (
            <CleanProductCard
              key={item.id}
              item={item}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={handleToggleFavorite}
              onSelect={(selected) => setDetailProduct(selected)}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </div>
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 inset-x-4 max-w-md mx-auto z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-stone-950 text-white p-3.5 rounded-2xl shadow-xl flex items-center justify-between hover:bg-stone-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center">
                {totalQuantity}
              </span>
              <div className="text-left">
                <span className="text-[11px] text-stone-400 block font-normal leading-tight">
                  Total Pesanan
                </span>
                <span className="text-sm font-bold leading-tight">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </div>

            <span className="text-xs font-semibold text-emerald-400">
              Lihat Keranjang &gt;
            </span>
          </button>
        </div>
      )}

      {/* 7. Bottom Navigation Bar Bersih (Mirip di Bagian Bawah Gambar Referensi) */}
      <BottomNavBar
        activeTab={activeTab}
        cartCount={totalQuantity}
        onSelectTab={setActiveTab}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* HeroUI Outlet Picker Modal */}
      <Modal isOpen={isOutletPickerOpen} onOpenChange={setIsOutletPickerOpen}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="sm">
            <Modal.Dialog className="w-full">
              <Modal.Header>
                <Modal.Heading>Pilih Gerai Outlet</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>

              <Modal.Body className="space-y-2 max-h-[60vh] overflow-y-auto">
                {mockOutlets.map((outlet) => {
                  const isSelected = outlet.id === currentOutlet.id;
                  return (
                    <Card
                      key={outlet.id}
                      variant={isSelected ? 'tertiary' : 'default'}
                      className={`cursor-pointer transition-colors p-3 ${
                        isSelected ? 'border-emerald-600' : ''
                      }`}
                      onClick={() => {
                        handleChangeOutlet(outlet);
                        setIsOutletPickerOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground truncate">
                              {outlet.name}
                            </span>
                            {isSelected && (
                              <Chip size="sm" variant="primary" color="success" className="h-4.5 text-[10px]">
                                Aktif
                              </Chip>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted mb-1">
                            <IconMapPin size={14} className="shrink-0" />
                            <span className="truncate">{outlet.address}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted">
                            <IconClock size={14} className="shrink-0" />
                            <span>{outlet.openingHours}</span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                            <IconCheck size={14} stroke={2.5} />
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </Modal.Body>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  fullWidth
                  onPress={() => setIsOutletPickerOpen(false)}
                >
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* HeroUI Variant Modal */}
      <VariantModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* HeroUI Cart Drawer & WhatsApp Form */}
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
