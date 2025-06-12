import { execSync } from 'node:child_process';
import { join } from 'node:path';
import fs from 'fs';

const environment = process.env.NODE_ENV || 'development';
console.log(`Building for environment: ${environment}`);

// Cleanup previous build
console.log('[ info ] cleaning up output directory (build)');
execSync('rimraf build', { stdio: 'inherit' });

// Build frontend assets
console.log('[ info ] building assets with vite');
execSync('vite build', { stdio: 'inherit' });

// Compile typescript source
console.log('[ info ] compiling typescript source (tsc)');
execSync('node ace build', { stdio: 'inherit' });

// Copy meta files (public/, package.json, etc.)
// (Assuming your meta copying logic is already here)

// Automatically copy .env files
const envFile = `.env.${environment}`;
const targetEnvFile = join('build', '.env');

if (fs.existsSync(envFile)) {
  fs.copyFileSync(envFile, targetEnvFile);
  console.log(`[ info ] copied ${envFile} -> ${targetEnvFile}`);
} else {
  console.warn(`[ warn ] ${envFile} not found. No env file copied.`);
}

console.log('[ success ] build completed');
