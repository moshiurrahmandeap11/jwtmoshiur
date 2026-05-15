"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeJwtMoshiur = initializeJwtMoshiur;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function initializeJwtMoshiur() {
    const projectRoot = process.cwd();
    // Generate a random secret if JWT_SECRET is not provided
    const randomSecret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // Create .env with JWT configuration
    const envContent = `# JWT Moshiur Configuration
JWT_SECRET=${randomSecret}
JWT_EXPIRY=24h
`;
    // Check if .env exists, if not create it
    const envPath = path_1.default.join(projectRoot, '.env');
    if (!fs_1.default.existsSync(envPath)) {
        fs_1.default.writeFileSync(envPath, envContent);
        console.log('✓ .env file created with JWT configuration');
    }
    else {
        // Check if JWT_SECRET already exists
        const envData = fs_1.default.readFileSync(envPath, 'utf-8');
        if (!envData.includes('JWT_SECRET')) {
            fs_1.default.appendFileSync(envPath, `\n${envContent}`);
            console.log('✓ JWT configuration added to existing .env');
        }
        else {
            console.log('✓ JWT configuration already exists in .env');
        }
    }
    // Create utils directory
    const utilsDir = path_1.default.join(projectRoot, 'utils');
    if (!fs_1.default.existsSync(utilsDir)) {
        fs_1.default.mkdirSync(utilsDir);
    }
    // Determine if this is a TypeScript project
    const isTypeScript = fs_1.default.existsSync(path_1.default.join(projectRoot, 'tsconfig.json'));
    // Get the path to templates in the jwtmoshiur package
    const packageDir = path_1.default.dirname(path_1.default.dirname(__filename)); // Go up from dist to package root
    const templatesDir = path_1.default.join(packageDir, 'dist', 'templates');
    // If templates not found in dist, try src (for development)
    const actualTemplatesDir = fs_1.default.existsSync(templatesDir)
        ? templatesDir
        : path_1.default.join(packageDir, 'src', 'templates');
    // Generate token function content
    const generateTokenContent = `const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY 
  });
}

module.exports = { generateToken };
`;
    // Generate token TS content
    const generateTokenTsContent = `import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRY 
  });
}
`;
    // Verify token function content
    const verifyTokenContent = `const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

module.exports = { verifyToken };
`;
    // Verify token TS content
    const verifyTokenTsContent = `import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
`;
    // Create token files based on project type
    if (isTypeScript) {
        const generateTokenPath = path_1.default.join(utilsDir, 'generateToken.ts');
        const verifyTokenPath = path_1.default.join(utilsDir, 'verifyToken.ts');
        if (!fs_1.default.existsSync(generateTokenPath)) {
            fs_1.default.writeFileSync(generateTokenPath, generateTokenTsContent);
            console.log('✓ generateToken.ts created in utils folder');
        }
        if (!fs_1.default.existsSync(verifyTokenPath)) {
            fs_1.default.writeFileSync(verifyTokenPath, verifyTokenTsContent);
            console.log('✓ verifyToken.ts created in utils folder');
        }
    }
    else {
        const generateTokenPath = path_1.default.join(utilsDir, 'generateToken.js');
        const verifyTokenPath = path_1.default.join(utilsDir, 'verifyToken.js');
        if (!fs_1.default.existsSync(generateTokenPath)) {
            fs_1.default.writeFileSync(generateTokenPath, generateTokenContent);
            console.log('✓ generateToken.js created in utils folder');
        }
        if (!fs_1.default.existsSync(verifyTokenPath)) {
            fs_1.default.writeFileSync(verifyTokenPath, verifyTokenContent);
            console.log('✓ verifyToken.js created in utils folder');
        }
    }
    // Install necessary packages if not already installed
    console.log('📦 Checking dependencies...');
    try {
        const packageJsonPath = path_1.default.join(projectRoot, 'package.json');
        if (fs_1.default.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs_1.default.readFileSync(packageJsonPath, 'utf-8'));
            const hasJwt = packageJson.dependencies?.jsonwebtoken || packageJson.devDependencies?.jsonwebtoken;
            const hasDotenv = packageJson.dependencies?.dotenv || packageJson.devDependencies?.dotenv;
            if (!hasJwt || !hasDotenv) {
                (0, child_process_1.execSync)('npm install jsonwebtoken dotenv', { stdio: 'inherit' });
            }
            if (isTypeScript) {
                const hasTypes = packageJson.devDependencies?.['@types/jsonwebtoken'];
                if (!hasTypes) {
                    (0, child_process_1.execSync)('npm install --save-dev @types/jsonwebtoken', { stdio: 'inherit' });
                }
            }
        }
    }
    catch (error) {
        console.log('⚠ Warning: Could not verify or install dependencies');
    }
    console.log('\n🎉 JWT Moshiur setup complete!');
    console.log('📝 Next steps:');
    console.log('   1. Edit .env and change JWT_SECRET to a strong secret key');
    console.log('   2. Import and use generateToken() and verifyToken() from utils/');
}
