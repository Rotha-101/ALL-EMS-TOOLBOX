const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Fix fallback average logic around line 718-725
for (let i = 700; i < 740; i++) {
    if (lines[i] && lines[i].includes('parsedDaily.plant3 = getDailyDiff(p3Rows);')) {
        // delete following 5 lines 
        for (let j = 1; j <= 5; j++) {
            lines[i+j] = '';
        }
        // insert hardcoded logic
        lines.splice(i+1, 0,
            '              if (project === "SNTL400") {',
            '                parsedAvgDaily = ((parsedDaily.plant1 * 64) + (parsedDaily.plant2 * 40)) / 104;',
            '                parsedAvgTotal = ((parsedTotals.plant1 * 64) + (parsedTotals.plant2 * 40)) / 104;',
            '              } else {',
            '                parsedAvgDaily = ((parsedDaily.plant1 * 64) + (parsedDaily.plant2 * 40) + (parsedDaily.plant3 * 44)) / 148;',
            '                parsedAvgTotal = ((parsedTotals.plant1 * 64) + (parsedTotals.plant2 * 40) + (parsedTotals.plant3 * 44)) / 148;',
            '              }'
        );
        break;
    }
}

// 2. Add parsedData.avgTotalCycle and parsedData.avgDailyCycle after parsedData.totalCycle
for (let i = 730; i < 760; i++) {
    if (lines[i] && lines[i].includes('parsedData.totalCycle = {')) {
        for (let j = i; j < i + 10; j++) {
            if (lines[j] && lines[j].includes('};')) {
                lines.splice(j + 1, 0,
                    "",
                    "      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148);",
                    "      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148);"
                );
                break;
            }
        }
        break;
    }
}

// 3. Update overlay variables around line 4255
for (let i = 4200; i < 4300; i++) {
    if (lines[i] && lines[i].includes('const avgDaily = (evalData.dailyCycle.plant1')) {
        lines[i] = '      const avgDaily = evalData.avgDailyCycle !== undefined ? evalData.avgDailyCycle : ((evalData.dailyCycle.plant1 + evalData.dailyCycle.plant2 + (hasPlant3 ? evalData.dailyCycle.plant3 : 0)) / (hasPlant3 ? 3 : 2));';
    }
    if (lines[i] && lines[i].includes('const avgTotal = (evalData.totalCycle.plant1')) {
        lines[i] = '      const avgTotal = evalData.avgTotalCycle !== undefined ? evalData.avgTotalCycle : ((evalData.totalCycle.plant1 + evalData.totalCycle.plant2 + (hasPlant3 ? evalData.totalCycle.plant3 : 0)) / (hasPlant3 ? 3 : 2));';
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Successfully applied all hardcoded math logic');
