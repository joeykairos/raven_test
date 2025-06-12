import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use __dirname safely inside ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse env argument (default to development)
const envArg = process.argv.find(arg => arg.startsWith('--env=')) || '--env=development';
const env = envArg.split('=')[1];

console.log(`Building for environment: ${env}`);

try {
  // Run Adonis + Typescript build commands
  execSync('node ace build && tsc bin/server.ts --outDir build/bin --module ESNext --target ES2020 --moduleResolution Node', { stdio: 'inherit' });

  // Always resolve paths relative to project root (safe for GitHub actions & PM2)
  const envSourcePath = path.join(__dirname, `../.env.${env}`);
  const envTargetPath = path.join(__dirname, '../build/.env');

  if (!fs.existsSync(envSourcePath)) {
    console.warn(`${envSourcePath} not found. No environment file copied.`);
  } else {
    fs.copyFileSync(envSourcePath, envTargetPath);
    console.log(`Successfully copied ${env} env file to build/.env`);
  }
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
