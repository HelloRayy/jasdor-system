import { useState } from 'react';
import {
  Button,
  Card,
  Chip,
  Dropdown,
  Label,
  Modal,
  SearchField,
  Toast,
  toast,
} from '@heroui/react';
import {
  IconAdjustmentsHorizontal,
  IconClock,
  IconMapPin,
  IconCheck,
  IconShoppingBag,
  IconBrandWhatsapp,
} from '@tabler/icons-react';
import { mockOutlets } from './data/mockOutlets';
import type { Outlet, MenuItem } from './types/catalog';
import type { CartItem } from './types/cart';
import { DeliveryHeader } from './components/DeliveryHeader';
import { OutletScrollList } from './components/OutletScrollList';
import { CleanProductCard } from './components/CleanProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartStandalonePage } from './components/CartStandalonePage';
import { OutletComboboxModal } from './components/OutletComboboxModal';
import { formatRupiah } from './utils/whatsapp';

export default function App() {
  const [currentOutlet, setCurrentOutlet] = useState<Outlet>(mockOutlets[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');

  // Modal & Drawer States
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [detailProduct, setDetailProduct] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOutletPickerOpen, setIsOutletPickerOpen] = useState(false);
  const [pendingOutletChange, setPendingOutletChange] = useState<Outlet | null>(null);
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

  const showToast = (title: string, description?: string) => {
    toast(title, {
      description,
      indicator: (
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
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

  const handleChangeOutlet = (newOutlet: Outlet) => {
    if (newOutlet.id !== currentOutlet.id) {
      if (cartItems.length > 0) {
        setPendingOutletChange(newOutlet);
        return;
      }
      setCurrentOutlet(newOutlet);
      setSelectedCategory('All');
      setSearchQuery('');
    }
  };

  const confirmChangeOutlet = () => {
    if (pendingOutletChange) {
      setCurrentOutlet(pendingOutletChange);
      setSelectedCategory('All');
      setSearchQuery('');
      setCartItems([]);
      setPendingOutletChange(null);
      showToast(`Beralih ke ${pendingOutletChange.brand}`);
    }
  };

  if (isCartOpen) {
    return (
      <>
        <Toast.Provider placement="top" />
        <CartStandalonePage
          onBack={() => setIsCartOpen(false)}
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
          onBack={() => setDetailProduct(null)}
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
      <div className="min-h-screen bg-white text-stone-900 pb-20 font-sans antialiased">
      {/* App Shell Container Maksimal Mobile-First seperti di Referensi */}
      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* 1. Header Brand & Notifikasi */}
        <DeliveryHeader
          currentOutlet={currentOutlet}
        />

        {/* 2. Search Bar Bersih dengan Dropdown Filter Popover (Bukan Popup Modal) */}
        <div className="relative flex items-center gap-2">
          {/* HeroUI v3 Compound SearchField */}
          <SearchField
            value={searchQuery}
            onChange={setSearchQuery}
            className="flex-1"
            aria-label="Cari menu kopi atau makanan"
          >
            <SearchField.Group className="bg-stone-100 rounded-2xl border-0 h-10 px-3 flex items-center">
              <SearchField.SearchIcon className="text-stone-400 mr-2 shrink-0" />
              <SearchField.Input
                placeholder="Search coffee, tea, meals..."
                className="text-sm bg-transparent border-0 placeholder:text-stone-400 focus:outline-none flex-1 w-full"
              />
              <SearchField.ClearButton className="text-stone-400 shrink-0" />
            </SearchField.Group>
          </SearchField>

          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shrink-0 ${
                  sortBy !== 'default'
                    ? 'bg-blue-600 text-white'
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
                    {sortBy === 'default' && <IconCheck size={14} className="text-blue-600" stroke={2.5} />}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="price-asc" textValue="Termurah">
                  <div className="flex items-center justify-between w-full py-0.5 text-xs">
                    <Label className="font-medium text-stone-900">Harga Terendah</Label>
                    {sortBy === 'price-asc' && <IconCheck size={14} className="text-blue-600" stroke={2.5} />}
                  </div>
                </Dropdown.Item>
                <Dropdown.Item id="price-desc" textValue="Termahal">
                  <div className="flex items-center justify-between w-full py-0.5 text-xs">
                    <Label className="font-medium text-stone-900">Harga Tertinggi</Label>
                    {sortBy === 'price-desc' && <IconCheck size={14} className="text-blue-600" stroke={2.5} />}
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

        {/* 4. Minimalist Highlight Card (Konsisten & Senada dengan Sistem Desain) */}
        <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-3.5 flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <IconBrandWhatsapp size={20} stroke={2} />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-stone-900 truncate">
                Pesan Cepat via WhatsApp
              </h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                Format otomatis terisi rapi ke kasir resmi
              </p>
            </div>
          </div>

          <Chip size="sm" variant="secondary" className="text-[10px] font-semibold text-stone-700 bg-white border border-stone-200/70 shrink-0">
            {currentOutlet.brand}
          </Chip>
        </div>

        {/* 5. Clean Horizontal Scrollable Category Pills (Sesuai Referensi) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {cat === 'All' ? 'Semua Menu' : cat}
              </button>
            );
          })}
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
              onQuickAdd={(selected) => setDetailProduct(selected)}
            />
          ))}
        </div>
      </div>

      {/* FAB Floating Cart Button (Floating Action Button di Home saat ada item) */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="group relative flex items-center gap-3 bg-stone-900 text-white pl-4 pr-5 py-3.5 rounded-full shadow-2xl border border-stone-800 hover:bg-stone-950 transition-transform active:scale-95 cursor-pointer"
            aria-label="Buka keranjang belanja"
          >
            {/* Bag Icon dengan Badge Counter */}
            <div className="relative">
              <IconShoppingBag size={22} stroke={2} />
              <span className="absolute -top-2 -right-2.5 min-w-[20px] h-5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold flex items-center justify-center px-1 shadow-xs">
                {totalQuantity}
              </span>
            </div>

            {/* Total Belanja */}
            <div className="text-left border-l border-stone-700 pl-3">
              <span className="text-[10px] text-stone-400 block font-normal leading-none mb-0.5">
                Total
              </span>
              <span className="text-sm font-bold leading-none text-white">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </button>
        </div>
      )}

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

      {/* Modal Konfirmasi Pindah Outlet Saat Keranjang Ada Item (UX Protection) */}
      <Modal isOpen={!!pendingOutletChange} onOpenChange={(open) => !open && setPendingOutletChange(null)}>
        <Modal.Backdrop variant="blur">
          <Modal.Container size="sm">
            <Modal.Dialog className="w-full">
              <Modal.Header>
                <Modal.Heading>Pindah Outlet?</Modal.Heading>
                <Modal.CloseTrigger />
              </Modal.Header>
              <Modal.Body>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Keranjangmu saat ini berisi item dari <strong>{currentOutlet.name}</strong>.
                  Pindah ke <strong>{pendingOutletChange?.name}</strong> akan mengosongkan keranjangmu.
                </p>
              </Modal.Body>
              <Modal.Footer className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onPress={() => setPendingOutletChange(null)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-rose-600 text-white"
                  onPress={confirmChangeOutlet}
                >
                  Ya, Ganti Outlet
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
      {/* Modern Combobox Modal: Pilih Kota & Cabang Kopi Kenangan Se-Indonesia */}
      <OutletComboboxModal
        isOpen={isOutletPickerOpen}
        onClose={() => setIsOutletPickerOpen(false)}
        outlets={mockOutlets}
        currentOutlet={currentOutlet}
        onSelectOutlet={handleChangeOutlet}
      />
    </div>
    </>
  );
}
