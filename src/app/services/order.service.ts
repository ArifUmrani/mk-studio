import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';
import { environment } from '../../environments/environment';

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: 'cod';
}

export type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface PlacedOrder {
  id: string;
  createdAt: string;
  customer: CheckoutDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly storageKey = 'mk-studio-orders';
  private readonly ordersSubject = new BehaviorSubject<PlacedOrder[]>([]);

  orders$ = this.ordersSubject.asObservable();

  readonly statusOptions: OrderStatus[] = [
    'placed',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  constructor() {
    this.ordersSubject.next(this.readOrders());
  }

  placeOrder(
    customer: CheckoutDetails,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    tax: number,
    total: number
  ): PlacedOrder {
    const order: PlacedOrder = {
      id: this.createOrderId(),
      createdAt: new Date().toISOString(),
      customer: { ...customer },
      items: items.map(item => ({
        ...item,
        product: { ...item.product }
      })),
      subtotal,
      shipping,
      tax,
      total,
      status: 'placed'
    };

    const orders = this.readOrders();
    orders.unshift(order);
    this.persistOrders(orders);
    return order;
  }

  getOrders(): PlacedOrder[] {
    return this.readOrders();
  }

  updateOrderStatus(orderId: string, status: OrderStatus): void {
    const orders = this.readOrders();
    const index = orders.findIndex(order => order.id === orderId);
    if (index === -1) {
      return;
    }

    orders[index] = {
      ...orders[index],
      status
    };
    this.persistOrders(orders);
  }

  buildWhatsAppUrl(order: PlacedOrder): string {
    const message = this.buildWhatsAppMessage(order);
    const phone = environment.storeWhatsApp.replace(/[^\d]/g, '');
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  buildCustomerWhatsAppUrl(order: PlacedOrder): string {
    const phone = this.toWhatsAppPhone(order.customer.phone);
    const message = [
      `Assalam o Alaikum ${order.customer.fullName},`,
      `This is MK Studio regarding your order ${order.id}.`,
      `Total: Rs. ${order.total.toLocaleString('en-PK')} (Cash on Delivery).`,
      'We will confirm delivery details with you shortly.'
    ].join('\n');
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  getCallUrl(phone: string): string {
    return `tel:${this.toLocalDialPhone(phone)}`;
  }

  getStatusLabel(status: OrderStatus): string {
    const labels: { [key in OrderStatus]: string } = {
      placed: 'New',
      confirmed: 'Confirmed',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  }

  buildWhatsAppMessage(order: PlacedOrder): string {
    const lines = [
      `New MK Studio Order: ${order.id}`,
      `Customer: ${order.customer.fullName}`,
      `Phone: ${order.customer.phone}`,
      `City: ${order.customer.city}`,
      `Address: ${order.customer.address}`,
      `Payment: Cash on Delivery`,
      `Total: Rs. ${order.total.toLocaleString('en-PK')}`,
      '',
      'Items:'
    ];

    order.items.forEach(item => {
      lines.push(
        `- ${item.product.name} (${item.selectedSize}/${item.selectedColor}) x${item.quantity}`
      );
    });

    if ((order.customer.notes || '').trim()) {
      lines.push('', `Notes: ${(order.customer.notes || '').trim()}`);
    }

    return lines.join('\n');
  }

  private readOrders(): PlacedOrder[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.map((order: PlacedOrder) => ({
        ...order,
        status: order.status || 'placed'
      }));
    } catch {
      return [];
    }
  }

  private persistOrders(orders: PlacedOrder[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch {
      // Ignore storage failures.
    }
    this.ordersSubject.next([...orders]);
  }

  private createOrderId(): string {
    const stamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 900 + 100);
    return `MK-${stamp}-${random}`;
  }

  private toWhatsAppPhone(phone: string): string {
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.startsWith('92')) {
      return digits;
    }
    if (digits.startsWith('0')) {
      return `92${digits.slice(1)}`;
    }
    return digits;
  }

  private toLocalDialPhone(phone: string): string {
    const digits = phone.replace(/[^\d+]/g, '');
    return digits;
  }
}
