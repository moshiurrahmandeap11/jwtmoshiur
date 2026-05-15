import { initializeJwtMoshiur } from './setup';
interface TokenPayload {
    userId?: string;
    email?: string;
    role?: string;
    [key: string]: any;
}
export declare function generateToken(payload: TokenPayload, options?: any): string;
export declare function verifyToken(token: string): any;
export declare function setup(): void;
export { initializeJwtMoshiur };
