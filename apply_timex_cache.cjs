const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original map logic:
const target = `    const timeX = evalData.timestamps.map((t: Date) => {
      const hh = String(t.getHours()).padStart(2, '0');
      const mm = String(t.getMinutes()).padStart(2, '0');
      const ss = String(t.getSeconds()).padStart(2, '0');
      return \`\${hh}:\${mm}:\${ss}\`;
    });`;

const replacement = `    // Cache timeX string conversion
    let timeX = [];
    if (filterCache.current.has(evalData.timestamps)) {
        timeX = filterCache.current.get(evalData.timestamps);
    } else {
        timeX = evalData.timestamps.map((t: Date) => {
          const d = new Date(t);
          const hh = String(d.getHours()).padStart(2, '0');
          const mm = String(d.getMinutes()).padStart(2, '0');
          const ss = String(d.getSeconds()).padStart(2, '0');
          return \`\${hh}:\${mm}:\${ss}\`;
        });
        filterCache.current.set(evalData.timestamps, timeX);
    }`;

// Replace inside renderPlot (not the HTML export strings)
let startIdx = content.indexOf(`  const renderPlot = () => {`);
if (startIdx !== -1) {
    let targetIdx = content.indexOf(`    const timeX = evalData.timestamps.map((t: Date) => {`, startIdx);
    if (targetIdx !== -1) {
        let endIdx = content.indexOf(`    });`, targetIdx) + 7;
        let oldStr = content.substring(targetIdx, endIdx);
        content = content.replace(oldStr, replacement);
    } else {
        console.error("COULD NOT FIND target string after renderPlot");
    }
} else {
    console.error("COULD NOT FIND renderPlot");
}

fs.writeFileSync(file, content);
console.log("SUCCESS timeX cached!");
