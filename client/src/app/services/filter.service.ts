
import { Injectable, signal } from '@angular/core';
import { ProductFilter } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  // Shared signal
  filters = signal<ProductFilter>({
    search: '',
    category: ''
  });

  // Update filter data
  setFilters(data: Partial<ProductFilter>) {
    this.filters.update(current => ({
      ...current,
      ...data
    }));
  }

  // Clear filters
  clearFilters() {
    this.filters.set({
      search: '',
      category: '',
    });
  }
}
