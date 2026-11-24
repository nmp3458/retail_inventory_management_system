import { computed, Injectable, signal } from '@angular/core';
import { CartItem, ProductFilter } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  readonly filters = signal<ProductFilter>({
    search: '',
    category: '',
    discount: '',
    color: ''
  });
  readonly addProductOpen = signal(false);
  readonly editProductOpen = signal(false);
  readonly productRevision = signal(0);
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
      category: '',
      discount: '',
      color: ''
    });
  }

  openAddProduct(): void {
    this.addProductOpen.set(true);
  }

  closeAddProduct(): void {
    this.addProductOpen.set(false);
  }

  openEditProduct(): void {
    this.editProductOpen.set(true);
  }

  closeEditProduct(): void {
    this.editProductOpen.set(false);
  }

  notifyProductUpdated(): void {
    this.productRevision.update(revision => revision + 1);
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
