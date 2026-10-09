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

function flipShade(shadeStr) {
  const shade = parseInt(shadeStr, 10);
  if (shade === 50) return '900';
  if (shade === 100) return '800';
  if (shade === 200) return '700';
  if (shade === 300) return '600';
  if (shade === 400) return '600'; // 500 is often border or primary
  if (shade === 500) return '500';
  if (shade === 600) return '400';
  if (shade === 700) return '200';
  if (shade === 800) return '100';
  if (shade === 900) return '50';
  if (shade === 950) return '50';
  return shadeStr;
}

let totalChanges = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // 1. Text Colors: light shades (200, 300, 400) on white bg are invisible.
  // We need to map `text-{color}-{shade}` to `text-{color}-{flipped} dark:text-{color}-{shade}`
  // But ONLY for specific colors used in portals (green, blue, purple, amber, red)
  // We already handled slate.
  const colors = ['green', 'blue', 'purple', 'amber', 'red', 'emerald'];
  
  colors.forEach(color => {
    // Text
    const textRegex = new RegExp(`(?<!dark:)(?<!light:)\\b(hover:|focus:)?text-${color}-(\\d{3})(?:\\/\\d+)?\\b`, 'g');
    content = content.replace(textRegex, (match, variant, shade) => {
      variant = variant || '';
      const num = parseInt(shade, 10);
      if (num <= 400) { // It's a light color designed for dark mode
        return `${variant}text-${color}-${flipShade(shade)} dark:${match}`;
      }
      return match;
    });

    // Backgrounds (bg-color-900 -> bg-color-50 dark:bg-color-900)
    const bgRegex = new RegExp(`(?<!dark:)(?<!light:)\\b(hover:|focus:)?bg-${color}-(\\d{3})(?:\\/\\d+)?\\b`, 'g');
    content = content.replace(bgRegex, (match, variant, shade) => {
      variant = variant || '';
      const num = parseInt(shade, 10);
      if (num >= 800) { // It's a dark background
        // Map 800/900/950 to 50 or 100
        const lightShade = num === 800 ? '100' : '50';
        // Strip opacity for the light mode background so it's solid clean, or keep it if needed.
        // Actually, let's keep opacity format for the dark part, but light part can be solid or low opacity.
        return `${variant}bg-${color}-${lightShade} dark:${match}`;
      }
      return match;
    });

    // Borders (border-color-900 -> border-color-200 dark:border-color-900)
    const borderRegex = new RegExp(`(?<!dark:)(?<!light:)\\b(hover:|focus:)?border-${color}-(\\d{3})(?:\\/\\d+)?\\b`, 'g');
    content = content.replace(borderRegex, (match, variant, shade) => {
      variant = variant || '';
      const num = parseInt(shade, 10);
      if (num >= 700) { 
        return `${variant}border-${color}-200 dark:${match}`;
      }
      return match;
    });
  });

  // 2. Fix the hover backgrounds that got missed. 
  // In `SuperAdminLayout` etc: `hover:bg-slate-700` without dark text hover.
  // Let's just manually fix the Google button.
  content = content.replace(/hover:bg-slate-700 text-slate-900 dark:text-white/g, 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white');

  // 3. Any `bg-black` -> `bg-white dark:bg-black`
  content = content.replace(/(?<!dark:)\bbg-black\b/g, 'bg-white dark:bg-black');
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    totalChanges++;
  }
});

console.log(`Deep theme updated ${totalChanges} files for dark/light mode support.`);
