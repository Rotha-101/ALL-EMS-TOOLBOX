const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleDropStr = `    setUploadMessage('Files dropped successfully! Click RUN to start audit.');
    setTimeout(() => setUploadMessage(''), 5000);
  };`;

const newHandleDropStr = `    setUploadMessage('Processing dropped files...');
    const tStart = Date.now();
    try {
      await hcBulkImport(filesArray);
      const duration = ((Date.now() - tStart) / 1000).toFixed(1);
      setUploadMessage(\`Audit complete in \${duration}s! Preview all plants below.\`);
      setTimeout(() => setUploadMessage(''), 8000);
    } catch (err: any) {
      console.error('Drop import error:', err);
      setUploadMessage(\`Error: \${err.message || String(err)}\`);
    }
  };`;

content = content.replace(oldHandleDropStr, newHandleDropStr);
fs.writeFileSync(file, content, 'utf8');
console.log("Updated handleDrop");
