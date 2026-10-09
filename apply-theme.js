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

const replacements = [
  // Backgrounds
  { regex: /bg-slate-900(?!\/)/g, replacement: 'bg-white dark:bg-slate-900' },
  { regex: /bg-slate-950(?!\/)/g, replacement: 'bg-slate-50 dark:bg-slate-950' },
  { regex: /bg-slate-800(?!\/)/g, replacement: 'bg-slate-50 dark:bg-slate-800' },
  { regex: /bg-slate-900\/(\d+)/g, replacement: 'bg-white/$1 dark:bg-slate-900/$1' },
  { regex: /bg-slate-950\/(\d+)/g, replacement: 'bg-slate-50/$1 dark:bg-slate-950/$1' },
  
  // Custom glass
  { regex: /glass-dark/g, replacement: 'glass dark:glass-dark' },

  // Text colors (Avoid replacing text-white if it's already inside dark:text-white, or on primary buttons)
  // To keep it simple, we replace generic text-slate-xxx
  { regex: /text-slate-400/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /text-slate-300/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /text-slate-200/g, replacement: 'text-slate-700 dark:text-slate-200' },
  
  // Borders
  { regex: /border-slate-800/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /border-slate-700/g, replacement: 'border-slate-200 dark:border-slate-700' },
  { regex: /border-slate-700\/(\d+)/g, replacement: 'border-slate-200/$1 dark:border-slate-700/$1' },

  // Portal specific backgrounds
  { regex: /bg-blue-900\/50/g, replacement: 'bg-blue-50 dark:bg-blue-900/50' },
  { regex: /bg-green-950\/30/g, replacement: 'bg-green-50 dark:bg-green-950/30' },
  { regex: /bg-green-900\/50/g, replacement: 'bg-green-50 dark:bg-green-900/50' },
  { regex: /bg-emerald-900\/50/g, replacement: 'bg-emerald-50 dark:bg-emerald-900/50' },
];

let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(rule => {
    // We need to avoid double replacing, so if the string already has dark:, skip it.
    // A simple hack: replace first, then we can clean up any "dark:dark:" later if needed, 
    // but the regex doesn't match if it's already "dark:bg-slate-900" because we match the class.
    // Wait, regex /bg-slate-900/ WILL match "dark:bg-slate-900".
    // Better regex: /(?<!dark:)bg-slate-900(?!\/)/g
    
    // Convert rule.regex to a string to manipulate it
    let regStr = rule.regex.source;
    let newRegex = new RegExp(`(?<!dark:)(?<!light:)${regStr}`, 'g');
    content = content.replace(newRegex, rule.replacement);
  });

  // Handle text-white carefully: only if not preceded by dark: or hover: or inside a bg-primary block
  // This is tricky via regex. Instead, let's map text-white to text-slate-900 dark:text-white but 
  // only in specific files like layout.tsx, page.tsx headers. 
  // Actually, text-white on a dark background is very common. If we flipped the background to white, the text MUST flip to dark.
  content = content.replace(/(?<!dark:)(?<!hover:)text-white/g, 'text-slate-900 dark:text-white');

  // Fix buttons that got messed up (bg-primary text-slate-900 dark:text-white -> bg-primary text-white)
  content = content.replace(/bg-primary([^"']*)text-slate-900 dark:text-white/g, 'bg-primary$1text-white');
  content = content.replace(/bg-green-600([^"']*)text-slate-900 dark:text-white/g, 'bg-green-600$1text-white');
  content = content.replace(/bg-red-600([^"']*)text-slate-900 dark:text-white/g, 'bg-red-600$1text-white');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
  }
});

console.log(`Updated ${totalChanges} files for dark/light mode support.`);
