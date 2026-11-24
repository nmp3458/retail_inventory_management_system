import { Component, OnInit, effect, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { HttpService } from '../../services/http.service';
import { FilterService } from '../../services/filter.service';
import { AddProduct } from '../add-product/add-product';
import { ProductDetailsSidebar } from '../../shared/components/product-details-sidebar/product-details-sidebar';
import { getProductCategoryName } from '../../constants/product.constants';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, AddProduct, ProductDetailsSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  productsList = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  showAddProduct = signal(false);

  imageBaseUrl = 'http://localhost:3000';

  constructor(private httpService: HttpService, private filterService: FilterService) {

    effect(() => {
      const filters = this.filterService.filters();

      console.log('Filter changed:', filters);

      this.getProducts(filters.category);
    });
  }

  ngOnInit() {
  }

  getProducts(category = '') {
    const endpoint = category
      ? `products?category=${encodeURIComponent(category)}`
      : 'products';

    this.httpService.get<{ data: Product[] }>(endpoint).subscribe({
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

  getCategoryName(categoryId: string): string {
    return getProductCategoryName(categoryId);
  }

  openProductDetails(product: Product) {
    this.selectedProduct.set(product);
  }

  closeProductDetails() {
    this.selectedProduct.set(null);
  }

  closeAddProduct() {
    this.showAddProduct.set(false);
    this.getProducts(this.filterService.filters().category);
  }
}
