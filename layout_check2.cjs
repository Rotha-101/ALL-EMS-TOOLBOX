const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let startLine = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Left sidebar Drag & Drop')) {
    startLine = i;
    break;
  }
}

console.log(lines.slice(startLine + 90, startLine + 115).join('\n'));
