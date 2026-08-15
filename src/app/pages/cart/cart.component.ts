import { Component, OnInit } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  total: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.loadCart();
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.refreshTotals();
    });
  }

  loadCart(): void {
    this.cartItems = this.cartService.getCartItems();
    this.refreshTotals();
  }

  private refreshTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shipping = this.cartService.getShippingFee();
    this.tax = this.cartService.getTax();
    this.total = this.cartService.getTotal();
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  increaseQuantity(index: number): void {
    this.cartService.increaseQuantity(index);
  }

  decreaseQuantity(index: number): void {
    this.cartService.decreaseQuantity(index);
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
