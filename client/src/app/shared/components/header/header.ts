import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FilterService } from '../../../services/filter.service';
import { CartStore } from '../../../services/cart.store';
import { PRODUCT_CATEGORIES } from '../../../constants/product.constants';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [FormsModule],
})
export class Header {
  readonly userInitials = 'NP';
  readonly categories = PRODUCT_CATEGORIES;

  searchText = '';
  category = '';

  constructor(
    private filterService: FilterService,
    readonly cartStore: CartStore,
    private router: Router
  ) { }

  onCategoryChange(category: string) {
    this.category = category;
    this.searchProducts();
  }

  // Send filter data to dashboard
  searchProducts() {
    this.filterService.setFilters({
      search: this.searchText,
      category: this.category
    });
  }

  logout() {
    this.cartStore.clear();
    this.filterService.clearFilters();
    this.router.navigate(['/Login']);
  }
}
