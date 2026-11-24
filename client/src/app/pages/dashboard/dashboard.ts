import { Component, OnInit, effect, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product.model';
import { HttpService } from '../../services/http.service';
import { AppStateService } from '../../services/app-state.service';
import { AddProduct } from '../add-product/add-product';
import { ProductDetails } from '../product-details/product-details';
import { getProductCategoryName } from '../../constants/product.constants';
import { CartSidebar } from '../cart/cart-sidebar';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DecimalPipe, AddProduct, ProductDetails, CartSidebar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  productsList = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);

  imageBaseUrl = 'http://localhost:3000';

  constructor(
    private httpService: HttpService,
    readonly appState: AppStateService
  ) {

    effect(() => {
      const filters = this.appState.filters();
      this.appState.productRevision();

      console.log('Filter changed:', filters);

      this.getProducts(filters.category, filters.search, filters.discount, filters.color);
    });
  }

  ngOnInit() {
  }

  getProducts(category = '', search = '', discount = '', color = '') {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search.trim()) params.set('search', search.trim());
    if (discount) params.set('discount', discount);
    if (color.trim()) params.set('color', color.trim());

    const query = params.toString();
    const endpoint = query ? `products?${query}` : 'products';

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

  addProduct(product: Product): void {
    if (product.stock < 1) return;

    const items = this.appState.cartItems();
    const index = items.findIndex(item => this.isSameProduct(item.product, product));

    if (index === -1) {
      this.appState.cartItems.set([...items, { product, quantity: 1 }]);
      return;
    }

    if (items[index].quantity >= product.stock) return;

    this.appState.cartItems.set(items.map((item, itemIndex) =>
      itemIndex === index
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  }

  cartQuantity(product: Product): number {
    return this.appState.cartItems().find(item =>
      this.isSameProduct(item.product, product)
    )?.quantity ?? 0;
  }

  closeAddProduct() {
    this.appState.closeAddProduct();
    const filters = this.appState.filters();
    this.getProducts(filters.category, filters.search, filters.discount, filters.color);
  }

  private isSameProduct(left: Product, right: Product): boolean {
    if (left._id !== undefined && right._id !== undefined) {
      return left._id === right._id;
    }
    return left === right;
  }
}
