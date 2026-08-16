import { Component, HostListener, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  currentIndex = 0;
  itemsPerView = 1;

  readonly brandValues = [
    {
      title: 'Quality',
      description: 'Premium materials and careful finishing in every piece.'
    },
    {
      title: 'Modern Design',
      description: 'Clean silhouettes shaped for contemporary everyday wear.'
    },
    {
      title: 'Comfort',
      description: 'Thoughtful fits that move with you from day to night.'
    },
    {
      title: 'Craftsmanship',
      description: 'Details refined with patience, precision, and care.'
    }
  ];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.featuredProducts = this.productService.getProducts().slice(0, 4);
    this.updateItemsPerView();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerView();
  }

  get maxIndex(): number {
    return Math.max(0, this.featuredProducts.length - this.itemsPerView);
  }

  get trackTransform(): string {
    const offsetPercent = (100 / this.itemsPerView) * this.currentIndex;
    return `translateX(-${offsetPercent}%)`;
  }

  get slideFlexBasis(): string {
    return `${100 / this.itemsPerView}%`;
  }

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  next(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  private updateItemsPerView(): void {
    const width = window.innerWidth;

    if (width >= 1024) {
      this.itemsPerView = Math.min(3, this.featuredProducts.length || 3);
    } else if (width >= 768) {
      this.itemsPerView = Math.min(2, this.featuredProducts.length || 2);
    } else {
      this.itemsPerView = 1;
    }

    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }
}
