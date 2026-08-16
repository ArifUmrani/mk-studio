import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly storageKey = 'mk-studio-cart';
  private readonly shippingFee = 250;
  private readonly taxRate = 0.1;

  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = new BehaviorSubject<number>(0);

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, selectedSize: string, selectedColor: string, quantity: number): void {
    const existingItem = this.cartItems.find(
      item => item.product.id === product.id &&
              item.selectedSize === selectedSize &&
              item.selectedColor === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        product,
        selectedSize,
        selectedColor,
        quantity
      });
    }

    this.updateCart();
  }

  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.updateCart();
  }

  increaseQuantity(index: number): void {
    if (this.cartItems[index]) {
      this.cartItems[index].quantity++;
      this.updateCart();
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index] && this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      this.updateCart();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    if (this.cartItems[index] && quantity > 0) {
      this.cartItems[index].quantity = quantity;
      this.updateCart();
    }
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  getCartItems(): CartItem[] {
    return this.cartItems;
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product.price * item.quantity),
      0
    );
  }

  getShippingFee(): number {
    return this.cartItems.length > 0 ? this.shippingFee : 0;
  }

  getTax(): number {
    return this.getSubtotal() * this.taxRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.getShippingFee() + this.getTax();
  }

  getTotalQuantity(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCount$.next(this.getTotalQuantity());
    this.saveCartToStorage();
  }

  private loadCartFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.updateCartStateOnly();
        return;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.cartItems = parsed.filter(this.isValidCartItem);
      }
    } catch {
      this.cartItems = [];
    }

    this.updateCartStateOnly();
  }

  private saveCartToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
    } catch {
      // Ignore storage quota / private mode failures.
    }
  }

  private updateCartStateOnly(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCount$.next(this.getTotalQuantity());
  }

  private isValidCartItem(item: CartItem): item is CartItem {
    return !!(
      item &&
      item.product &&
      typeof item.product.id === 'number' &&
      typeof item.product.price === 'number' &&
      typeof item.selectedSize === 'string' &&
      typeof item.selectedColor === 'string' &&
      typeof item.quantity === 'number' &&
      item.quantity > 0
    );
  }
}
