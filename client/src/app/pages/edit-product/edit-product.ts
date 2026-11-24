import { DecimalPipe } from '@angular/common';
import { Component, HostListener, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { AppStateService } from '../../services/app-state.service';
import { Product } from '../../models/product.model';
import { PRODUCT_CATEGORIES, getProductCategoryName } from '../../constants/product.constants';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [DecimalPipe, FormsModule],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.scss'
})
export class EditProduct {
  readonly imageBaseUrl = 'http://localhost:3000';
  readonly categories = PRODUCT_CATEGORIES;

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  imagePreview = signal<string | null>(null);
  selectedImage: File | null = null;
  loading = signal(false);
  message = signal('');

  constructor(
    readonly appState: AppStateService,
    private httpService: HttpService
  ) {
    effect(() => {
      if (this.appState.editProductOpen()) {
        this.loadProducts();
      }
    });
  }

  loadProducts(): void {
    this.httpService.get<{ data: Product[] }>('products').subscribe({
      next: (response) => {
        const products = Array.isArray(response?.data) ? response.data : [];
        this.products.set(products);
        if (this.selectedProduct()) {
          const selected = products.find(product =>
            product._id === this.selectedProduct()?._id
          ) ?? null;
          if (selected) {
            this.selectProduct(selected);
          } else {
            this.selectedProduct.set(null);
          }
        }
      },
      error: (error) => {
        console.error(error);
        this.message.set('Unable to load products.');
      }
    });
  }

  selectProduct(product: Product): void {
    this.selectedProduct.set({
      ...product,
      discount: product.discount ?? 0,
      color: product.color ?? ''
    });
    this.selectedImage = null;
    this.imagePreview.set(null);
    this.message.set('');
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.message.set('Please select a valid image.');
      input.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.message.set('Image size must be less than 5 MB.');
      input.value = '';
      return;
    }

    this.selectedImage = file;
    this.message.set('');

    const reader = new FileReader();
    reader.onload = () => this.imagePreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  updateProduct(): void {
    const product = this.selectedProduct();
    if (!product?._id) return;

    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('category', product.category);
    formData.append('price', String(product.price));
    formData.append('stock', String(product.stock));
    formData.append('discount', String(product.discount ?? 0));
    formData.append('color', product.color ?? '');
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.loading.set(true);
    this.message.set('');

    this.httpService.put<{ data: Product }>(`products/${product._id}`, formData).subscribe({
      next: (response) => {
        this.message.set('Product updated successfully!');
        this.loading.set(false);
        this.selectedImage = null;
        this.imagePreview.set(null);
        this.appState.notifyProductUpdated();
        if (response?.data) {
          this.selectProduct(response.data);
        }
        this.loadProducts();
      },
      error: (error) => {
        console.error(error);
        this.message.set('Unable to update product.');
        this.loading.set(false);
      }
    });
  }

  getImageUrl(image: string): string {
    return image
      ? `${this.imageBaseUrl}${image}`
      : 'https://placehold.co/160x160?text=Product';
  }

  getCategoryName(categoryId: string): string {
    return getProductCategoryName(categoryId);
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.appState.editProductOpen()) {
      this.appState.closeEditProduct();
    }
  }
}
