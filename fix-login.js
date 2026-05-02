const fs = require('fs');
const path = require('path');

const filePath = 'frontend/src/pages/Login.jsx';

let content = fs.readFileSync(filePath, 'utf8');

// Replace arbitrary variables with proper tailwind v4 utility classes
content = content.replace(/bg-\[var\(--color-apple-blue\)]/g, 'bg-apple-blue');
content = content.replace(/hover:bg-\[var\(--color-apple-blue-hover\)]/g, 'hover:bg-apple-blue-hover');
content = content.replace(/text-\[var\(--color-apple-blue\)]/g, 'text-apple-blue');
content = content.replace(/hover:text-\[var\(--color-apple-blue-hover\)]/g, 'hover:text-apple-blue-hover');
content = content.replace(/focus:ring-\[var\(--color-apple-blue\)]/g, 'focus:ring-apple-blue');
content = content.replace(/focus:border-\[var\(--color-apple-blue\)]/g, 'focus:border-apple-blue');
content = content.replace(/border-\[var\(--color-apple-blue\)]/g, 'border-apple-blue');

// Apple background and text colors
content = content.replace(/bg-\[var\(--color-apple-bg\)]/g, 'bg-apple-bg');
content = content.replace(/bg-\[var\(--color-apple-card\)]/g, 'bg-apple-card');
content = content.replace(/text-\[var\(--color-apple-text\)]/g, 'text-apple-text');
content = content.replace(/text-\[var\(--color-apple-text-secondary\)]/g, 'text-apple-text-secondary');
content = content.replace(/border-\[var\(--color-apple-border\)]/g, 'border-apple-border');

fs.writeFileSync(filePath, content);
console.log('Fixed Login.jsx');
