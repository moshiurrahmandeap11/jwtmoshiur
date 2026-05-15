# 🔐 JWT Moshiur

> Zero-configuration JWT token generator and verifier with automatic project setup.

A lightweight, zero-configuration npm package that automatically sets up JWT authentication for your Node.js projects. Install once, get JWT utilities instantly!

[![npm version](https://img.shields.io/npm/v/jwtmoshiur.svg)](https://www.npmjs.com/package/jwtmoshiur)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

-  **Zero Configuration** - Automatic setup on installation
-  **Auto Project Setup** - Generates `.env` and utility files
-  **Generate Tokens** - Simple, intuitive token creation
-  **Verify Tokens** - Built-in token validation
-  **Secure** - Uses industry-standard `jsonwebtoken` library
-  **Lightweight** - Minimal dependencies
-  **TypeScript Ready** - Full TypeScript support
-  **Easy Integration** - Works with any Node.js project

##  Installation

```bash
npm install jwtmoshiur
```
# After running npm install jwtmoshiur then just run below command and boom 💥
```bash
npx jwtmoshiur
```

That's it! The package automatically:
-  Creates a `.env` file with secure JWT configuration
-  Generates `utils/generateToken.js` (or `.ts` for TypeScript projects)
-  Generates `utils/verifyToken.js` (or `.ts`)
-  Installs all required dependencies

##  Quick Start

### 1. Generate a Token

```javascript
const { generateToken } = require('./utils/generateToken');

const token = generateToken({
  userId: '12345',
  email: 'user@example.com',
  role: 'admin'
});

console.log(token);
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Verify a Token

```javascript
const { verifyToken } = require('./utils/verifyToken');

try {
  const decoded = verifyToken(token);
  console.log(decoded);
  // { userId: '12345', email: 'user@example.com', role: 'admin', iat: 1715772..., exp: 1715858... }
} catch (error) {
  console.error('Token is invalid or expired');
}
```

##  Usage Examples

### Express.js Authentication Middleware

```javascript
const express = require('express');
const { verifyToken } = require('./utils/verifyToken');
const { generateToken } = require('./utils/generateToken');

const app = express();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Login endpoint
app.post('/login', (req, res) => {
  const user = { id: 1, email: 'user@example.com' };
  const token = generateToken(user);
  res.json({ token });
});

// Protected endpoint
app.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Async/Await Pattern

```javascript
const { generateToken, verifyToken } = require('./utils');

async function authenticateUser(credentials) {
  try {
    // Generate token for user
    const token = generateToken({
      userId: credentials.id,
      email: credentials.email,
      timestamp: Date.now()
    });
    
    // Later, verify the token
    const payload = verifyToken(token);
    console.log('User authenticated:', payload.email);
    
    return payload;
  } catch (error) {
    console.error('Authentication failed:', error.message);
    throw error;
  }
}
```

### Custom Token Expiry

```javascript
const { generateToken } = require('./utils/generateToken');

// Create a token that expires in 1 hour
const shortToken = generateToken(
  { userId: '123' }
);

// The expiry is controlled by JWT_EXPIRY in .env
// Default: 24h
// Options: 1h, 7d, 30d, etc.
```

##  Configuration

Edit your `.env` file to customize JWT settings:

```env
# JWT Moshiur Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=24h
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | Generated | Secret key for signing tokens (change this!) |
| `JWT_EXPIRY` | `24h` | Token expiration time (`1h`, `7d`, `30d`, etc.) |

** Important:** Always change `JWT_SECRET` to a strong, unique value in production!

##  API Reference

### `generateToken(payload: object): string`

Generates a signed JWT token.

**Parameters:**
- `payload` (object): Data to encode in the token

**Returns:** JWT token string

**Example:**
```javascript
const token = generateToken({ 
  userId: '123', 
  email: 'user@example.com',
  role: 'user'
});
```

### `verifyToken(token: string): object`

Verifies and decodes a JWT token.

**Parameters:**
- `token` (string): JWT token to verify

**Returns:** Decoded payload object

**Throws:** Error if token is invalid or expired

**Example:**
```javascript
try {
  const payload = verifyToken(token);
  console.log('Valid token:', payload);
} catch (error) {
  console.log('Invalid token:', error.message);
}
```

##  Manual Setup

If you need to re-run the setup process:

```bash
npx jwtmoshiur
```

This will regenerate the `.env` file and utility files if they don't exist.

##  Project Structure

After installation, your project will have:

```
your-project/
├── .env
├── utils/
│   ├── generateToken.js
│   └── verifyToken.js
├── node_modules/
│   └── jwtmoshiur/
└── package.json
```

##  Security Best Practices

1. **Never commit `.env` to version control**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   ```

2. **Use strong secrets**
   ```bash
   # Generate a strong secret (Linux/Mac)
   openssl rand -base64 32
   
   # Or use a random string generator
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Rotate secrets regularly** in production

4. **Use HTTPS** only in production

5. **Set appropriate expiry times** for your use case

## 🛠️ Troubleshooting

### Issue: Auto setup not working after npm install
**Solution:** Manually run the setup command:
```bash
npx jwtmoshiur
```

Or if you're in the package, run:
```bash
npm exec jwtmoshiur
```

Or update to v1.0.1+:
```bash
npm install jwtmoshiur@latest
```

### Issue: Token generation fails
**Solution:** Ensure `JWT_SECRET` is set in `.env`

### Issue: "Invalid token" error
**Solution:** Verify the token hasn't expired or been tampered with

### Issue: `.env` not created
**Solution:** Run `npx jwtmoshiur` to manually trigger setup

##  Requirements

- Node.js >= 14.0.0
- npm >= 6.0.0

##  Dependencies

- `jsonwebtoken` - JWT signing and verification
- `dotenv` - Environment variable management

##  License

MIT License - see LICENSE file for details

##  Author

Created by **Moshiur Rahman Deap**
Portfolio - (Moshiur Rahman Deap)[https://moshiurrahman.online]

##  Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

##  Support

If you have any questions or issues, please open an issue on GitHub or contact the maintainer.

---

**Happy coding! 🎉**