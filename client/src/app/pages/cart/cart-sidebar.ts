import { DecimalPipe } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { getProductCategoryName } from '../../constants/product.constants';
import { CartStore } from '../../services/cart.store';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cart-sidebar.html',
  styleUrl: './cart-sidebar.scss'
})
export class CartSidebar {
  readonly imageBaseUrl = 'http://localhost:3000';

  constructor(readonly cartStore: CartStore) {}

  getImageUrl(image: string): string {
    return image
      ? `${this.imageBaseUrl}${image}`
      : 'https://placehold.co/120x120?text=Product';
  }

  getCategoryName(categoryId: string): string {
    return getProductCategoryName(categoryId);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.cartStore.isOpen()) {
      this.cartStore.close();
    }
  }
}
