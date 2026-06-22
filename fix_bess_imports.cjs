const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;

      // Fix utils import
      if (content.includes('../../../lib/utils') || content.includes('../../lib/utils') || content.includes('../lib/utils')) {
        content = content.replace(/import \{ cn \} from ['"]\.\.\/\.\.\/\.\.\/lib\/utils['"];/g, "import { cn } from '@/lib/utils';");
        content = content.replace(/import \{ cn \} from ['"]\.\.\/\.\.\/lib\/utils['"];/g, "import { cn } from '@/lib/utils';");
        content = content.replace(/import \{ cn \} from ['"]\.\.\/lib\/utils['"];/g, "import { cn } from '@/lib/utils';");
        modified = true;
      }

      // Fix PowerFlowMode imports
      if (file === 'PowerFlowMode.tsx') {
        content = content.replace(/import \{ useAIContext \} from '\.\.\/lib\/powerflow-ai-context';/g, "import { useAIContext } from './lib/powerflow-ai-context';");
        content = content.replace(/import \{ \n  hcInitProjects/g, "import {\n  hcInitProjects");
        content = content.replace(/\} from '\.\.\/lib\/powerflow-audit-engine.js';/g, "} from './lib/powerflow-audit-engine.js';");
        content = content.replace(/import \{ ess20SharedState, syncCycleHistoryFromDisk \} from '\.\.\/lib\/ess20-shared-state';/g, "import { ess20SharedState, syncCycleHistoryFromDisk } from './lib/ess20-shared-state';");
        modified = true;
      }
      
      // Fix ESS20Tool onClick
      if (file === 'ESS20Tool.tsx') {
        content = content.replace(/onClick=\{runAnalysis\}/g, "onClick={() => runAnalysis()}");
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'powerflow'));
console.log('Fixed BESS imports and onClick handlers');
