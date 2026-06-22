const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    // Delete inner declarations
    if (lines[i].includes('let parsedAvgTotal = NaN;')) {
        lines[i] = '';
    }
    if (lines[i].includes('let parsedAvgDaily = NaN;')) {
        lines[i] = '';
    }

    // Insert outer declarations
    if (lines[i].includes('let parsedDaily = { plant1: NaN, plant2: NaN, plant3: NaN };')) {
        lines[i] = lines[i] + '\n      let parsedAvgTotal = NaN;\n      let parsedAvgDaily = NaN;';
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed variable scope');
