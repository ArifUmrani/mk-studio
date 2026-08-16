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
  searchQuery = '';
  statusFilter: OrderStatus | 'all' = 'all';
  copyMessage = '';

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
        this.ensureValidSelection();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get filteredOrders(): PlacedOrder[] {
    const query = this.searchQuery.trim().toLowerCase();

    return this.orders.filter(order => {
      const statusMatch = this.statusFilter === 'all' || order.status === this.statusFilter;
      if (!statusMatch) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = [
        order.id,
        order.customer.fullName,
        order.customer.phone,
        order.customer.city,
        order.customer.email
      ].join(' ').toLowerCase();

      return haystack.includes(query);
    });
  }

  get selectedOrder(): PlacedOrder | null {
    return this.filteredOrders.find(order => order.id === this.selectedOrderId)
      || this.orders.find(order => order.id === this.selectedOrderId)
      || null;
  }

  get newOrdersCount(): number {
    return this.orders.filter(order => order.status === 'placed').length;
  }

  selectOrder(orderId: string): void {
    this.selectedOrderId = orderId;
    this.copyMessage = '';
  }

  onFiltersChanged(): void {
    this.ensureValidSelection();
  }

  onStatusChange(orderId: string, event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.orderService.updateOrderStatus(orderId, select.value as OrderStatus);
  }

  getStatusLabel(status: OrderStatus): string {
    return this.orderService.getStatusLabel(status);
  }

  shareToStore(order: PlacedOrder): void {
    window.open(this.orderService.buildWhatsAppUrl(order), '_blank');
  }

  messageCustomer(order: PlacedOrder): void {
    window.open(this.orderService.buildCustomerWhatsAppUrl(order), '_blank');
  }

  callCustomer(order: PlacedOrder): void {
    window.location.href = this.orderService.getCallUrl(order.customer.phone);
  }

  copyOrderId(order: PlacedOrder): void {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(order.id).then(() => {
        this.copyMessage = 'Order ID copied.';
      }).catch(() => {
        this.copyMessage = 'Could not copy order ID.';
      });
      return;
    }
    this.copyMessage = 'Clipboard not available.';
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

  private ensureValidSelection(): void {
    const filtered = this.filteredOrders;
    if (filtered.length === 0) {
      this.selectedOrderId = null;
      return;
    }

    if (!this.selectedOrderId || !filtered.some(order => order.id === this.selectedOrderId)) {
      this.selectedOrderId = filtered[0].id;
    }
  }
}
