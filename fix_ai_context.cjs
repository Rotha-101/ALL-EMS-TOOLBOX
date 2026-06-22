const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Replace powerflow-ai-context imports with the Main App's ai-context
      if (content.includes('powerflow-ai-context')) {
        content = content.replace(/import\s*\{.*?useAIContext.*?\}\s*from\s*['"].*?powerflow-ai-context.*?['"];/g, "import { useAIContext } from '@/lib/ai-context';");
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'src', 'powerflow'));
console.log('Fixed AI Context imports');
