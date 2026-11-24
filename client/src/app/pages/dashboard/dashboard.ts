import { Component, OnInit, effect, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { AddProduct } from '../add-product/add-product';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, AddProduct],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  productsList = signal<Product[]>([]);
  
  showAddProduct = signal(false);

  imageBaseUrl = 'http://localhost:3000';

  constructor(private httpService: HttpService, private filterService: FilterService) {

    effect(() => {
      const filters = this.filterService.filters();

      console.log('Filter changed:', filters);

      this.getProducts();
    });
  }

  ngOnInit() {
  }



  getProducts() {
    this.httpService.get<{ data: Product[] }>('products').subscribe({
      next: (data: { data: Product[] }) => {
        this.productsList.set(Array.isArray(data?.data) ? data.data : []);
        console.log('Products loaded:', this.productsList());
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  getImageUrl(image: string): string {
  return image
    ? `${this.imageBaseUrl}${image}`
    : 'https://placehold.co/400x400?text=Product';
}

  closeAddProduct() {
    this.showAddProduct.set(false);
    this.getProducts();
  }
}
