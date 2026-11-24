import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';
import { EditProduct } from '../../../pages/edit-product/edit-product';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Sidebar, Header, Footer, RouterOutlet, EditProduct],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {}
