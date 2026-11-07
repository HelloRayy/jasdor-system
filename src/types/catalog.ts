export interface MenuOption {
  id: string;
  name: string;
  priceDelta: number; // 0 jika gratis, atau +Rp5.000 dll
}

export interface MenuOptionGroup {
  id: string;
  name: string; // misal: "Ukuran", "Level Gula", "Level Es", "Topping"
  required: boolean;
  type: 'radio' | 'checkbox';
  options: MenuOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  imageUrl: string;
  category: string;
  isAvailable: boolean;
  optionGroups?: MenuOptionGroup[];
}

export interface OutletLocation {
  lat: number;
  lng: number;
  city: string;
}

export interface Outlet {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  logoUrl: string;
  bannerUrl: string;
  whatsappNumber: string; // format internasional: 628xxxx
  address: string;
  googleMapsQuery?: string;
  location: OutletLocation;
  distanceKm?: number;
  openingHours: string;
  isActive: boolean;
  qrisImageUrl?: string;
  categories: string[];
  menus: MenuItem[];
}
