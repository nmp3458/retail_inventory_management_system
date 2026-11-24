import { Component } from '@angular/core';
import { Footer } from '../footer/footer';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [Sidebar, Header, Footer, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss'
})
export class Main {}
