import { computed, Injectable, signal } from '@angular/core';
import { CartItem, ProductFilter } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  readonly filters = signal<ProductFilter>({
    search: '',
    category: ''
  });
  readonly addProductOpen = signal(false);
  readonly cartOpen = signal(false);
  readonly cartItems = signal<CartItem[]>([]);
  readonly cartTotalQuantity = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly cartSubtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  setFilters(data: Partial<ProductFilter>): void {
    this.filters.update(current => ({
      ...current,
      ...data
    }));
  }

  clearFilters(): void {
    this.filters.set({
      search: '',
      category: ''
    });
  }

  openAddProduct(): void {
    this.addProductOpen.set(true);
  }

  closeAddProduct(): void {
    this.addProductOpen.set(false);
  }

  openCart(): void {
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  clearCart(): void {
    this.cartItems.set([]);
  }
}
