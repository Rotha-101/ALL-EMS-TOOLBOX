const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. We need to remove the Global Upload Box.
// We will find its start and end by regex.
const globalUploadBoxRegex = /\{\/\* Global Upload Box \*\/\}[\s\S]*?disabled=\{getHcBusy\(\)\}\s*>\s*Folder\s*<\/Button>\s*<\/div>\s*<\/div>/;
const match = content.match(globalUploadBoxRegex);

if (!match) {
  console.log("Could not find Global Upload Box.");
} else {
  // We remove it from its original place
  content = content.replace(globalUploadBoxRegex, '');

  // 2. Add the buttons before the RUN button
  const buttonsCode = `          <Button 
            onClick={(e) => { e.stopPropagation(); handlePlantUpload(null, 'file'); }}
            className="bg-accent-blue text-foreground hover:bg-blue-600 h-7 text-[10px] font-bold px-4"
            disabled={getHcBusy()}
          >
            File
          </Button>
          <Button 
            onClick={(e) => { e.stopPropagation(); handlePlantUpload(null, 'folder'); }}
            variant="outline" 
            className="border-border-v hover:bg-foreground/10 h-7 text-[10px] text-foreground bg-transparent font-bold px-4"
            disabled={getHcBusy()}
          >
            Folder
          </Button>`;

  // We find where the RUN button starts:
  //         <div className="flex items-center gap-2">
  //           <Button 
  //             className="bg-blue-600 text-white hover:bg-blue-500 h-7 text-[10px] font-bold shadow-none px-5 transition-all border-none"
  const runBtnRegex = /(<div className="flex items-center gap-2">\s*)(<Button\s+className="bg-blue-600 text-white)/;
  
  if (content.match(runBtnRegex)) {
    content = content.replace(runBtnRegex, `$1${buttonsCode}\n          $2`);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Moved buttons successfully!");
  } else {
    console.log("Could not find RUN button wrapper.");
  }
}
