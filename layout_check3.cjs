const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let inSidebar = false;
let startLine = 0;
let endLine = 0;
let divCount = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Left sidebar for config')) {
    startLine = i;
    inSidebar = true;
  }
  if (inSidebar) {
    let opens = (lines[i].match(/<div/g) || []).length;
    let closes = (lines[i].match(/<\/div>/g) || []).length;
    divCount += opens - closes;
    if (divCount === 0 && opens === 0 && closes === 1) { // wait, if divCount hits 0, that's the closing div
        // wait, divCount logic might be flawed if it starts at 0.
        // Let's just print the 30 lines after `Left sidebar for config` to see how it opens
    }
  }
}

console.log("Lines 300 to 450:");
console.log(lines.slice(300, 450).join('\n'));
