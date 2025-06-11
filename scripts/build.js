import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const envArg = process.argv.find(arg => arg.startsWith('--env=')) || '--env=development';
const env = envArg.split('=')[1];

console.log(`Building for environment: ${env}`);

try {
  execSync('node ace build && tsc bin/server.ts --outDir build/bin --module ESNext --target ES2020 --moduleResolution Node', { stdio: 'inherit' });

  const envSourcePath = path.resolve(`.env.${env}`);
  const envTargetPath = path.resolve('build/.env');

  if (!fs.existsSync(envSourcePath)) {
    console.warn(`${envSourcePath} not found. Falling back to default .env`);
    fs.copyFileSync('.env', envTargetPath);
  } else {
    fs.copyFileSync(envSourcePath, envTargetPath);
  }

  console.log(`Successfully copied ${env} environment file to build/.env`);
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
