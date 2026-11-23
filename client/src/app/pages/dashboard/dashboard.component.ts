import { Component, OnInit } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
   
  }
  selectedCategory = 'All';

  categories = [
    'All', 'Clothing', 'Shoes', 'Watches', 'Accessories'
  ];

  products = [
    {
      id: 1,
      name: 'Classic White Shirt',
      category: 'Clothing',
      price: 1499,
      stock: 25,
      image: 'https://placehold.co/400x400?text=Shirt'
    },
    {
      id: 2,
      name: 'Urban Sneakers',
      category: 'Shoes',
      price: 2499,
      stock: 12,
      image: 'https://placehold.co/400x400?text=Shoes'
    },
    {
      id: 3,
      name: 'Classic Watch',
      category: 'Watches',
      price: 3999,
      stock: 8,
      image: 'https://placehold.co/400x400?text=Watch'
    },
    {
      id: 4,
      name: 'Leather Wallet',
      category: 'Accessories',
      price: 899,
      stock: 30,
      image: 'https://placehold.co/400x400?text=Wallet'
    }
  ];

  get filteredProducts() {
    if (this.selectedCategory === 'All') {
      return this.products;
    }

    return this.products.filter(
      p => p.category === this.selectedCategory
    );
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
}
