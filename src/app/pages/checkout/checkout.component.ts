import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartItem, CartService } from '../../services/cart.service';
import { CheckoutDetails, OrderService, PlacedOrder } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  tax = 0;
  total = 0;
  totalQuantity = 0;

  orderPlaced = false;
  placedOrder: PlacedOrder | null = null;
  formError = '';
  whatsappUrl = '';

  checkoutForm: CheckoutDetails = {
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cod'
  };

  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cartItems$.subscribe((items: CartItem[]) => {
        this.cartItems = items;
        this.refreshTotals();

        if (!this.orderPlaced && items.length === 0) {
          this.router.navigate(['/cart']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  placeOrder(): void {
    this.formError = '';

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    if (!this.isFormValid()) {
      this.formError = 'Please fill in all required fields correctly.';
      return;
    }

    this.placedOrder = this.orderService.placeOrder(
      this.checkoutForm,
      this.cartItems,
      this.subtotal,
      this.shipping,
      this.tax,
      this.total
    );

    this.whatsappUrl = this.orderService.buildWhatsAppUrl(this.placedOrder);
    this.orderPlaced = true;
    this.cartService.clearCart();
  }

  notifyOnWhatsApp(): void {
    if (this.whatsappUrl) {
      window.open(this.whatsappUrl, '_blank');
    }
  }

  continueShopping(): void {
    this.router.navigate(['/shop']);
  }

  private refreshTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shipping = this.cartService.getShippingFee();
    this.tax = this.cartService.getTax();
    this.total = this.cartService.getTotal();
    this.totalQuantity = this.cartService.getTotalQuantity();
  }

  private isFormValid(): boolean {
    const nameOk = this.checkoutForm.fullName.trim().length >= 3;
    const phoneDigits = this.checkoutForm.phone.replace(/[\s-]/g, '');
    const phoneOk = /^(03\d{9}|\+923\d{9}|923\d{9})$/.test(phoneDigits);
    const emailOk = !this.checkoutForm.email.trim() ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.checkoutForm.email.trim());
    const addressOk = this.checkoutForm.address.trim().length >= 8;
    const cityOk = this.checkoutForm.city.trim().length >= 2;

    return nameOk && phoneOk && emailOk && addressOk && cityOk;
  }
}
