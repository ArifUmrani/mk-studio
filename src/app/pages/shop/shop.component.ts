import { Component, OnInit } from '@angular/core';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  selectedCategories: string[] = [];
  selectedPriceRanges: string[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products = this.productService.getProducts();
    this.filteredProducts = [...this.products];
    this.categories = this.productService.getCategories();
  }

  onCategoryChange(event: Event, category: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedCategories.push(category);
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    }
    this.applyFilters();
  }

  onPriceRangeChange(event: Event, range: string): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedPriceRanges.push(range);
    } else {
      this.selectedPriceRanges = this.selectedPriceRanges.filter(r => r !== range);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProducts = this.productService.getFilteredProducts(
      this.selectedCategories,
      this.selectedPriceRanges
    );
  }

  clearFilters(): void {
    this.selectedCategories = [];
    this.selectedPriceRanges = [];
    this.filteredProducts = [...this.products];

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      (checkbox as HTMLInputElement).checked = false;
    });
  }
}
