import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminAuthService } from '../../services/admin-auth.service';
import { OrderService, OrderStatus, PlacedOrder } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  orders: PlacedOrder[] = [];
  statusOptions: OrderStatus[] = [];
  selectedOrderId: string | null = null;

  private subscription = new Subscription();

  constructor(
    private orderService: OrderService,
    private adminAuthService: AdminAuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.statusOptions = this.orderService.statusOptions;
    this.subscription.add(
      this.orderService.orders$.subscribe((orders: PlacedOrder[]) => {
        this.orders = orders;
        if (this.selectedOrderId && !orders.some(order => order.id === this.selectedOrderId)) {
          this.selectedOrderId = null;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get selectedOrder(): PlacedOrder | null {
    return this.orders.find(order => order.id === this.selectedOrderId) || null;
  }

  selectOrder(orderId: string): void {
    this.selectedOrderId = orderId;
  }

  onStatusChange(orderId: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.orderService.updateOrderStatus(orderId, select.value as OrderStatus);
  }

  openWhatsApp(order: PlacedOrder): void {
    window.open(this.orderService.buildWhatsAppUrl(order), '_blank');
  }

  formatDate(value: string): string {
    const date = new Date(value);
    return date.toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout(): void {
    this.adminAuthService.logout();
    this.router.navigate(['/admin/login']);
  }
}
