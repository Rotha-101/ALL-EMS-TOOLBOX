const fs = require('fs');

const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 730; i < 750; i++) {
    if (lines[i] && lines[i].includes('parsedData.totalCycle = {')) {
        // Find the closing brace of totalCycle
        for (let j = i; j < i + 10; j++) {
            if (lines[j] && lines[j].includes('};')) {
                // Insert here!
                lines.splice(j + 1, 0,
                    "",
                    "      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148);",
                    "      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148);"
                );
                fs.writeFileSync(file, lines.join('\n'), 'utf8');
                console.log("Success");
                process.exit(0);
            }
        }
    }
}
console.log("Not found");
