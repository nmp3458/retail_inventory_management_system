import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../../services/http.service';
import { Product } from '../../models/product.model';
import { PRODUCT_CATEGORIES } from '../../constants/product.constants';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss'
})
export class AddProduct {

  product = {
    name: '',
    description: '',
    category: '',
    price: 0,
    stock: 0
  };

  selectedImage: File | null = null;
  imagePreview = signal<string | null>(null);
  loading = signal(false);
  message = signal('');

  categories = PRODUCT_CATEGORIES;

  productAdded = output<void>();
  close = output<void>();

  constructor(private httpService: HttpService) {}

  onImageSelected(event: Event) {
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

    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  addProduct() {

    if (!this.selectedImage) {
      this.message.set('Please select a product image.');
      return;
    }

    const formData = new FormData();

    formData.append('name', this.product.name);
    formData.append('description', this.product.description);
    formData.append('category', this.product.category);
    formData.append('price', String(this.product.price));
    formData.append('stock', String(this.product.stock));
    formData.append('image', this.selectedImage);

    this.loading.set(true);
    this.message.set('');

    this.httpService.post<Product>(
      'products',
      formData
    ).subscribe({
      next: (response) => {
        this.message.set('Product added successfully!');

        this.product = {
          name: '',
          description: '',
          category: '',
          price: 0,
          stock: 0
        };

        this.selectedImage = null;
        this.imagePreview.set(null);
        this.loading.set(false);

         this.productAdded.emit();
      },
      error: (error) => {
        console.error(error);
        this.message.set('Unable to add product.');
        this.loading.set(false);
      }
    });
  }
}
