const fs = require('fs');
const path = require('path');

const appTsxPath = path.join(__dirname, 'src', 'App.tsx');
let content = fs.readFileSync(appTsxPath, 'utf8');

// 1. Import PowerFlowMode
if (!content.includes('import { PowerFlowMode }')) {
  content = content.replace(
    "export { DailyEvaluationGraph } from './components/DailyEvaluationGraph';",
    "export { DailyEvaluationGraph } from './components/DailyEvaluationGraph';\nimport { PowerFlowMode } from './powerflow/PowerFlowMode';"
  );
}

// 2. Add NavItem
if (!content.includes('activeTab === \'powerflow\'')) {
  content = content.replace(
    /<NavItem icon={<Battery size=\{14\} \/>} label="Daily Evaluation Graph" active=\{activeTab === 'soc'\} onClick=\{\(\) => switchTab\('soc'\)\} \/>/g,
    `<NavItem icon={<Battery size={14} />} label="Daily Evaluation Graph" active={activeTab === 'soc'} onClick={() => switchTab('soc')} />\n              <NavItem icon={<Activity size={14} />} label="PowerFlow 20%" active={activeTab === 'powerflow'} onClick={() => switchTab('powerflow')} />`
  );
}

// 3. Wrap <main>
if (!content.includes('{activeTab === \'powerflow\' ? (')) {
  content = content.replace(
    /<main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">/g,
    `{activeTab === 'powerflow' ? (\n          <PowerFlowMode />\n        ) : (\n        <main className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">`
  );
  
  // 4. Close wrap after </main>
  content = content.replace(
    /<\/main>/g,
    `</main>\n        )}`
  );
}

fs.writeFileSync(appTsxPath, content);
console.log('App.tsx updated safely.');
