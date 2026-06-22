const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

// I'll replace the block from "if (i === 0) {" to "if (i === 1) {" 
// and the block from "if (i === 1) {" to "yOffset +="
// with single quotes.

const badBlock = `            if (i === 0) {
              const avgDaily = !isNaN(evalDataRaw.avgDailyCycle) ? evalDataRaw.avgDailyCycle : 0;
              const lines = [
                \`Daily cycle (\${evalDataRaw.dataDate}):\`,
                \`Cycle_Plant 01 = \${evalDataRaw.dailyCycle.plant1.toFixed(3)} -> \${getStatus(evalDataRaw.dailyCycle.plant1)}\`,
                \`Cycle_Plant 02 = \${evalDataRaw.dailyCycle.plant2.toFixed(3)} -> \${getStatus(evalDataRaw.dailyCycle.plant2)}\`
              ];
              if (hasPlant3) lines.push(\`Cycle_Plant 03 = \${evalDataRaw.dailyCycle.plant3.toFixed(3)} -> \${getStatus(evalDataRaw.dailyCycle.plant3)}\`);
              lines.push(\`Cycle_Average Daily Cycle = \${avgDaily.toFixed(3)} -> \${getStatus(avgDaily)}\`);
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);
            }

            if (i === 1) {
              const avgTotal = !isNaN(evalDataRaw.avgTotalCycle) ? evalDataRaw.avgTotalCycle : 0;
              const lines = [
                \`Plant Total Cycle (\${evalDataRaw.dataDate}):\`,
                \`Plant 01 Total Cycle = \${evalDataRaw.totalCycle.plant1.toFixed(6)}\`,
                \`Plant 02 Total Cycle = \${evalDataRaw.totalCycle.plant2.toFixed(6)}\`
              ];
              if (hasPlant3) lines.push(\`Plant 03 Total Cycle = \${evalDataRaw.totalCycle.plant3.toFixed(6)}\`);
              lines.push(\`Average Total Plant Cycle = \${avgTotal.toFixed(6)}\`);
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);

              if (evalDataRaw.deviations && evalDataRaw.deviations.highSOC) {
                const devLines = [
                  \`Max deviation timings:\`,
                  \`Max deviation (HIGH SOC): \${evalDataRaw.deviations.highSOC.pair} = \${evalDataRaw.deviations.highSOC.text}\`,
                  \`Max deviation (LOW SOC): \${evalDataRaw.deviations.lowSOC.pair} = \${evalDataRaw.deviations.lowSOC.text}\`
                ];
                drawInfoBox(devLines, (targetWidth / 2) - 150, yOffset + 60, bgWhite, 0, -1);
              }
            }`;

const goodBlock = `            if (i === 0) {
              const avgDaily = !isNaN(evalDataRaw.avgDailyCycle) ? evalDataRaw.avgDailyCycle : 0;
              const lines = [
                'Daily cycle (' + evalDataRaw.dataDate + '):',
                'Cycle_Plant 01 = ' + evalDataRaw.dailyCycle.plant1.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant1),
                'Cycle_Plant 02 = ' + evalDataRaw.dailyCycle.plant2.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant2)
              ];
              if (hasPlant3) lines.push('Cycle_Plant 03 = ' + evalDataRaw.dailyCycle.plant3.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant3));
              lines.push('Cycle_Average Daily Cycle = ' + avgDaily.toFixed(3) + ' -> ' + getStatus(avgDaily));
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);
            }

            if (i === 1) {
              const avgTotal = !isNaN(evalDataRaw.avgTotalCycle) ? evalDataRaw.avgTotalCycle : 0;
              const lines = [
                'Plant Total Cycle (' + evalDataRaw.dataDate + '):',
                'Plant 01 Total Cycle = ' + evalDataRaw.totalCycle.plant1.toFixed(6),
                'Plant 02 Total Cycle = ' + evalDataRaw.totalCycle.plant2.toFixed(6)
              ];
              if (hasPlant3) lines.push('Plant 03 Total Cycle = ' + evalDataRaw.totalCycle.plant3.toFixed(6));
              lines.push('Average Total Plant Cycle = ' + avgTotal.toFixed(6));
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);

              if (evalDataRaw.deviations && evalDataRaw.deviations.highSOC) {
                const devLines = [
                  'Max deviation timings:',
                  'Max deviation (HIGH SOC): ' + evalDataRaw.deviations.highSOC.pair + ' = ' + evalDataRaw.deviations.highSOC.text,
                  'Max deviation (LOW SOC): ' + evalDataRaw.deviations.lowSOC.pair + ' = ' + evalDataRaw.deviations.lowSOC.text
                ];
                drawInfoBox(devLines, (targetWidth / 2) - 150, yOffset + 60, bgWhite, 0, -1);
              }
            }`;

if (content.includes(badBlock)) {
    content = content.replace(badBlock, goodBlock);
} else {
    // try to split by \n and rebuild or use regex.
    content = content.replace(badBlock.replace(/\n/g, '\\r\\n'), goodBlock.replace(/\n/g, '\\r\\n'));
}

fs.writeFileSync(file, content);
console.log('Fixed backticks!');
