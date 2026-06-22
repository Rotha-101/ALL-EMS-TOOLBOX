const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

function replaceStr(target, replacement) {
  const index = content.indexOf(target);
  if (index === -1) {
    console.error("COULD NOT FIND TARGET:\\n" + target);
    process.exit(1);
  }
  content = content.substring(0, index) + replacement + content.substring(index + target.length);
}

replaceStr(
  `const handleExportHtml = () => {`,
  `const handleExportHtml = async () => {`
);

replaceStr(
  `const handleExportAllHtml = () => {`,
  `const handleExportAllHtml = async () => {`
);

// We need to replace the download logic for ExportHtml
const oldDownloadLogicHtml = `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${project}_\${activeMetric}_\${selectedPlant}.html\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Open in a new window/tab
    window.open(url, '_blank');`;

const newDownloadLogicHtml = `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: \`\${project}_\${activeMetric}_\${selectedPlant}.html\`,
          types: [{
            description: 'HTML File',
            accept: { 'text/html': ['.html'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Failed to save file:', e);
      }
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${project}_\${activeMetric}_\${selectedPlant}.html\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);`;

// Let's replace by finding the index of `const blob = new Blob([htmlContent]` after `handleExportHtml`
let startIdx = content.indexOf(`const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });`);
let endIdx = content.indexOf(`  };`, startIdx);
let oldStr = content.substring(startIdx, endIdx).trimEnd();
content = content.replace(oldStr, newDownloadLogicHtml);

// We need to replace the download logic for ExportAllHtml
const newDownloadLogicAllHtml = `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: \`\${project}_All_Graphs.html\`,
          types: [{
            description: 'HTML File',
            accept: { 'text/html': ['.html'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error('Failed to save file:', e);
      }
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${project}_All_Graphs.html\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);`;

let startIdxAll = content.indexOf(`const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });`, startIdx + 10);
let endIdxAll = content.indexOf(`  };`, startIdxAll);
let oldStrAll = content.substring(startIdxAll, endIdxAll).trimEnd();
content = content.replace(oldStrAll, newDownloadLogicAllHtml);

fs.writeFileSync(file, content);
console.log('SUCCESS!');
