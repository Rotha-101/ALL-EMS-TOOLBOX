const fs = require('fs');
const path = require('path');

const powerFlowPath = path.join(__dirname, 'src/powerflow/PowerFlowMode.tsx');
let code = fs.readFileSync(powerFlowPath, 'utf8');

// The plant select dropdown
code = code.replace(
  /<SelectItem value="plant2" className="text-\[11px\]">Plant 2 \(SWG02\)<\/SelectItem>\s*\{project !== 'SNTB30MWH' && \(\s*<SelectItem value="plant3" className="text-\[11px\]">Plant 3 \(SWG03\)<\/SelectItem>\s*\)\}/,
  `{!isBessProject && <SelectItem value="plant2" className="text-[11px]">Plant 2 (SWG02)</SelectItem>}
                {!isBessProject && project !== 'SNTL400' && (
                  <SelectItem value="plant3" className="text-[11px]">Plant 3 (SWG03)</SelectItem>
                )}`
);

// We need to define isBessProject where the dropdown is rendered.
// The dropdown is rendered inside DailyEvaluationGraph of PowerFlowMode.tsx
// Let's add isBessProject at the top of DailyEvaluationGraph in PowerFlowMode.tsx
if (!code.includes('const isBessProject = typeof project')) {
  code = code.replace(
    /function DailyEvaluationGraph\(\{ theme, project \}: \{ theme: 'dark' \| 'light', project: string \}\) \{/s,
    `$&
  const isBessProject = typeof project === 'string' && (project.startsWith('SNTB') || project.startsWith('SNTV') || project.startsWith('SNTD') || project.startsWith('SNTZ') || project.startsWith('MSGP'));`
  );
}

// Replace the fallback logic `if (project === 'SNTB30MWH' && selectedPlant === 'plant3')`
code = code.replace(
  /if \(project === 'SNTB30MWH' && selectedPlant === 'plant3'\)/g,
  `if (isBessProject && selectedPlant !== 'plant1')`
);

// We should also look for `plants` arrays in PowerFlowMode.tsx DailyEvaluationGraph if they exist
code = code.replace(
  /const plants = \['plant1', 'plant2'\];/g,
  `const plants = isBessProject ? ['plant1'] : ['plant1', 'plant2'];`
);

fs.writeFileSync(powerFlowPath, code);
console.log('PowerFlowMode updated');
