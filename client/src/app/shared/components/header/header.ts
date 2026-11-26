import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AppStateService } from '../../../services/app-state.service';
import { AuthService } from '../../../services/auth.service';
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
  discount = '';
  color = '';

  constructor(
    readonly appState: AppStateService,
    private router: Router,
    private authService: AuthService
  ) { }

  onCategoryChange(category: string) {
    this.category = category;
    this.searchProducts();
  }

  onDiscountChange(discount: string) {
    this.discount = discount;
    this.searchProducts();
  }

  onColorChange() {
    this.searchProducts();
  }

  // Send filter data to dashboard
  searchProducts() {
    this.appState.setFilters({
      search: this.searchText,
      category: this.category,
      discount: this.discount,
      color: this.color
    });
  }

  openAddProduct(profileMenu: HTMLDetailsElement): void {
    profileMenu.open = false;
    this.appState.openAddProduct();
  }

  openEditProduct(profileMenu: HTMLDetailsElement): void {
    profileMenu.open = false;
    this.appState.openEditProduct();
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: (error: unknown) => {
        console.error('Logout request failed:', error);
        this.finishLogout();
      }
    });
  }

  private finishLogout(): void {
    this.appState.clearCart();
    this.appState.clearFilters();
    this.appState.closeAddProduct();
    this.appState.closeEditProduct();
    this.appState.closeCart();
    void this.router.navigate(['/Login']);
  }
}
