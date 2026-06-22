const fs = require('fs');
const path = require('path');

const cyclePath = path.join(__dirname, 'src/components/CycleCalculation.tsx');
let cycleCode = fs.readFileSync(cyclePath, 'utf8');

// 1. Add isBessProject at the top of the component
if (!cycleCode.includes('const isBessProject = typeof project')) {
  cycleCode = cycleCode.replace(
    /export function CycleCalculation\(\{.*?\}\s*\{/s,
    `$&
  const isBessProject = typeof project === 'string' && (project.startsWith('SNTB') || project.startsWith('SNTV') || project.startsWith('SNTD') || project.startsWith('SNTZ') || project.startsWith('MSGP'));`
  );
}

// 2. Hide Plant 2 Card
cycleCode = cycleCode.replace(
  /\{\/\* Plant 2 Card \*\/\}\s*<div/g,
  `{/* Plant 2 Card (Hidden for BESS) */}
              {!isBessProject && <div`
);

// We need to close the Plant 2 Card div. The div has </div> at the end of the block.
// Wait, it's safer to just replace `project !== 'SNTL400'` with `!isBessProject && project !== 'SNTL400'` for Plant 3.
cycleCode = cycleCode.replace(/project !== 'SNTL400'/g, `!isBessProject && project !== 'SNTL400'`);

// What about plant 2 tab?
cycleCode = cycleCode.replace(
  /<button\s+onClick=\{\(\) => setActivePlantTab\('p2'\)\}.*?SWG02 \(Plant 02\)\s*<\/button>/s,
  `{!isBessProject && ($&)}`
);

// What about Plant 2 summary card?
cycleCode = cycleCode.replace(
  /\{renderCycleSummaryCard\(\{\s*title: 'SPPC 2',/g,
  `{!isBessProject && renderCycleSummaryCard({
                title: 'SPPC 2',`
);
cycleCode = cycleCode.replace(
  /todayCycle: selectedDay\.SWG02_DailyReached,\s*\}\)\}/g,
  `todayCycle: selectedDay.SWG02_DailyReached,
              })}`
);


// Chart data for Plant 2
cycleCode = cycleCode.replace(
  /\{\s*x: chartDataDates,\s*y: chartP2Total,/s,
  `...(isBessProject ? [] : [{
                        x: chartDataDates,
                        y: chartP2Total,`
);
// it ends with marker: { size: 6 } }
cycleCode = cycleCode.replace(
  /name: 'Plant 2 Total',\s*line: \{ color: '#22C55E', width: 2, shape: 'spline' as const \},\s*marker: \{ size: 6 \}\s*\}/s,
  `name: 'Plant 2 Total',
                        line: { color: '#22C55E', width: 2, shape: 'spline' as const },
                        marker: { size: 6 }
                      }])`
);

// Bar Chart Yesterday/Today
// yDataYest = project === 'SNTL400' ? [yestP1, yestP2] : [yestP1, yestP2, yestP3];
// We replace these logic:
cycleCode = cycleCode.replace(
  /const yDataYest = .*?;/s,
  `const yDataYest = isBessProject ? [yestP1] : project === 'SNTL400' ? [yestP1, yestP2] : [yestP1, yestP2, yestP3];`
);
cycleCode = cycleCode.replace(
  /const yDataToday = .*?;/s,
  `const yDataToday = isBessProject ? [todayP1] : project === 'SNTL400' ? [todayP1, todayP2] : [todayP1, todayP2, todayP3];`
);

cycleCode = cycleCode.replace(
  /x: project === 'SNTL400' \? \['SPPC 1', 'SPPC 2'\] : \['SPPC 1', 'SPPC 2', 'SPPC 3'\]/g,
  `x: isBessProject ? ['SPPC 1'] : project === 'SNTL400' ? ['SPPC 1', 'SPPC 2'] : ['SPPC 1', 'SPPC 2', 'SPPC 3']`
);

fs.writeFileSync(cyclePath, cycleCode);
console.log('CycleCalculation updated');

// Now DailyEvaluationGraph
const dailyPath = path.join(__dirname, 'src/components/DailyEvaluationGraph.tsx');
let dailyCode = fs.readFileSync(dailyPath, 'utf8');

if (!dailyCode.includes('const isBessProject = typeof project')) {
  dailyCode = dailyCode.replace(
    /export function DailyEvaluationGraph\(\{.*?\}\s*\{/s,
    `$&
  const isBessProject = typeof project === 'string' && (project.startsWith('SNTB') || project.startsWith('SNTV') || project.startsWith('SNTD') || project.startsWith('SNTZ') || project.startsWith('MSGP'));`
  );
}

// Replace hasPlant3 logic globally
dailyCode = dailyCode.replace(
  /const hasPlant3 = project !== 'SNTL400'/g,
  `const hasPlant3 = !isBessProject && project !== 'SNTL400'`
);
dailyCode = dailyCode.replace(
  /const hasPlant3 = typeof project !== 'undefined' && project !== 'SNTL400'/g,
  `const hasPlant3 = !isBessProject && typeof project !== 'undefined' && project !== 'SNTL400'`
);

// We need hasPlant2
dailyCode = dailyCode.replace(
  /const plants = \['plant1', 'plant2'\];/g,
  `const plants = isBessProject ? ['plant1'] : ['plant1', 'plant2'];`
);
dailyCode = dailyCode.replace(
  /const plants: \('plant1' \| 'plant2' \| 'plant3'\)\[\] = \['plant1', 'plant2', 'plant3'\];/g,
  `const plants: ('plant1' | 'plant2' | 'plant3')[] = isBessProject ? ['plant1'] : ['plant1', 'plant2', 'plant3'];`
);

// Hide drawPanel calls for plant2
dailyCode = dailyCode.replace(/\{drawPanel1\('plant2',/g, '{!isBessProject && drawPanel1(\'plant2\',');
dailyCode = dailyCode.replace(/\{drawPanel2\('plant2',/g, '{!isBessProject && drawPanel2(\'plant2\',');
dailyCode = dailyCode.replace(/\{drawPanel3\('plant2',/g, '{!isBessProject && drawPanel3(\'plant2\',');
dailyCode = dailyCode.replace(/\{drawPanel4\('plant2',/g, '{!isBessProject && drawPanel4(\'plant2\',');
dailyCode = dailyCode.replace(/\{drawPanel\('plant2',/g, '{!isBessProject && drawPanel(\'plant2\',');
dailyCode = dailyCode.replace(/\{drawPanel6\('plant2',/g, '{!isBessProject && drawPanel6(\'plant2\',');

// Hide Cycle text for Plant 2
dailyCode = dailyCode.replace(/<div>Cycle_Plant 02 = /g, '{!isBessProject && (<div>Cycle_Plant 02 = ');
dailyCode = dailyCode.replace(/<div>Plant 02 Total Cycle = /g, '{!isBessProject && (<div>Plant 02 Total Cycle = ');
// The divs are closed by </div>, so we need to add )}
dailyCode = dailyCode.replace(/>Alert' : 'Normal'\)}<\/div>/g, `>Alert' : 'Normal')}</div>)}`);
// For the total cycle
dailyCode = dailyCode.replace(/\{evalData\.totalCycle\.plant2\.toFixed\(6\)\}<\/div>/g, `{evalData.totalCycle.plant2.toFixed(6)}</div>)}`);

fs.writeFileSync(dailyPath, dailyCode);
console.log('DailyEvaluationGraph updated');
