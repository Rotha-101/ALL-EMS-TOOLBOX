const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 700; i < 740; i++) {
    if (lines[i] && lines[i].includes('if (project === "SNTL400") {')) {
        if (lines[i+1].includes('parsedAvgDaily = ((parsedDaily.plant1')) {
            lines.splice(i, 7,
                '              const allRows = project === "SNTL400" ? [...p1Rows, ...p2Rows] : [...p1Rows, ...p2Rows, ...p3Rows];',
                '              parsedAvgDaily = getDailyDiff(allRows);',
                '              const allBlocks = project === "SNTL400" ? [...p1Blocks, ...p2Blocks] : [...p1Blocks, ...p2Blocks, ...p3Blocks];',
                '              const validCycles = allBlocks.map(b => b.LastEquivalentNumberOfCycle).filter(v => v !== null && !isNaN(v));',
                '              parsedAvgTotal = validCycles.length > 0 ? validCycles.reduce((s, v) => s + v, 0) / validCycles.length : NaN;'
            );
        }
        break;
    }
}

for (let i = 730; i < 760; i++) {
    if (lines[i] && lines[i].includes('parsedData.avgTotalCycle = !isNaN(parsedAvgTotal)')) {
        lines[i] = "      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? (parsedData.totalCycle.plant1 + parsedData.totalCycle.plant2) / 2 : (parsedData.totalCycle.plant1 + parsedData.totalCycle.plant2 + parsedData.totalCycle.plant3) / 3);";
    }
    if (lines[i] && lines[i].includes('parsedData.avgDailyCycle = !isNaN(parsedAvgDaily)')) {
        lines[i] = "      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? (parsedData.dailyCycle.plant1 + parsedData.dailyCycle.plant2) / 2 : (parsedData.dailyCycle.plant1 + parsedData.dailyCycle.plant2 + parsedData.dailyCycle.plant3) / 3);";
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed DailyEvaluationGraph logic');
