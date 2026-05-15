interface TokenPayload {
    userId?: string;
    email?: string;
    role?: string;
    [key: string]: any;
}
export declare function generateToken(payload: TokenPayload): string;
export {};
