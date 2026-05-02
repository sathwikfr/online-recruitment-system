const fs = require('fs');
const path = require('path');

const dir = 'frontend/src/pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace primary colors
  content = content.replace(/bg-primary-600 hover:bg-primary-700/g, 'bg-[var(--color-apple-blue)] hover:bg-[var(--color-apple-blue-hover)] active:scale-[0.98]');
  content = content.replace(/bg-primary-600/g, 'bg-[var(--color-apple-blue)]');
  content = content.replace(/text-primary-600/g, 'text-[var(--color-apple-blue)]');
  content = content.replace(/text-primary-500/g, 'text-[var(--color-apple-blue)]');
  content = content.replace(/hover:text-primary-700/g, 'hover:text-[var(--color-apple-blue-hover)]');
  content = content.replace(/hover:text-primary-500/g, 'hover:text-[var(--color-apple-blue-hover)]');
  content = content.replace(/focus:ring-primary-500/g, 'focus:ring-[var(--color-apple-blue)]');
  content = content.replace(/hover:border-primary-400/g, 'hover:border-[var(--color-apple-blue)]');

  // Also replace some layout classes to Apple standard
  content = content.replace(/bg-white p-4 rounded-xl shadow-sm border border-slate-200/g, 'bg-[var(--color-apple-card)] p-5 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[var(--color-apple-border)]/50');
  content = content.replace(/bg-white rounded-xl shadow-sm border border-slate-200/g, 'bg-[var(--color-apple-card)] rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[var(--color-apple-border)]/50');
  
  content = content.replace(/px-4 py-2 rounded-lg/g, 'px-5 py-2.5 rounded-xl');
  content = content.replace(/px-4 py-2 rounded-md/g, 'px-5 py-2.5 rounded-xl');

  // The title headers
  content = content.replace(/text-2xl font-bold text-slate-800/g, 'text-[32px] font-semibold text-[var(--color-apple-text)] tracking-tight');
  content = content.replace(/text-slate-500 mt-1/g, 'text-[15px] font-medium text-[var(--color-apple-text-secondary)] mt-1');
  
  fs.writeFileSync(filePath, content);
});
console.log('Fixed styles in all pages!');
