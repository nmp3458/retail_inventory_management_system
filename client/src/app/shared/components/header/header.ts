import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  imports: [DatePipe, FormsModule],
})
export class Header {
  readonly currentDate: Date = new Date();
  readonly userInitials = 'NP';

  searchText = '';
  category = '';

  constructor(private filterService: FilterService) { }

  // Send filter data to dashboard
  searchProducts() {
    this.filterService.setFilters({
      search: this.searchText,
      category: this.category
    });
  }
}
