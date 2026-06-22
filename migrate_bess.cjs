const fs = require('fs');
const path = require('path');

const mainAppDir = 'C:\\Users\\USER\\Desktop\\0. CHEA Rotha\\ESS_Project_V0.1-main - Copy';
const bessAppDir = 'C:\\Users\\USER\\Desktop\\0. CHEA Rotha\\All Project\\BESS_PowerFlow 20%';

// 1. Create powerflow directories
const powerflowDir = path.join(mainAppDir, 'src', 'powerflow');
if (!fs.existsSync(powerflowDir)) fs.mkdirSync(powerflowDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest);
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Copy components, lib, pages
copyRecursiveSync(path.join(bessAppDir, 'src', 'components'), path.join(powerflowDir, 'components'));
copyRecursiveSync(path.join(bessAppDir, 'src', 'lib'), path.join(powerflowDir, 'lib'));
copyRecursiveSync(path.join(bessAppDir, 'src', 'pages'), path.join(powerflowDir, 'pages'));
copyRecursiveSync(path.join(bessAppDir, 'src', 'App.tsx'), path.join(powerflowDir, 'PowerFlowMode.tsx'));

// 2. Resolve Conflicts in copied files
const auditOld = path.join(powerflowDir, 'lib', 'audit-engine.js');
const auditNew = path.join(powerflowDir, 'lib', 'powerflow-audit-engine.js');
if (fs.existsSync(auditOld)) fs.renameSync(auditOld, auditNew);

const aiContextOld = path.join(powerflowDir, 'lib', 'ai-context.tsx');
const aiContextNew = path.join(powerflowDir, 'lib', 'powerflow-ai-context.tsx');
if (fs.existsSync(aiContextOld)) fs.renameSync(aiContextOld, aiContextNew);

// Function to find and replace in files
function replaceInFiles(dir, replacements) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      replaceInFiles(fullPath, replacements);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [from, to] of replacements) {
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

// Fix imports in powerflow folder
replaceInFiles(powerflowDir, [
  ['./audit-engine.js', './powerflow-audit-engine.js'],
  ['../lib/audit-engine.js', '../lib/powerflow-audit-engine.js'],
  ['./ai-context', './powerflow-ai-context'],
  ['../lib/ai-context', '../lib/powerflow-ai-context'],
  ['@/lib/utils', '../../../lib/utils'], // Fix aliasing if needed, wait, main app also uses @/lib/utils, so it's fine to leave @/lib/utils.
  ['saveMatlabFigures', 'powerflowSaveMatlabFigures'],
  ['saveMatlabScript', 'powerflowSaveMatlabScript'],
  ['loadMatlabScript', 'powerflowLoadMatlabScript']
]);

// 3. Extract and inject BESS Electron IPCs
const bessMainCjs = fs.readFileSync(path.join(bessAppDir, 'electron-main.cjs'), 'utf8');
const mainAppCjsPath = path.join(mainAppDir, 'electron', 'main.cjs');
let mainAppCjs = fs.readFileSync(mainAppCjsPath, 'utf8');

// Find the start of IPC Handlers in BESS
const ipcStartTag = '// ── IPC Handlers ─────────────────────────────────────────────────────────────';
if (bessMainCjs.includes(ipcStartTag) && !mainAppCjs.includes(ipcStartTag)) {
  const ipcContentRaw = bessMainCjs.split(ipcStartTag)[1];
  
  // Need to rename the conflicting IPC handles
  let ipcContentAdapted = ipcContentRaw
    .replace(/"save-matlab-figures"/g, '"powerflow-save-matlab-figures"')
    .replace(/"save-matlab-script"/g, '"powerflow-save-matlab-script"')
    .replace(/"load-matlab-script"/g, '"powerflow-load-matlab-script"');
    
  mainAppCjs += '\n\n' + ipcStartTag + ipcContentAdapted;
  fs.writeFileSync(mainAppCjsPath, mainAppCjs);
  console.log('Appended BESS IPC handlers to main.cjs');
}

// 4. Update Main App preload.cjs
const bessPreloadPath = path.join(bessAppDir, 'preload.cjs');
const mainPreloadPath = path.join(mainAppDir, 'electron', 'preload.cjs');

if (fs.existsSync(bessPreloadPath) && fs.existsSync(mainPreloadPath)) {
  let mainPreload = fs.readFileSync(mainPreloadPath, 'utf8');
  if (!mainPreload.includes('selectFolder:')) {
    // Inject the BESS preload properties into Main App preload
    const newProps = `
  selectFolder: () => ipcRenderer.invoke("select-folder"),
  selectAndReadFolder: () => ipcRenderer.invoke("select-and-read-folder"),
  saveFile: (filePath, base64Data) => ipcRenderer.invoke("save-file", filePath, base64Data),
  powerflowSaveMatlabFigures: (outputFolder, projectData) => ipcRenderer.invoke("powerflow-save-matlab-figures", outputFolder, projectData),
  powerflowSaveMatlabScript: (projectCode, scriptContent) => ipcRenderer.invoke("powerflow-save-matlab-script", projectCode, scriptContent),
  powerflowLoadMatlabScript: (projectCode) => ipcRenderer.invoke("powerflow-load-matlab-script", projectCode),
  checkExportedFiles: (folderPath) => ipcRenderer.invoke("check-exported-files", folderPath),
  loadResultJson: (filePath) => ipcRenderer.invoke("load-result-json", filePath),
  loadCycleHistory: () => ipcRenderer.invoke("load-cycle-history"),
  saveCycleHistory: (history) => ipcRenderer.invoke("save-cycle-history", history),
`;
    mainPreload = mainPreload.replace('saveMatlabFigures: (data) => ipcRenderer.invoke(\'save-matlab-figures\', data)', 'saveMatlabFigures: (data) => ipcRenderer.invoke(\'save-matlab-figures\', data),' + newProps);
    fs.writeFileSync(mainPreloadPath, mainPreload);
    console.log('Updated preload.cjs');
  }
}

console.log('Migration script completed.');
