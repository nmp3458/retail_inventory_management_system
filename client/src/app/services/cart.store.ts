import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private readonly cartItems = signal<CartItem[]>([]);

  readonly isOpen = signal(false);
  readonly items = this.cartItems.asReadonly();
  readonly totalQuantity = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0)
  );
  readonly subtotal = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  addProduct(product: Product): boolean {
    if (product.stock < 1) return false;

    const items = this.cartItems();
    const index = items.findIndex(item => this.isSameProduct(item.product, product));

    if (index === -1) {
      this.cartItems.set([...items, { product, quantity: 1 }]);
      return true;
    }

    if (items[index].quantity >= product.stock) return false;

    this.cartItems.set(items.map((item, itemIndex) =>
      itemIndex === index
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
    return true;
  }

  setQuantity(product: Product, quantity: number): void {
    const items = this.cartItems();
    const index = items.findIndex(item => this.isSameProduct(item.product, product));

    if (index === -1) return;

    if (product.stock < 1) {
      this.removeProduct(product);
      return;
    }

    const nextQuantity = Math.min(Math.max(1, Math.floor(quantity)), product.stock);
    this.cartItems.set(items.map((item, itemIndex) =>
      itemIndex === index
        ? { ...item, quantity: nextQuantity }
        : item
    ));
  }

  quantityFor(product: Product): number {
    return this.cartItems().find(item => this.isSameProduct(item.product, product))?.quantity ?? 0;
  }

  removeProduct(product: Product): void {
    this.cartItems.update(items =>
      items.filter(item => !this.isSameProduct(item.product, product))
    );
  }

  clear(): void {
    this.cartItems.set([]);
  }

  private isSameProduct(left: Product, right: Product): boolean {
    if (left._id !== undefined && right._id !== undefined) {
      return left._id === right._id;
    }
    return left === right;
  }
}
