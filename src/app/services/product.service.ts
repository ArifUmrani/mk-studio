import { Injectable } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sizes: string[];
  colors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Classic White Tee',
      price: 35.00,
      category: 'Tops',
      description: 'A classic white t-shirt made from 100% organic cotton. Perfect for everyday wear.',
      image: '',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray']
    },
    {
      id: 2,
      name: 'Denim Jacket',
      price: 120.00,
      category: 'Outerwear',
      description: 'A timeless denim jacket with a modern fit. Features classic styling with premium quality denim.',
      image: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black']
    },
    {
      id: 3,
      name: 'Summer Dress',
      price: 85.00,
      category: 'Dresses',
      description: 'A beautiful summer dress made from lightweight, breathable fabric. Perfect for warm weather.',
      image: '',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Floral', 'Solid Blue', 'White']
    },
    {
      id: 4,
      name: 'Chino Pants',
      price: 65.00,
      category: 'Bottoms',
      description: 'Versatile chino pants that work for both casual and formal occasions. Comfortable and stylish.',
      image: '',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Khaki', 'Navy', 'Black', 'Olive']
    },
    {
      id: 5,
      name: 'Wool Sweater',
      price: 95.00,
      category: 'Tops',
      description: 'Cozy wool sweater perfect for cooler weather. Made from premium merino wool.',
      image: '',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Gray', 'Navy', 'Cream', 'Burgundy']
    },
    {
      id: 6,
      name: 'Leather Belt',
      price: 45.00,
      category: 'Accessories',
      description: 'High-quality leather belt with a classic buckle. A wardrobe essential.',
      image: '',
      sizes: ['S', 'M', 'L'],
      colors: ['Brown', 'Black']
    },
    {
      id: 7,
      name: 'Canvas Sneakers',
      price: 55.00,
      category: 'Footwear',
      description: 'Comfortable canvas sneakers with a classic design. Perfect for everyday wear.',
      image: '',
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Navy']
    },
    {
      id: 8,
      name: 'Silk Scarf',
      price: 40.00,
      category: 'Accessories',
      description: 'Elegant silk scarf that adds a touch of sophistication to any outfit.',
      image: '',
      sizes: ['One Size'],
      colors: ['Red', 'Blue', 'Print', 'Black']
    }
  ];

  constructor() {}

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }
}
