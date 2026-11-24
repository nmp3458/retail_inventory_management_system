import { DecimalPipe } from '@angular/common';
import { Component, HostListener, input, output } from '@angular/core';
import { Product } from '../../models/product.model';
import { getProductCategoryName } from '../../constants/product.constants';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './product-details.html',
  styleUrl: './product-details.scss'
})
export class ProductDetails {
  product = input.required<Product>();
  imageBaseUrl = input.required<string>();
  cartQuantity = input.required<number>();
  close = output<void>();
  addToCart = output<Product>();

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
