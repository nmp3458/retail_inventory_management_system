import { Component, OnInit, effect, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { AddProductComponent } from '../add-product/add-product.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, AddProductComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  productsList = signal<Product[]>([]);

  showAddProduct = signal(false);

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
    this.httpService.get<Product[]>('products').subscribe({
      next: (data) => {
        this.productsList.set(data);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }

  closeAddProduct() {
    this.showAddProduct.set(false);
  }
}
