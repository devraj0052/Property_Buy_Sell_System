const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('frontend/src');
let issuesFound = false;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let originalContent = content;
  let changed = false;

  const hookRegex = /\buse(State|Effect|Memo|Callback|Ref|Context)\b/g;
  let matches = [...content.matchAll(hookRegex)].map(m => m[1]);
  
  if (matches.length > 0) {
    // Has hooks
    let uniqueHooks = [...new Set(matches)];
    
    // Ensure 'use client' is present if it's a component/page
    if (f.endsWith('.tsx') && !content.includes('\'use client\'') && !content.includes('\"use client\"')) {
      content = "'use client';\n\n" + content;
      changed = true;
      console.log('Added use client to', f);
    }

    // Check imports from react
    let reactImportMatch = content.match(/import\s+({[^}]*})\s+from\s+['"]react['"]/);
    if (reactImportMatch) {
      let imported = reactImportMatch[1];
      let missingHooks = uniqueHooks.filter(h => !imported.includes('use' + h));
      if (missingHooks.length > 0) {
        let newImported = imported.replace('}', ', ' + missingHooks.map(h => 'use' + h).join(', ') + ' }');
        content = content.replace(reactImportMatch[0], `import ${newImported} from 'react'`);
        changed = true;
        console.log('Added missing hook imports to', f, missingHooks);
      }
    } else {
      let hooksToImport = uniqueHooks.map(h => 'use' + h).join(', ');
      content = content.replace(/['"]use client['"];?\n*/, `$&import { ${hooksToImport} } from 'react';\n`);
      changed = true;
      console.log('Added react import to', f, hooksToImport);
    }
  }

  if (changed) {
    fs.writeFileSync(f, content);
    issuesFound = true;
  }
});

if (!issuesFound) {
  console.log('No issues found or fixed.');
}
