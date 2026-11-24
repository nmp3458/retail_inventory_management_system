import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Dashboard } from '../../../pages/dashboard/dashboard';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Sidebar, Header, Footer, Dashboard],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {}
