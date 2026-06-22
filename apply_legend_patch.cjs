const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

// Replace line 2313
const target1 = "applyTrace({ y: evalDataRaw.dispatchP[pk], type: 'scatter', mode: 'lines', name: 'P dispatch allocation', line: { color: '#339933', width: 1.8, dash: 'dash' } }, 3),";
const replace1 = "applyTrace({ y: evalDataRaw.dispatchP[pk], type: 'scatter', mode: 'lines', name: 'P dispatch allocation', showlegend: Boolean(evalDataRaw.dispatchP[pk]?.some((v: any) => v != null && !isNaN(v))), line: { color: '#339933', width: 1.8, dash: 'dash' } }, 3),";

// Replace line 3658
// Same exact target string, so a global replace is fine, but we'll do it specifically.
content = content.split(target1).join(replace1);

// Replace line 4360-4367 block
const target2 = `          {
            x: timeX,
            y: evalData.dispatchP[pKey],
            type: 'scatter',
            mode: 'lines',
            name: 'P dispatch allocation',
            line: { color: '#339933', width: 1.8, dash: 'dash' }
          },`;
const replace2 = `          {
            x: timeX,
            y: evalData.dispatchP[pKey],
            type: 'scatter',
            mode: 'lines',
            name: 'P dispatch allocation',
            showlegend: Boolean(evalData.dispatchP[pKey]?.some((v: any) => v != null && !isNaN(v))),
            line: { color: '#339933', width: 1.8, dash: 'dash' }
          },`;

if (content.includes(target2)) {
    content = content.replace(target2, replace2);
} else {
    content = content.replace(target2.replace(/\n/g, '\r\n'), replace2.replace(/\n/g, '\r\n'));
}

fs.writeFileSync(file, content);
console.log('Patched legend successfully!');
