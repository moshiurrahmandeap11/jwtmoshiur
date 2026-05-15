const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET: string = (process.env.JWT_SECRET || 'fallback-secret') as string;
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

interface TokenPayload {
  userId?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY 
  });
}