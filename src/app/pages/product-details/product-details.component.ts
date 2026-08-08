import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getProductById(id);

    if (this.product) {
      this.selectedSize = this.product.sizes[0];
      this.selectedColor = this.product.colors[0];
    }
  }

  selectSize(size: string): void {
    this.selectedSize = size;
  }

  selectColor(color: string): void {
    this.selectedColor = color;
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getColorStyle(color: string): string {
    const colorMap: { [key: string]: string } = {
      'White': '#fff',
      'Black': '#000',
      'Gray': '#808080',
      'Navy': '#000080',
      'Blue': '#0000ff',
      'Red': '#ff0000',
      'Green': '#008000',
      'Brown': '#8b4513',
      'Cream': '#fffdd0',
      'Burgundy': '#800020',
      'Khaki': '#c3b091',
      'Olive': '#808000',
      'Tan': '#d2b48c',
      'Floral': '#ffc0cb',
      'Print': '#9370db'
    };
    return colorMap[color] || color;
  }
}
