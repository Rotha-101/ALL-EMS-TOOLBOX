const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let runBtnIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('RUN') && lines[i].includes('Button')) {
    runBtnIndex = i;
    break;
  }
}

if(runBtnIndex !== -1) {
  console.log(lines.slice(Math.max(0, runBtnIndex - 20), runBtnIndex + 5).join('\n'));
} else {
  console.log("RUN button not found on a single line with Button. Trying regex.");
  let match = content.match(/<Button[\s\S]*?>\s*RUN\s*<\/Button>/);
  if (match) {
     console.log("Found RUN button.");
  }
}
