import { Injectable } from '@angular/core';
import { CartItem } from './cart.service';

export interface CheckoutDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
  paymentMethod: 'cod';
}

export interface PlacedOrder {
  id: string;
  createdAt: string;
  customer: CheckoutDetails;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'placed';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly storageKey = 'mk-studio-orders';

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

    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    return order;
  }

  getOrders(): PlacedOrder[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private saveOrders(orders: PlacedOrder[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch {
      // Ignore storage failures.
    }
  }

  private createOrderId(): string {
    const stamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 900 + 100);
    return `MK-${stamp}-${random}`;
  }
}
