import { DecimalPipe } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';
import { Product } from '../../../models/product.model';
import { getProductCategoryName } from '../../../constants/product.constants';
import { CartStore } from '../../../services/cart.store';

@Component({
  selector: 'app-product-details-sidebar',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-details-sidebar.html',
  styleUrl: './product-details-sidebar.scss'
})
export class ProductDetailsSidebar {
  product = input.required<Product>();
  imageBaseUrl = input.required<string>();
  close = output<void>();

  constructor(readonly cartStore: CartStore) {}

  getCategoryName(categoryId: string): string {
    return getProductCategoryName(categoryId);
  }

  getImageUrl(image: string): string {
    return image
      ? `${this.imageBaseUrl()}${image}`
      : 'https://placehold.co/400x400?text=Product';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.close.emit();
  }
}
