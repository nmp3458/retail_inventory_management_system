import bcrypt from 'bcryptjs';
import User from '../models/user.model.ts';

export const AUTH_COOKIE_NAME = 'retail_inventory_token';
export const JWT_ISSUER = 'retail-inventory-api';
export const JWT_AUDIENCE = 'retail-inventory-client';

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set to at least 32 characters');
  }
  return secret;
}

export async function initializeAuth(): Promise<void> {
  getJwtSecret();

  if (await User.exists({})) {
    return;
  }

  const email = process.env.AUTH_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.AUTH_ADMIN_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set a valid AUTH_ADMIN_EMAIL to create the initial admin account');
  }
  if (!password || password.length < 12) {
    throw new Error('Set AUTH_ADMIN_PASSWORD to at least 12 characters to create the initial admin account');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await User.create({ email, passwordHash });
  console.log(`Initial admin account created for ${email}`);
}
