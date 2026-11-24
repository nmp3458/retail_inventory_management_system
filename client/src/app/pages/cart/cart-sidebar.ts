import { DecimalPipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Product } from '../../models/product.model';
import { getProductCategoryName } from '../../constants/product.constants';
import { AppStateService } from '../../services/app-state.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss'
})
export class CartSidebar {
  readonly imageBaseUrl = 'http://localhost:3000';

  constructor(readonly appState: AppStateService) {}

  getImageUrl(image: string): string {
    return image
      ? `${this.imageBaseUrl}${image}`
      : 'https://placehold.co/120x120?text=Product';
  }

  getCategoryName(categoryId: string): string {
    return getProductCategoryName(categoryId);
  }

  setCartQuantity(product: Product, quantity: number): void {
    const items = this.appState.cartItems();
    const index = items.findIndex(item => this.isSameProduct(item.product, product));

    if (index === -1) return;

    if (product.stock < 1) {
      this.removeProduct(product);
      return;
    }

    const nextQuantity = Math.min(Math.max(1, Math.floor(quantity)), product.stock);
    this.appState.cartItems.set(items.map((item, itemIndex) =>
      itemIndex === index
        ? { ...item, quantity: nextQuantity }
        : item
    ));
  }

  removeProduct(product: Product): void {
    this.appState.cartItems.update(items =>
      items.filter(item => !this.isSameProduct(item.product, product))
    );
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.appState.cartOpen()) {
      this.appState.closeCart();
    }
  }

  private isSameProduct(left: Product, right: Product): boolean {
    if (left._id !== undefined && right._id !== undefined) {
      return left._id === right._id;
    }
    return left === right;
  }
}
