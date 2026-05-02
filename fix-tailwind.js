const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

// Also do App.jsx
files.push('../App.jsx');

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace arbitrary variables with proper tailwind v4 utility classes
  content = content.replace(/bg-\[var\(--color-apple-blue\)]/g, 'bg-apple-blue');
  content = content.replace(/hover:bg-\[var\(--color-apple-blue-hover\)]/g, 'hover:bg-apple-blue-hover');
  content = content.replace(/text-\[var\(--color-apple-blue\)]/g, 'text-apple-blue');
  content = content.replace(/hover:text-\[var\(--color-apple-blue-hover\)]/g, 'hover:text-apple-blue-hover');
  content = content.replace(/focus:ring-\[var\(--color-apple-blue\)]/g, 'focus:ring-apple-blue');
  content = content.replace(/focus:border-\[var\(--color-apple-blue\)]/g, 'focus:border-apple-blue');
  content = content.replace(/border-\[var\(--color-apple-blue\)]/g, 'border-apple-blue');
  
  // also fix those remaining hover:bg-primary-700
  content = content.replace(/hover:bg-primary-700/g, 'hover:bg-apple-blue-hover');
  
  // Apple background and text colors
  content = content.replace(/bg-\[var\(--color-apple-bg\)]/g, 'bg-apple-bg');
  content = content.replace(/bg-\[var\(--color-apple-card\)]/g, 'bg-apple-card');
  content = content.replace(/text-\[var\(--color-apple-text\)]/g, 'text-apple-text');
  content = content.replace(/text-\[var\(--color-apple-text-secondary\)]/g, 'text-apple-text-secondary');
  content = content.replace(/border-\[var\(--color-apple-border\)]/g, 'border-apple-border');
  
  fs.writeFileSync(filePath, content);
});
console.log('Fixed Tailwind arbitrary values to proper utility classes!');
