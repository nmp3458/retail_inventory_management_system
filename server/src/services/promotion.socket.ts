import type { Server as HttpServer } from 'http';
import type { IncomingMessage } from 'http';
import jwt from 'jsonwebtoken';
import { WebSocket, WebSocketServer } from 'ws';
import {
  AUTH_COOKIE_NAME,
  getJwtSecret,
  JWT_AUDIENCE,
  JWT_ISSUER
} from '../config/auth.ts';

let promotionServer: WebSocketServer | null = null;
let currentPromotion: {
  type: 'promotion';
  title: string;
  message: string;
  discount?: number;
  expiresAt?: string;
  createdAt: string;
} | null = {
  type: 'promotion',
  title: 'Flash Promotion',
  message: 'Get a limited-time discount on selected retail products.',
  discount: 20,
  expiresAt: '2026-12-31',
  createdAt: new Date().toISOString()
};

function getCookie(req: IncomingMessage, name: string): string | undefined {
  const cookies = req.headers.cookie?.split(';') ?? [];
  const prefix = `${name}=`;
  const cookie = cookies.find(value => value.trim().startsWith(prefix));
  return cookie?.trim().slice(prefix.length);
}

export function initializePromotionSocket(httpServer: HttpServer): void {
  promotionServer = new WebSocketServer({
    server: httpServer,
    path: '/ws/promotions'
  });

  promotionServer.on('connection', (socket: WebSocket) => {
    socket.send(JSON.stringify({
      type: 'connected',
      message: 'Promotion notifications connected'
    }));

    if (currentPromotion) {
      socket.send(JSON.stringify(currentPromotion));
    }
  });

  promotionServer.shouldHandle = (request: IncomingMessage) => {
    if (request.headers.origin) {
      const allowedOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:4200';
      if (request.headers.origin !== allowedOrigin) return false;
    }

    const token = getCookie(request, AUTH_COOKIE_NAME);
    if (!token) return false;

    try {
      jwt.verify(token, getJwtSecret(), {
        algorithms: ['HS256'],
        audience: JWT_AUDIENCE,
        issuer: JWT_ISSUER
      });
      return true;
    } catch {
      return false;
    }
  };
}

export function broadcastPromotion(promotion: {
  title: string;
  message: string;
  discount?: number;
  expiresAt?: string;
}): void {
  if (!promotionServer) return;

  currentPromotion = {
    type: 'promotion',
    ...promotion,
    createdAt: new Date().toISOString()
  };
  const payload = JSON.stringify(currentPromotion);

  promotionServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}
