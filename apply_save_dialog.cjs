const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

function replaceRegex(patternStr, replacement) {
  const regex = new RegExp(patternStr.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g, '\\\\$&').replace(/\\n/g, '\\\\r?\\\\n'), 'g');
  if (!regex.test(content)) {
    console.error("COULD NOT FIND REGEX TARGET:\\n" + patternStr.substring(0, 50));
    process.exit(1);
  }
  content = content.replace(regex, replacement);
}

replaceRegex(
  `const handleExportHtml = () => {`,
  `const handleExportHtml = async () => {`
);

replaceRegex(
  `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${project}_\${activeMetric}_\${selectedPlant}.html\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Open in a new window/tab
    window.open(url, '_blank');
  };`,
  `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
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
    document.body.removeChild(a);
  };`
);

replaceRegex(
  `const handleExportAllHtml = () => {`,
  `const handleExportAllHtml = async () => {`
);

replaceRegex(
  `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`\${project}_All_Graphs.html\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Open in a new window/tab
    window.open(url, '_blank');
  };`,
  `    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
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
    document.body.removeChild(a);
  };`
);

fs.writeFileSync(file, content);
console.log('SUCCESS!');
