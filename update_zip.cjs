const fs = require('fs');

// 1. Update main.cjs
let mainFile = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/electron/main.cjs';
let mainContent = fs.readFileSync(mainFile, 'utf8');
mainContent = mainContent.replace(
    /ipcMain\.handle\('select-zip-file',\s*async\s*\(\)\s*=>\s*\{([\s\S]*?)defaultPath:\s*'MATLAB_Export\.zip'([\s\S]*?)\}\);/,
    "ipcMain.handle('select-zip-file', async (event, defaultName) => {$1defaultPath: defaultName || 'MATLAB_Export.zip'$2});"
);
fs.writeFileSync(mainFile, mainContent, 'utf8');

// 2. Update preload.cjs
let preloadFile = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/electron/preload.cjs';
let preloadContent = fs.readFileSync(preloadFile, 'utf8');
preloadContent = preloadContent.replace(
    /selectZipFile:\s*\(\)\s*=>\s*ipcRenderer\.invoke\('select-zip-file'\)/,
    "selectZipFile: (defaultName) => ipcRenderer.invoke('select-zip-file', defaultName)"
);
fs.writeFileSync(preloadFile, preloadContent, 'utf8');

// 3. Update App.tsx
let appFile = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/App.tsx';
let appContent = fs.readFileSync(appFile, 'utf8');

const oldFallbackDownload = /a\.download = `MATLAB_Scripts_\$\{project\}_\$\{Date\.now\(\)\}\.zip`;/;
const newFallbackDownload = "a.download = `MATLAB_Scripts_${(evalDataFromDB.dataDate || '').replace(/[^a-zA-Z0-9-]/g, '_')}_${project}.zip`;";
appContent = appContent.replace(oldFallbackDownload, newFallbackDownload);

const oldDesktopExportBlock = `      const outputZip = await (window as any).electronAPI.selectZipFile();
      if (!outputZip) return;

      const cachedData = useAppStore.getState().evalDataCache[project];
      if (!cachedData) {
        setProgress({ pct: 10, active: true, label: 'Loading dataset from local storage...' });
      } else {
        setProgress({ pct: 10, active: true, label: 'Loading dataset from memory cache (Fast)...' });
      }
      const evalData: any = await getEvalData();
      if (!evalData || !evalData.timestamps) {
        setProgress({ pct: 0, active: false, label: '' });
        setAlertData({
          type: 'error',
          title: 'No Data Found',
          message: 'No evaluation data found. Please load data in Daily Evaluation Graph first.'
        });
        return;
      }`;

const newDesktopExportBlock = `      const cachedData = useAppStore.getState().evalDataCache[project];
      if (!cachedData) {
        setProgress({ pct: 10, active: true, label: 'Loading dataset from local storage...' });
      } else {
        setProgress({ pct: 10, active: true, label: 'Loading dataset from memory cache (Fast)...' });
      }
      const evalData: any = await getEvalData();
      if (!evalData || !evalData.timestamps) {
        setProgress({ pct: 0, active: false, label: '' });
        setAlertData({
          type: 'error',
          title: 'No Data Found',
          message: 'No evaluation data found. Please load data in Daily Evaluation Graph first.'
        });
        return;
      }
      
      let safeDate = (evalData.dataDate || '').replace(/[^a-zA-Z0-9-]/g, '_');
      const defaultName = \`MATLAB_Export_\${safeDate}_\${project}.zip\`;
      const outputZip = await (window as any).electronAPI.selectZipFile(defaultName);
      if (!outputZip) {
        setProgress({ pct: 0, active: false, label: '' });
        return;
      }`;

appContent = appContent.replace(oldDesktopExportBlock, newDesktopExportBlock);
fs.writeFileSync(appFile, appContent, 'utf8');

console.log("Updated main.cjs, preload.cjs, and App.tsx successfully.");
