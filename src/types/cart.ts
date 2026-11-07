import type { MenuItem } from './catalog';

export interface SelectedOption {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  priceDelta: number;
}

export interface CartItem {
  id: string; // unique item uuid (berdasarkan item + varian kombinasi)
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
  notes?: string;
  unitPrice: number; // basePrice + sum(selectedOptions.priceDelta)
  totalPrice: number; // unitPrice * quantity
}

export type DeliveryMethod = 'delivery' | 'pickup' | '';

export interface CustomerProfile {
  name: string;
  phone: string;
  deliveryMethod?: DeliveryMethod;
  address?: string;
  landmark?: string;
  googleMapsUrl?: string;
}

export interface OrderPayload {
  orderId: string;
  outletId: string;
  outletName: string;
  whatsappNumber: string;
  outletAddress?: string;
  outletMapsQuery?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: CustomerProfile;
  createdAt: string;
}
