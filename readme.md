![JWT Moshiur](https://i.postimg.cc/wTPjXQF8/jwtmoshiur.gif)
---
## Video Tutorial
[Video](https://drive.google.com/file/d/1w1TPCT16trfnWAwcAqXnGJLhMMPv2Hri/view?usp=drive_link)
---

# JWT Moshiur

JWT Moshiur is a zero-configuration npm package for quickly adding JWT token generation and verification to Node.js applications. It creates the necessary project files automatically and keeps integration simple.

[![npm version](https://img.shields.io/npm/v/jwtmoshiur.svg)](https://www.npmjs.com/package/jwtmoshiur) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Overview

JWT Moshiur simplifies JWT integration by generating a `.env` file and utility scripts during installation. The package supports both JavaScript and TypeScript projects, so you can begin issuing and validating tokens with minimal setup.

## Installation

```bash
npm install jwtmoshiur
```

Once installation completes, run the setup command to generate configuration and utility files:

```bash
npx jwtmoshiur
```

After this command, your project will contain:

- `.env` with JWT configuration
- `utils/generateToken.js` or `utils/generateToken.ts`
- `utils/verifyToken.js` or `utils/verifyToken.ts`

## Quick Start

### Generate a Token

```javascript
const { generateToken } = require('./utils/generateToken');

const token = generateToken({
  userId: '12345',
  email: 'user@example.com',
  role: 'admin'
});

console.log(token);
```

### Verify a Token

```javascript
const { verifyToken } = require('./utils/verifyToken');

try {
  const decoded = verifyToken(token);
  console.log(decoded);
} catch (error) {
  console.error('Token is invalid or expired');
}
```

## Usage Examples

### Express.js Authentication Middleware

```javascript
const express = require('express');
const { verifyToken } = require('./utils/verifyToken');
const { generateToken } = require('./utils/generateToken');

const app = express();

const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization ? authorization.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/login', (req, res) => {
  const user = { id: 1, email: 'user@example.com' };
  const token = generateToken(user);
  res.json({ token });
});

app.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

### Simple Async/Await Example

```javascript
const { generateToken, verifyToken } = require('./utils');

async function authenticateUser(credentials) {
  const token = generateToken({
    userId: credentials.id,
    email: credentials.email,
    timestamp: Date.now()
  });

  const payload = verifyToken(token);
  console.log('Authenticated user:', payload.email);
  return payload;
}
```

### Custom Token Expiry

```javascript
const { generateToken } = require('./utils/generateToken');

const token = generateToken({ userId: '123' });
```

Token expiry is controlled by `JWT_EXPIRY` in `.env`.

## Configuration

Update your `.env` file to customize JWT settings:

```env
# JWT Moshiur Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRY=24h
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | Generated | Secret used to sign tokens |
| `JWT_EXPIRY` | `24h` | Token expiry period |

> Use a strong, unique secret in production.

## API Reference

### `generateToken(payload: object): string`

Generates a signed JWT token.

**Example:**

```javascript
const token = generateToken({
  userId: '123',
  email: 'user@example.com',
  role: 'user'
});
```

### `verifyToken(token: string): object`

Verifies a JWT token and returns the decoded payload.

**Example:**

```javascript
try {
  const payload = verifyToken(token);
  console.log('Valid token:', payload);
} catch (error) {
  console.error('Invalid token:', error.message);
}
```

## Manual Setup

If you need to run setup again:

```bash
npx jwtmoshiur
```

## Project Structure

After setup, your project will include:

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

## Security Guidelines

- Do not commit `.env` to source control.
- Use a strong JWT secret.
- Rotate secrets periodically.
- Use HTTPS in production.
- Choose an expiry period that fits your security requirements.

## Troubleshooting

#### Setup did not run automatically

Run:

```bash
npx jwtmoshiur
```

#### Token verification fails

- Confirm `JWT_SECRET` is present in `.env`
- Confirm token has not expired
- Confirm the token was generated with the same secret

#### `.env` file is missing

Run the setup command manually and verify the file exists.

## License

MIT

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