import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  
  cartItems$ = this.cartItemsSubject.asObservable();
  cartCount$ = new BehaviorSubject<number>(0);

  constructor() {}

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

  getTotalQuantity(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  private updateCart(): void {
    this.cartItemsSubject.next([...this.cartItems]);
    this.cartCount$.next(this.getTotalQuantity());
  }
}
