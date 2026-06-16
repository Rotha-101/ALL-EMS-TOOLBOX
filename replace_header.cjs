const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const oldHandleDropStr = `    setUploadMessage('Files dropped successfully! Click RUN to start audit.');
    setTimeout(() => setUploadMessage(''), 5000);`;

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
    }`;

content = content.replace(oldHandleDropStr, newHandleDropStr);

// Let's replace the whole header div `<div className="flex items-center gap-2">...CLEAR ALL DATA...</div>`
let headerStart = content.indexOf('<div className="flex items-center gap-2">');
if (headerStart !== -1) {
    let clearAllDataIndex = content.indexOf('CLEAR ALL DATA', headerStart);
    if (clearAllDataIndex !== -1) {
        let divEnd = content.indexOf('</div>', clearAllDataIndex);
        if (divEnd !== -1) {
            let beforeHeader = content.substring(0, headerStart);
            let afterHeader = content.substring(divEnd + 6);
            
            let newHeader = `<div className="flex items-center gap-2">
          <Button 
            onClick={(e) => { e.stopPropagation(); handlePlantUpload(null, 'file'); }}
            className="bg-accent-blue text-foreground hover:bg-blue-600 h-7 text-[10px] font-bold px-6 shadow-none rounded-md"
            disabled={getHcBusy()}
          >
            File
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handlePlantUpload(null, 'folder'); }}
            className="border border-border-v bg-surface hover:bg-foreground/10 h-7 text-[10px] text-foreground font-bold px-6 shadow-none rounded-md"
            disabled={getHcBusy()}
          >
            Folder
          </Button>
          <Button 
            className="bg-red-600 text-white hover:bg-red-500 h-7 text-[10px] font-bold px-6 shadow-none rounded-md border-none"
            onClick={() => {
              hcForceStop();
              setProgress({ active: false, label: '', pct: 0 });
              setUploadMessage('Processing stopped by user.');
              setTimeout(() => setUploadMessage(''), 3000);
            }}
          >
            STOP
          </Button>
          <div className="w-[1px] h-4 bg-border-v mx-1"></div>
          <Button 
            className="bg-red-600 text-white hover:bg-red-500 h-7 text-[10px] font-bold px-6 shadow-none rounded-md border-none"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear ALL data for ALL plants?")) {
                hcClearPlantData(null, true);
                setUploadedFiles([]);
                setPendingFiles([]);
              }
            }}
          >
            CLEAR ALL DATA
          </Button>
        </div>`;
            
            content = beforeHeader + newHeader + afterHeader;
            fs.writeFileSync(file, content, 'utf8');
            console.log("Replaced successfully!");
        } else { console.log("div end not found"); }
    } else { console.log("clear all data not found"); }
} else { console.log("header start not found"); }
