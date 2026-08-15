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
      name: 'Floral Printed Lawn 2-Piece Suit',
      price: 2790,
      category: 'Lawn Suits',
      description: 'Lightweight printed lawn shirt with matching shalwar. Soft, breathable fabric ideal for everyday summer wear.',
      image: 'https://images.pexels.com/photos/20690539/pexels-photo-20690539.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Peach', 'Sky Blue']
    },
    {
      id: 2,
      name: 'Embroidered Lawn 3-Piece Suit',
      price: 3890,
      category: 'Lawn Suits',
      description: 'Premium lawn suit with delicate front embroidery, dyed shalwar, and a matching chiffon dupatta.',
      image: 'https://images.pexels.com/photos/31323212/pexels-photo-31323212.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['White', 'Mint', 'Lilac']
    },
    {
      id: 3,
      name: 'Resham Embroidered Kurta Set',
      price: 3450,
      category: 'Kurta Sets',
      description: 'Elegant resham-embroidered kurta paired with straight pants. A refined choice for daytime gatherings.',
      image: 'https://images.pexels.com/photos/25184999/pexels-photo-25184999.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Cream', 'Powder Pink', 'Sea Green']
    },
    {
      id: 4,
      name: 'Cotton Pret Kurta with Shalwar',
      price: 2500,
      category: 'Kurta Sets',
      description: 'Simple cotton pret kurta with comfortable shalwar. Easy everyday Pakistani eastern wear with a clean silhouette.',
      image: 'https://images.pexels.com/photos/31874448/pexels-photo-31874448.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Beige', 'Black', 'Navy']
    },
    {
      id: 5,
      name: 'Mirror Work Embroidered 2-Piece Suit',
      price: 3650,
      category: 'Embroidered Suits',
      description: 'Statement 2-piece suit featuring traditional mirror work embroidery on a soft, flowing silhouette.',
      image: 'https://images.pexels.com/photos/25184952/pexels-photo-25184952.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Maroon', 'Mustard', 'Teal']
    },
    {
      id: 6,
      name: 'Organza Embroidered Formal 3-Piece',
      price: 4500,
      category: 'Formal Wear',
      description: 'Luxurious organza formal suit with intricate embroidery, coordinated shalwar, and an airy dupatta.',
      image: 'https://images.pexels.com/photos/35485430/pexels-photo-35485430.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L'],
      colors: ['Gold', 'Wine', 'Bottle Green']
    },
    {
      id: 7,
      name: 'Digital Print Lawn Summer Suit',
      price: 2950,
      category: 'Lawn Suits',
      description: 'Vibrant digital-print lawn suit designed for warm weather. Light fabric with a modern Pakistani cut.',
      image: 'https://images.pexels.com/photos/20690524/pexels-photo-20690524.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Yellow', 'Coral', 'Aqua']
    },
    {
      id: 8,
      name: 'Silk Blend Embroidered Kurta Set',
      price: 4200,
      category: 'Kurta Sets',
      description: 'Rich silk-blend kurta with subtle embroidery and matching pants. Perfect for festive evenings.',
      image: 'https://images.pexels.com/photos/25184935/pexels-photo-25184935.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Ivory', 'Burgundy', 'Emerald']
    },
    {
      id: 9,
      name: 'Karandi Embroidered Winter Suit',
      price: 3350,
      category: 'Embroidered Suits',
      description: 'Warm karandi fabric suit with classic embroidery. A graceful option for cooler-season occasions.',
      image: 'https://images.pexels.com/photos/35485419/pexels-photo-35485419.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Rust', 'Charcoal', 'Deep Blue']
    },
    {
      id: 10,
      name: 'Chiffon Embroidered Party Suit',
      price: 4350,
      category: 'Formal Wear',
      description: 'Flowing chiffon party suit with refined embroidery and a soft dupatta for evening events.',
      image: 'https://images.pexels.com/photos/25184996/pexels-photo-25184996.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Rose', 'Black', 'Silver Grey']
    },
    {
      id: 11,
      name: 'Jacquard 2-Piece Pret Suit',
      price: 3100,
      category: 'Pret Wear',
      description: 'Textured jacquard 2-piece pret suit with a tailored fit. Ready-to-wear elegance for daily polish.',
      image: 'https://images.pexels.com/photos/20690517/pexels-photo-20690517.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Fawn', 'Olive', 'Plum']
    },
    {
      id: 12,
      name: 'Hand Embroidered Khaddar Suit',
      price: 3550,
      category: 'Embroidered Suits',
      description: 'Hand-embroidered khaddar suit with traditional detailing. Comfortable eastern wear with artisanal finish.',
      image: 'https://images.pexels.com/photos/20777172/pexels-photo-20777172.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Cream', 'Mehndi', 'Brick Red']
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
        case 'under3000': return price < 3000;
        case '3000to3500': return price >= 3000 && price < 3500;
        case '3500to4000': return price >= 3500 && price < 4000;
        case 'over4000': return price >= 4000;
        default: return false;
      }
    });
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(product => product.category))];
  }
}
