import { Component, OnDestroy, OnInit, signal } from '@angular/core';

interface PromotionMessage {
  type: string;
  title?: string;
  message?: string;
  discount?: number;
  expiresAt?: string;
  createdAt?: string;
}

@Component({
  selector: 'app-promotion-banner',
  standalone: true,
  templateUrl: './promotion-banner.html',
  styleUrl: './promotion-banner.scss'
})
export class PromotionBanner implements OnInit, OnDestroy {
  readonly promotion = signal<PromotionMessage | null>({
    type: 'promotion',
    title: 'Flash Promotion',
    message: 'Get a limited-time discount on selected retail products.',
    discount: 20,
    expiresAt: '2026-12-31'
  });
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.connect();
  }

  ngOnDestroy(): void {
    this.reconnectTimer && clearTimeout(this.reconnectTimer);
    this.socket?.close();
  }

  dismiss(): void {
    this.promotion.set(null);
  }

  private connect(): void {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socketUrl = `${protocol}//localhost:3000/ws/promotions`;

    this.socket = new WebSocket(socketUrl);

    this.socket.onmessage = event => {
      try {
        const data = JSON.parse(event.data) as PromotionMessage;
        if (data.type === 'promotion') {
          this.promotion.set(data);
        }
      } catch {
        console.warn('Invalid promotion notification received');
      }
    };

    this.socket.onclose = () => {
      this.reconnectTimer = setTimeout(() => this.connect(), 5000);
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }
}
