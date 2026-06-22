const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  saveChartScript: (projectId, scriptContent) => ipcRenderer.invoke('save-chart-script', projectId, scriptContent),
  loadChartScript: (projectId) => ipcRenderer.invoke('load-chart-script', projectId),
  selectZipFile: (defaultName) => ipcRenderer.invoke('select-zip-file', defaultName),
  saveMatlabFigures: (data) => ipcRenderer.invoke('save-matlab-figures', data),
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

});
