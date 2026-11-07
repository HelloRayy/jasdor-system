import { useState, useEffect } from 'react';
import {
  Button,
  Dropdown,
  Label,
  Modal,
  SearchField,
  Toast,
  toast,
} from '@heroui/react';
import {
  IconAdjustmentsHorizontal,
  IconCheck,
  IconShoppingBag,
} from '@tabler/icons-react';
import { BRANDS, getOutletsByBrand, type BrandInfo } from './data/mockBrands';
import type { Outlet, MenuItem } from './types/catalog';
import type { CartItem } from './types/cart';
import { DeliveryHeader } from './components/DeliveryHeader';
import { BrandSelector } from './components/BrandSelector';
import { CleanProductCard } from './components/CleanProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartStandalonePage } from './components/CartStandalonePage';
import { formatRupiah } from './utils/whatsapp';

export default function App() {
  const [currentBrand, setCurrentBrand] = useState<BrandInfo>(BRANDS[0]);
  const brandOutlets = getOutletsByBrand(currentBrand);
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(brandOutlets[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Modal & Drawer States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailProduct, setDetailProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingBrandChange, setPendingBrandChange] = useState<BrandInfo | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Integrasi Browser History: Tangani Tombol Back Bawaan HP / Browser
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (!state || state.view === 'home') {
        setDetailProduct(null);
        setIsCartOpen(false);
        setIsOutletPickerOpen(false);
      } else if (state.view === 'cart') {
        setDetailProduct(null);
        setIsCartOpen(true);
        setIsOutletPickerOpen(false);
      } else if (state.view === 'product') {
        const found = currentOutlet.menus.find((m) => m.id === state.productId);
        if (found) {
          setDetailProduct(found);
          setIsCartOpen(false);
          setIsOutletPickerOpen(false);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentOutlet]);

  const openProductDetail = (item: MenuItem) => {
    window.history.pushState({ view: 'product', productId: item.id }, '', `#product-${item.id}`);
    setDetailProduct(item);
  };

  const closeProductDetail = () => {
    if (window.history.state?.view === 'product') {
      window.history.back();
    } else {
      setDetailProduct(null);
    }
  };

  const openCart = () => {
    window.history.pushState({ view: 'cart' }, '', '#cart');
    setIsCartOpen(true);
  };

  const closeCart = () => {
    if (window.history.state?.view === 'cart') {
      window.history.back();
    } else {
      setIsCartOpen(false);
    }
  };

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

  const showToast = (title: string, description?: string) => {
    toast(title, {
      description,
      indicator: (
        <div className="w-8 h-8 rounded-xl bg-paper-frost text-pricing-blue border border-hairline flex items-center justify-center shrink-0">
          <IconShoppingBag size={17} stroke={2} />
        </div>
      ),
      variant: 'default',
      timeout: 2500,
    });
  };

  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => [...prev, item]);
    showToast(`1x ${item.menuItem.name}`, 'Ditambahkan ke keranjang belanja');
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

  const handleSelectBrand = (newBrand: BrandInfo) => {
    if (newBrand.id === currentBrand.id) return;
    if (cartItems.length > 0) {
      setPendingBrandChange(newBrand);
      return;
    }
    const newOutlets = getOutletsByBrand(newBrand);
    setCurrentBrand(newBrand);
    setCurrentOutlet(newOutlets[0]);
    setSelectedCategory('All');
    setSearchQuery('');
    showToast(`Beralih ke ${newBrand.name}`, 'Menu dan gerai telah diperbarui');
  };

  const confirmChangeBrand = () => {
    if (pendingBrandChange) {
      const newOutlets = getOutletsByBrand(pendingBrandChange);
      setCurrentBrand(pendingBrandChange);
      setCurrentOutlet(newOutlets[0]);
      setSelectedCategory('All');
      setSearchQuery('');
      setCartItems([]);
      setPendingBrandChange(null);
      showToast(`Beralih ke ${pendingBrandChange.name}`, 'Keranjang telah dikosongkan');
    }
  };

  if (isCartOpen) {
    return (
      <>
        <Toast.Provider placement="top" />
        <CartStandalonePage
          onBack={closeCart}
          cartItems={cartItems}
          outlet={currentOutlet}
          onSelectOutlet={setCurrentOutlet}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />
      </>
    );
  }
  if (detailProduct) {
    return (
      <>
        <Toast.Provider placement="top" />
        <ProductDetailPage
          item={detailProduct}
          onBack={closeProductDetail}
          onAddToCart={handleAddToCart}
          isFavorite={favorites.includes(detailProduct.id)}
          onToggleFavorite={handleToggleFavorite}
        />
      </>
    );
  }

  return (
    <>
      <Toast.Provider placement="top" />
      <div className="min-h-screen bg-gallery-white text-ink pb-20 font-sans antialiased">
        {/* App Shell Container Maksimal Mobile-First */}
        <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
          {/* 1. Header Brand & Notifikasi */}
          <DeliveryHeader
            currentOutlet={currentOutlet}
          />

          {/* 2. Search Bar Bersih: Paper Frost, Hairline & Dropdown Popover */}
          <div className="relative flex items-center gap-2">
            <SearchField
              value={searchQuery}
              onChange={setSearchQuery}
              className="flex-1"
              aria-label="Cari menu kopi atau makanan"
            >
              <SearchField.Group className="bg-paper-frost rounded-2xl border border-hairline h-10 px-3 flex items-center">
                <SearchField.SearchIcon className="text-steel mr-2 shrink-0" />
                <SearchField.Input
                  placeholder="Cari kopi, teh, camilan..."
                  className="text-sm bg-transparent border-0 placeholder:text-steel text-ink focus:outline-none flex-1 w-full"
                />
                <SearchField.ClearButton className="text-steel shrink-0" />
              </SearchField.Group>
            </SearchField>

            <Dropdown>
              <Dropdown.Trigger>
                <button
                  type="button"
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shrink-0 border ${
                    sortBy !== 'default'
                      ? 'bg-pricing-blue text-gallery-white border-pricing-blue'
                      : 'bg-paper-frost text-ink border-hairline hover:bg-studio-mist'
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
                      <Label className="font-medium text-ink">Rekomendasi</Label>
                      {sortBy === 'default' && <IconCheck size={14} className="text-pricing-blue" stroke={2.5} />}
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item id="price-asc" textValue="Termurah">
                    <div className="flex items-center justify-between w-full py-0.5 text-xs">
                      <Label className="font-medium text-ink">Harga Terendah</Label>
                      {sortBy === 'price-asc' && <IconCheck size={14} className="text-pricing-blue" stroke={2.5} />}
                    </div>
                  </Dropdown.Item>
                  <Dropdown.Item id="price-desc" textValue="Termahal">
                    <div className="flex items-center justify-between w-full py-0.5 text-xs">
                      <Label className="font-medium text-ink">Harga Tertinggi</Label>
                      {sortBy === 'price-desc' && <IconCheck size={14} className="text-pricing-blue" stroke={2.5} />}
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

          {/* Pilihan Brand Kopi (Kopi Kenangan, Fore, Tomoro) */}
          <BrandSelector
            brands={BRANDS}
            currentBrand={currentBrand}
            onSelectBrand={handleSelectBrand}
          />

          {/* Clean Horizontal Scrollable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-ink text-gallery-white border-ink shadow-xs'
                      : 'bg-paper-frost text-slate border-hairline hover:bg-studio-mist hover:text-ink'
                  }`}
                >
                  {cat === 'All' ? 'Semua Menu' : cat}
                </button>
              );
            })}
          </div>

          {/* 6. Grid Produk 2 Kolom Bersih */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            {filteredMenus.map((item) => (
              <CleanProductCard
                key={item.id}
                item={item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={(selected) => openProductDetail(selected)}
                onQuickAdd={(selected) => openProductDetail(selected)}
              />
            ))}
          </div>
        </div>

        {/* FAB Floating Cart Button */}
        {cartItems.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40">
            <button
              type="button"
              onClick={openCart}
              className="group relative flex items-center gap-3 bg-ink text-gallery-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-hairline hover:bg-black transition-transform active:scale-95 cursor-pointer"
              aria-label="Buka keranjang belanja"
            >
              {/* Bag Icon dengan Badge Counter */}
              <div className="relative">
                <IconShoppingBag size={22} stroke={2} />
                <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 rounded-full bg-pricing-blue text-gallery-white text-[11px] font-bold flex items-center justify-center px-1 shadow-xs">
                  {totalQuantity}
                </span>
              </div>

              {/* Total Belanja */}
              <div className="text-left border-l border-slate/40 pl-3">
                <span className="text-[10px] text-control-gray block font-normal leading-none mb-0.5">
                  Total
                </span>
                <span className="text-sm font-semibold leading-none text-gallery-white">
                  {formatRupiah(subtotal)}
                </span>
              </div>
            </button>
          </div>
        )}

        {/* Modal Konfirmasi Pindah Brand */}
        <Modal isOpen={!!pendingBrandChange} onOpenChange={(open) => !open && setPendingBrandChange(null)}>
          <Modal.Backdrop variant="blur">
            <Modal.Container size="sm">
              <Modal.Dialog className="w-full bg-gallery-white border border-hairline">
                <Modal.Header>
                  <Modal.Heading className="text-ink font-semibold">Ganti Brand Kopi?</Modal.Heading>
                  <Modal.CloseTrigger />
                </Modal.Header>
                <Modal.Body>
                  <p className="text-xs text-slate leading-relaxed">
                    Keranjangmu saat ini berisi menu dari <strong className="text-ink">{currentBrand.name}</strong>.
                    Beralih ke <strong className="text-ink">{pendingBrandChange?.name}</strong> akan mengosongkan keranjang belanja.
                  </p>
                </Modal.Body>
                <Modal.Footer className="flex gap-2">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-paper-frost text-ink border border-hairline"
                    onPress={() => setPendingBrandChange(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 bg-launch-orange text-gallery-white"
                    onPress={confirmChangeBrand}
                  >
                    Ya, Ganti Brand
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      </div>
    </>
  );
}
