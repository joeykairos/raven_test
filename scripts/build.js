import { execSync } from 'node:child_process';

const envArg = process.argv.find((arg) => arg.startsWith('--env='));
const env = envArg ? envArg.split('=')[1] : 'development';

console.log(`Building for environment: ${env}`);

process.env.NODE_ENV = env;

try {
  execSync('node ace build', { stdio: 'inherit' });
} catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}
