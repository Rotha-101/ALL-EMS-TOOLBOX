const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const lines = content.split('\n');
let flex1Index = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('flex-1 flex overflow-hidden')) {
    flex1Index = i;
    break;
  }
}

if (flex1Index !== -1) {
  let divCount = 0;
  for (let i = flex1Index; i < lines.length; i++) {
    let opens = (lines[i].match(/<div/g) || []).length;
    let closes = (lines[i].match(/<\/div>/g) || []).length;
    divCount += opens - closes;
    if (divCount === 0) {
      console.log(`flex-1 div closes at line ${i}`);
      console.log("Surrounding lines:");
      console.log(lines.slice(Math.max(0, i-5), i+10).join('\n'));
      break;
    }
  }
}
