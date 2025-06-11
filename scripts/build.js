import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const envArg = process.argv.find(arg => arg.startsWith('--env=')) || '--env=development';
const env = envArg.split('=')[1];

console.log(`Building for environment: ${env}`);

try {
  // Copy env file to default .env so ace can find it during build
  const envSourcePath = path.resolve(`.env.${env}`);
  const defaultEnvPath = path.resolve('.env');
  if (fs.existsSync(envSourcePath)) {
    fs.copyFileSync(envSourcePath, defaultEnvPath);
  }

  // Run ace build
  execSync('node ace build && tsc bin/server.ts --outDir build/bin --module ESNext --target ES2020 --moduleResolution Node', { stdio: 'inherit' });

  // Move env file into build folder for runtime
  const envTargetPath = path.resolve('build/.env');
  fs.copyFileSync(envSourcePath, envTargetPath);

  console.log(`Successfully copied ${env} environment file to build/.env`);
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
} finally {
  // Clean up temp .env to avoid confusion
  if (fs.existsSync('.env')) fs.unlinkSync('.env');
}
