import { execSync } from 'node:child_process';
import fs from 'node:fs';

const sources = {
  renderer: {
    from: '../web/build',
    to: './src/renderer',
  },
}

function copyRecursiveSync(src: string, dest: string) {
  const exists = fs.existsSync(src);
  if (!exists) {
    console.log(`Source ${src} does not exist`);
    return;
  }
  const stats = fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (exists && isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(`${src}/${childItemName}`, `${dest}/${childItemName}`);
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  fs.rmdirSync(sources.renderer.to, { recursive: true });
} catch (error) {}

execSync('npm run build', { stdio: 'inherit', cwd: '../web' });

copyRecursiveSync(sources.renderer.from, sources.renderer.to);
console.log('Copied all sources');
