const fs = require('fs');

function fixLegend(file) {
  let c = fs.readFileSync(file, 'utf8');
  c = c.replace(
    /name: 'Remote Active Power',\s*line: { color: '#731A66', width: 1.6 }/g,
    "name: 'Remote Active Power', showlegend: Boolean(evalData?.remoteP?.[pKey]?.some((v) => v != null && !isNaN(v))),\n            line: { color: '#731A66', width: 1.6 }"
  );
  c = c.replace(
    /name: 'P dispatch allocation',\s*line: { color: '#339933', width: 1.8, dash: 'dash' }/g,
    "name: 'P dispatch allocation', showlegend: Boolean(evalData?.dispatchP?.[pKey]?.some((v) => v != null && !isNaN(v))),\n            line: { color: '#339933', width: 1.8, dash: 'dash' }"
  );
  c = c.replace(
    /name: 'P dispatch allocation', line: { color: '#339933', width: 1.8, dash: 'dash' }/g,
    "name: 'P dispatch allocation', showlegend: Boolean(evalDataRaw?.dispatchP?.[pk]?.some((v) => v != null && !isNaN(v))), line: { color: '#339933', width: 1.8, dash: 'dash' }"
  );
  fs.writeFileSync(file, c);
}

function fixAverages(file) {
  let lines = fs.readFileSync(file, 'utf8').split('\n');

  // Replace matchingDay logic around line 681
  for (let i = 675; i < 690; i++) {
    if (lines[i] && lines[i].includes('parsedDaily.plant3 = matchingDay.SWG03_DailyReached !== null')) {
      lines.splice(i + 1, 0, 
        '              parsedAvgTotal = matchingDay.Average_Total_Plant_Cycle !== null && matchingDay.Average_Total_Plant_Cycle !== undefined ? matchingDay.Average_Total_Plant_Cycle : NaN;',
        '              parsedAvgDaily = matchingDay.Average_Daily_Cycle !== null && matchingDay.Average_Daily_Cycle !== undefined ? matchingDay.Average_Daily_Cycle : NaN;'
      );
      break;
    }
  }

  // Replace getDailyDiff fallback logic around line 712
  for (let i = 700; i < 730; i++) {
    if (lines[i] && lines[i].includes('parsedDaily.plant3 = getDailyDiff(p3Rows);')) {
      lines.splice(i + 1, 0,
        '              const allRows = project === "SNTL400" ? [...p1Rows, ...p2Rows] : [...p1Rows, ...p2Rows, ...p3Rows];',
        '              parsedAvgDaily = getDailyDiff(allRows);',
        '              const allBlocks = project === "SNTL400" ? [...p1Blocks, ...p2Blocks] : [...p1Blocks, ...p2Blocks, ...p3Blocks];',
        '              const validCycles = allBlocks.map(b => b.LastEquivalentNumberOfCycle).filter(v => v !== null && !isNaN(v));',
        '              parsedAvgTotal = validCycles.length > 0 ? validCycles.reduce((s, v) => s + v, 0) / validCycles.length : NaN;'
      );
      break;
    }
  }

  // Replace parsedData.avgTotalCycle and avgDailyCycle logic around line 736
  for (let i = 730; i < 750; i++) {
    if (lines[i] && lines[i].includes('parsedData.avgTotalCycle =')) {
      lines[i] = "      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148);";
    }
    if (lines[i] && lines[i].includes('parsedData.avgDailyCycle =')) {
      lines[i] = "      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148);";
    }
  }

  fs.writeFileSync(file, lines.join('\n'));
}

fixLegend('src/components/DailyEvaluationGraph.tsx');
fixLegend('src/lib/portable-view-template.ts');
fixAverages('src/components/DailyEvaluationGraph.tsx');
console.log("Done");
