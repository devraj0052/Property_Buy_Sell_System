const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'frontend', 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });
  return arrayOfFiles;
}

const files = getAllFiles(directory);

const colors = [
  { match: 'bg-slate-900', light: 'bg-white', dark: 'bg-slate-900' },
  { match: 'bg-slate-950', light: 'bg-slate-50', dark: 'bg-slate-950' },
  { match: 'bg-slate-800', light: 'bg-slate-100', dark: 'bg-slate-800' },
  { match: 'bg-slate-900/50', light: 'bg-white/50', dark: 'bg-slate-900/50' },
  { match: 'bg-slate-950/50', light: 'bg-slate-50/50', dark: 'bg-slate-950/50' },
  
  { match: 'text-white', light: 'text-slate-900', dark: 'text-white' },
  { match: 'text-slate-200', light: 'text-slate-700', dark: 'text-slate-200' },
  { match: 'text-slate-300', light: 'text-slate-600', dark: 'text-slate-300' },
  { match: 'text-slate-400', light: 'text-slate-500', dark: 'text-slate-400' },
  
  { match: 'border-slate-800', light: 'border-slate-200', dark: 'border-slate-800' },
  { match: 'border-slate-700', light: 'border-slate-200', dark: 'border-slate-700' },
  { match: 'border-slate-700/50', light: 'border-slate-200/50', dark: 'border-slate-700/50' },
  
  { match: 'bg-blue-900/50', light: 'bg-blue-50', dark: 'bg-blue-900/50' },
  { match: 'bg-green-950/30', light: 'bg-green-50', dark: 'bg-green-950/30' },
  { match: 'bg-green-900/50', light: 'bg-green-100', dark: 'bg-green-900/50' },
  { match: 'bg-emerald-900/50', light: 'bg-emerald-100', dark: 'bg-emerald-900/50' }
];

let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // First, we revert the previous script's naive replacement.
  // The previous script replaced "bg-slate-900" with "bg-white dark:bg-slate-900"
  // So "hover:bg-white dark:bg-slate-900" is what happened to "hover:bg-slate-900".
  // We need to clean this up.
  colors.forEach(c => {
    // Revert logic:
    // Find things like `bg-white dark:bg-slate-900` and turn it back into `bg-slate-900`
    // Or `hover:bg-white dark:bg-slate-900` -> `hover:bg-slate-900`
    const revertRegex = new RegExp(`(?:hover:|focus:|active:|disabled:)?${c.light.replace(/\//g, '\\/')} dark:(?:hover:|focus:|active:|disabled:)?${c.dark.replace(/\//g, '\\/')}`, 'g');
    content = content.replace(revertRegex, (match) => {
       // match is e.g. "hover:bg-white dark:bg-slate-900"
       // We just extract the variant from the first part
       let variant = '';
       if (match.startsWith('hover:')) variant = 'hover:';
       if (match.startsWith('focus:')) variant = 'focus:';
       if (match.startsWith('active:')) variant = 'active:';
       if (match.startsWith('disabled:')) variant = 'disabled:';
       return `${variant}${c.dark}`;
    });
    
    // Also revert exact naive matches without variants
    const naiveRevertRegex = new RegExp(`${c.light.replace(/\//g, '\\/')} dark:${c.dark.replace(/\//g, '\\/')}`, 'g');
    content = content.replace(naiveRevertRegex, c.dark);
  });

  // Now apply the smart replacement
  colors.forEach(c => {
    // Match the dark class, optionally preceded by a variant, but NOT preceded by dark: or light:
    const regex = new RegExp(`(?<!dark:)(?<!light:)\\b(hover:|focus:|active:|disabled:)?${c.match.replace(/\//g, '\\/')}\\b`, 'g');
    content = content.replace(regex, (match, variant) => {
       variant = variant || '';
       return `${variant}${c.light} dark:${variant}${c.dark}`;
    });
  });

  // Fix primary buttons that shouldn't have dark text in light mode
  content = content.replace(/bg-primary([^"']*)text-slate-900 dark:text-white/g, 'bg-primary$1text-white');
  content = content.replace(/bg-green-600([^"']*)text-slate-900 dark:text-white/g, 'bg-green-600$1text-white');
  content = content.replace(/bg-red-600([^"']*)text-slate-900 dark:text-white/g, 'bg-red-600$1text-white');
  content = content.replace(/bg-red-400([^"']*)text-slate-900 dark:text-white/g, 'bg-red-400$1text-white');
  content = content.replace(/bg-red-500([^"']*)text-slate-900 dark:text-white/g, 'bg-red-500$1text-white');

  // Fix glass-dark
  content = content.replace(/(?<!dark:)\b(hover:|focus:)?glass-dark\b/g, (m, v) => {
      v = v || '';
      return `${v}glass dark:${v}glass-dark`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
  }
});

console.log(`Smart updated ${totalChanges} files for dark/light mode support.`);
