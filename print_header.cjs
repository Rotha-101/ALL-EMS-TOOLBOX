const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const match = content.match(/<section className="flex-1 bg-panel[\s\S]*?RUN[\s\S]*?<\/Button>/);
if (match) {
  console.log(match[0]);
}
