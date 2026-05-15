#!/usr/bin/env node

try {
  const { initializeJwtMoshiur } = require('../dist/setup');
  console.log('\n 🔐 Initializing JWT Moshiur...\n');
  initializeJwtMoshiur();
} catch (error) {
  console.error(' Error during setup:', error.message);
  process.exit(0); // Don't fail npm install if setup fails
}