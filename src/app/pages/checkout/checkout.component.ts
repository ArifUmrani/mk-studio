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
  fieldErrors: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
  } = {};
  whatsappUrl = '';
  copyMessage = '';
  whatsappOpened = false;

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
  private whatsappTimer: ReturnType<typeof setTimeout> | null = null;

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
    if (this.whatsappTimer) {
      clearTimeout(this.whatsappTimer);
    }
  }

  placeOrder(): void {
    this.formError = '';
    this.fieldErrors = {};

    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    if (!this.validateForm()) {
      this.formError = 'Please fix the highlighted fields and try again.';
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

    this.whatsappTimer = setTimeout(() => {
      this.notifyOnWhatsApp();
    }, 700);
  }

  notifyOnWhatsApp(): void {
    if (this.whatsappUrl) {
      window.open(this.whatsappUrl, '_blank');
      this.whatsappOpened = true;
    }
  }

  copyOrderId(): void {
    if (!this.placedOrder) {
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.placedOrder.id).then(() => {
        this.copyMessage = 'Order ID copied.';
      }).catch(() => {
        this.copyMessage = 'Could not copy order ID.';
      });
      return;
    }

    this.copyMessage = 'Clipboard not available.';
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

  private validateForm(): boolean {
    let valid = true;

    if (this.checkoutForm.fullName.trim().length < 3) {
      this.fieldErrors.fullName = 'Enter your full name (at least 3 characters).';
      valid = false;
    }

    const phoneDigits = this.checkoutForm.phone.replace(/[\s-]/g, '');
    if (!/^(03\d{9}|\+923\d{9}|923\d{9})$/.test(phoneDigits)) {
      this.fieldErrors.phone = 'Enter a valid Pakistani mobile number (03XXXXXXXXX).';
      valid = false;
    }

    if (this.checkoutForm.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.checkoutForm.email.trim())) {
      this.fieldErrors.email = 'Enter a valid email or leave it blank.';
      valid = false;
    }

    if (this.checkoutForm.address.trim().length < 8) {
      this.fieldErrors.address = 'Enter a complete delivery address.';
      valid = false;
    }

    if (this.checkoutForm.city.trim().length < 2) {
      this.fieldErrors.city = 'Enter your city.';
      valid = false;
    }

    return valid;
  }
}
