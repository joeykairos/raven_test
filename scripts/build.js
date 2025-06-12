import { execSync } from 'node:child_process';
import { join } from 'node:path';
import fs from 'fs';

// Parse custom --env argument
const args = process.argv.slice(2);
let environment = 'development';

for (const arg of args) {
  if (arg.startsWith('--env=')) {
    environment = arg.split('=')[1];
  }
}

console.log(`Building for environment: ${environment}`);

try {
  console.log('[ info ] cleaning up output directory (build)');
  execSync('npx rimraf build', { stdio: 'inherit' });

  console.log('[ info ] building assets with vite');
  execSync('vite build', { stdio: 'inherit' });

  console.log('[ info ] compiling typescript source (tsc)');
  execSync('node ace build', { stdio: 'inherit' });

  const envFile = `.env.${environment}`;
  const targetEnvFile = join('build', '.env');

  if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, targetEnvFile);
    console.log(`[ info ] copied ${envFile} -> ${targetEnvFile}`);
  } else {
    console.warn(`[ warn ] ${envFile} not found. No env file copied.`);
  }

  console.log('[ success ] build completed');
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
