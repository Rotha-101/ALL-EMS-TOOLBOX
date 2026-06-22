const fs = require('fs');
const file = 'src/components/CycleCalculation.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 194; i < 216; i++) {
    if (lines[i] && lines[i].includes('if (project === \'SNTL400\') {')) {
        lines.splice(i, 23,
            "        const validP1 = cur.p1Blocks ? cur.p1Blocks.filter((b: any) => b.LastEquivalentNumberOfCycle !== null && !isNaN(b.LastEquivalentNumberOfCycle)) : [];",
            "        const validP2 = cur.p2Blocks ? cur.p2Blocks.filter((b: any) => b.LastEquivalentNumberOfCycle !== null && !isNaN(b.LastEquivalentNumberOfCycle)) : [];",
            "        const validP3 = cur.p3Blocks ? cur.p3Blocks.filter((b: any) => b.LastEquivalentNumberOfCycle !== null && !isNaN(b.LastEquivalentNumberOfCycle)) : [];",
            "        let allValid = [...validP1, ...validP2];",
            "        if (project !== 'SNTL400') allValid = [...allValid, ...validP3];",
            "        ",
            "        if (allValid.length > 0) {",
            "          cur.Average_Total_Plant_Cycle = allValid.reduce((s: number, b: any) => s + b.LastEquivalentNumberOfCycle, 0) / allValid.length;",
            "        } else {",
            "          cur.Average_Total_Plant_Cycle = null;",
            "        }",
            "        ",
            "        let sumD = 0;",
            "        let countD = 0;",
            "        if (cur.SWG01_DailyReached !== null) { sumD += cur.SWG01_DailyReached * validP1.length; countD += validP1.length; }",
            "        if (cur.SWG02_DailyReached !== null) { sumD += cur.SWG02_DailyReached * validP2.length; countD += validP2.length; }",
            "        if (project !== 'SNTL400' && cur.SWG03_DailyReached !== null) { sumD += cur.SWG03_DailyReached * validP3.length; countD += validP3.length; }",
            "        ",
            "        cur.Average_Daily_Cycle = countD > 0 ? sumD / countD : null;"
        );
        break;
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed CycleCalculation dynamic averages');
