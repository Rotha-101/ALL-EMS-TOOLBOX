const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

// The problematic string
const badString = `showlegend: Boolean(evalDataRaw.dispatchP[pk]?.some((v: any) => v != null && !isNaN(v)))`;
const goodString = `showlegend: Boolean(evalDataRaw.dispatchP[pk]?.some((v) => v != null && !isNaN(v)))`;

content = content.split(badString).join(goodString);

fs.writeFileSync(file, content);
console.log('Fixed syntax error in HTML export string!');
