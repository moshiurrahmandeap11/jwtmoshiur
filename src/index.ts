const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
import { initializeJwtMoshiur } from './setup';

dotenv.config();

const JWT_SECRET: string = (process.env.JWT_SECRET || 'fallback-secret') as string;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h';

interface TokenPayload {
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export function generateToken(payload: TokenPayload, options?: any): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY,
    ...options 
  });
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

export function setup() {
  return initializeJwtMoshiur();
}

export { initializeJwtMoshiur };