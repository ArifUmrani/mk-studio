import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from './cart.service';
import { SupabaseService } from './supabase.service';
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

interface OrderRow {
  id: string;
  created_at: string;
  customer: CheckoutDetails;
  items: CartItem[];
  subtotal: number | string;
  shipping: number | string;
  tax: number | string;
  total: number | string;
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ordersSubject = new BehaviorSubject<PlacedOrder[]>([]);

  orders$ = this.ordersSubject.asObservable();

  readonly statusOptions: OrderStatus[] = [
    'placed',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  ];

  constructor(private supabaseService: SupabaseService) { }

  async placeOrder(
    customer: CheckoutDetails,
    items: CartItem[],
    subtotal: number,
    shipping: number,
    tax: number,
    total: number
  ): Promise<PlacedOrder> {
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

    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('orders')
      .insert(this.toRow(order));

    if (error) {
      throw new Error(error.message || 'Could not place order.');
    }

    return order;
  }

  async loadOrders(): Promise<PlacedOrder[]> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.rpc('admin_get_orders', {
      p_password: environment.adminPassword
    });

    if (error) {
      throw new Error(error.message || 'Could not load orders.');
    }

    const orders = ((data as OrderRow[]) || []).map(row => this.fromRow(row));
    this.ordersSubject.next(orders);
    return orders;
  }

  getOrders(): PlacedOrder[] {
    return this.ordersSubject.value;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.rpc('admin_update_order_status', {
      p_password: environment.adminPassword,
      p_order_id: orderId,
      p_status: status
    });

    if (error) {
      throw new Error(error.message || 'Could not update order status.');
    }

    const updated = this.fromRow(data as OrderRow);
    const orders = this.ordersSubject.value.map(order =>
      order.id === updated.id ? updated : order
    );
    this.ordersSubject.next(orders);
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

  private toRow(order: PlacedOrder): Omit<OrderRow, 'created_at'> & { created_at: string } {
    return {
      id: order.id,
      created_at: order.createdAt,
      customer: order.customer,
      items: order.items,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      status: order.status
    };
  }

  private fromRow(row: OrderRow): PlacedOrder {
    return {
      id: row.id,
      createdAt: row.created_at,
      customer: row.customer,
      items: row.items || [],
      subtotal: Number(row.subtotal),
      shipping: Number(row.shipping),
      tax: Number(row.tax),
      total: Number(row.total),
      status: row.status || 'placed'
    };
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
