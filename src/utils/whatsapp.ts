import type { OrderPayload } from '../types/cart';

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderId(outletSlug: string): string {
  const prefix = outletSlug.slice(0, 3).toUpperCase();
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `#${prefix}-${dateStr}-${randomSuffix}`;
}

export function constructWhatsAppMessage(order: OrderPayload): string {
  const itemsList = order.items
    .map((item, index) => {
      const optionsText =
        item.selectedOptions.length > 0
          ? ` (${item.selectedOptions.map((o) => o.optionName).join(', ')})`
          : '';
      const notesText = item.notes ? `\n   Catatan: ${item.notes}` : '';
      return `${index + 1}. ${item.menuItem.name}${optionsText} x${item.quantity}\n   @ ${formatRupiah(item.unitPrice)} = ${formatRupiah(item.totalPrice)}${notesText}`;
    })
    .join('\n');

  const methodText = order.customer.deliveryMethod === 'delivery' ? 'Diantar' : 'Ambil Sendiri';
  const deliverySection =
    order.customer.deliveryMethod === 'delivery'
      ? `\nAlamat: ${order.customer.address || '-'}\nPatokan: ${order.customer.landmark || '-'}\nLokasi Maps: ${order.customer.googleMapsUrl || '-'}`
      : '';

  const message = `*PESANAN BARU*
Outlet: ${order.outletName}
No. Pesanan: ${order.orderId}
Tanggal: ${order.createdAt}

*Daftar Item:*
${itemsList}

Subtotal: ${formatRupiah(order.subtotal)}
Ongkir: ${order.customer.deliveryMethod === 'delivery' ? 'ditentukan penjual' : 'Rp0 (Ambil Sendiri)'}
*Total Pembayaran: ${formatRupiah(order.total)}*

*Data Pemesan:*
Nama: ${order.customer.name}
No. HP: ${order.customer.phone}
Metode: ${methodText}${deliverySection}

Metode Bayar: QRIS / Transfer
Mohon konfirmasi pesanan ini. Terima kasih!`;

  return message;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  // Format nomor WA pastikan angka saja (contoh: 628123456789)
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
