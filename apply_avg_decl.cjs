const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 670; i < 680; i++) {
    if (lines[i] && lines[i].includes('const matchingDay = cycleHistory.find')) {
        lines.splice(i + 1, 0, "            let parsedAvgTotal = NaN;", "            let parsedAvgDaily = NaN;");
        fs.writeFileSync(file, lines.join('\n'), 'utf8');
        console.log("Success");
        process.exit(0);
    }
}
console.log("Failed");
