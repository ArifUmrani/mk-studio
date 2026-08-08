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
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['White', 'Black', 'Gray']
    },
    {
      id: 2,
      name: 'Denim Jacket',
      price: 120.00,
      category: 'Outerwear',
      description: 'A timeless denim jacket with a modern fit. Features classic styling with premium quality denim.',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black']
    },
    {
      id: 3,
      name: 'Summer Dress',
      price: 85.00,
      category: 'Dresses',
      description: 'A beautiful summer dress made from lightweight, breathable fabric. Perfect for warm weather.',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Floral', 'Solid Blue', 'White']
    },
    {
      id: 4,
      name: 'Chino Pants',
      price: 65.00,
      category: 'Bottoms',
      description: 'Versatile chino pants that work for both casual and formal occasions. Comfortable and stylish.',
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&h=500&fit=crop',
      sizes: ['28', '30', '32', '34', '36'],
      colors: ['Khaki', 'Navy', 'Black', 'Olive']
    },
    {
      id: 5,
      name: 'Wool Sweater',
      price: 95.00,
      category: 'Tops',
      description: 'Cozy wool sweater perfect for cooler weather. Made from premium merino wool.',
      image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Gray', 'Navy', 'Cream', 'Burgundy']
    },
    {
      id: 6,
      name: 'Leather Belt',
      price: 45.00,
      category: 'Accessories',
      description: 'High-quality leather belt with a classic buckle. A wardrobe essential.',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      sizes: ['S', 'M', 'L'],
      colors: ['Brown', 'Black']
    },
    {
      id: 7,
      name: 'Canvas Sneakers',
      price: 55.00,
      category: 'Footwear',
      description: 'Comfortable canvas sneakers with a classic design. Perfect for everyday wear.',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      sizes: ['7', '8', '9', '10', '11', '12'],
      colors: ['White', 'Black', 'Navy']
    },
    {
      id: 8,
      name: 'Silk Scarf',
      price: 40.00,
      category: 'Accessories',
      description: 'Elegant silk scarf that adds a touch of sophistication to any outfit.',
      image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop',
      sizes: ['One Size'],
      colors: ['Red', 'Blue', 'Print', 'Black']
    },
    {
      id: 9,
      name: 'Linen Blazer',
      price: 145.00,
      category: 'Outerwear',
      description: 'Lightweight linen blazer perfect for summer occasions. Breathable and stylish.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&h=500&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Navy', 'White']
    },
    {
      id: 10,
      name: 'Skinny Jeans',
      price: 75.00,
      category: 'Bottoms',
      description: 'Classic skinny jeans with stretch comfort. A wardrobe staple for modern style.',
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=500&fit=crop',
      sizes: ['26', '28', '30', '32', '34'],
      colors: ['Black', 'Blue', 'Gray']
    },
    {
      id: 11,
      name: 'Cotton Hoodie',
      price: 55.00,
      category: 'Tops',
      description: 'Comfortable cotton hoodie perfect for casual wear. Soft and warm.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Black', 'Gray', 'Navy', 'Green']
    },
    {
      id: 12,
      name: 'Leather Wallet',
      price: 35.00,
      category: 'Accessories',
      description: 'Slim leather wallet with multiple card slots. Crafted from genuine leather.',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop',
      sizes: ['One Size'],
      colors: ['Brown', 'Black', 'Tan']
    }
  ];

  constructor() { }

  getProducts(): Product[] {
    return this.products;
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(product => product.category === category);
  }

  getFilteredProducts(categories: string[], priceRanges: string[]): Product[] {
    return this.products.filter(product => {
      const categoryMatch = categories.length === 0 || categories.includes(product.category);
      const priceMatch = priceRanges.length === 0 || this.checkPriceRange(product.price, priceRanges);
      return categoryMatch && priceMatch;
    });
  }

  private checkPriceRange(price: number, priceRanges: string[]): boolean {
    return priceRanges.some(range => {
      switch (range) {
        case 'under50': return price < 50;
        case '50to100': return price >= 50 && price < 100;
        case '100to200': return price >= 100 && price < 200;
        case 'over200': return price >= 200;
        default: return false;
      }
    });
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(product => product.category))];
  }
}
