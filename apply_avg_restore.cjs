const fs = require('fs');

const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      parsedData.totalCycle = {
        plant1: isNaN(parsedTotals.plant1) ? 170.546875 : parsedTotals.plant1,
        plant2: isNaN(parsedTotals.plant2) ? 171.875000 : parsedTotals.plant2,
        plant3: isNaN(parsedTotals.plant3) ? 171.666667 : parsedTotals.plant3,
      };`;

const replacement = `      parsedData.totalCycle = {
        plant1: isNaN(parsedTotals.plant1) ? 170.546875 : parsedTotals.plant1,
        plant2: isNaN(parsedTotals.plant2) ? 171.875000 : parsedTotals.plant2,
        plant3: isNaN(parsedTotals.plant3) ? 171.666667 : parsedTotals.plant3,
      };

      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148);
      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148);`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}
