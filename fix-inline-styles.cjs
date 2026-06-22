const fs = require('fs');

let content = fs.readFileSync('src/components/DailyEvaluationGraph.tsx', 'utf8');

// Replace div.className = 'h-[280px] w-full mb-4 relative';
content = content.replace(/(div\d*)\.className\s*=\s*'h-\[280px\] w-full (mb-2|mb-4) relative';/g, (match, p1) => {
  return `${match}\n          ${p1}.style.height = '280px';\n          ${p1}.style.width = '100%';\n          ${p1}.style.position = 'relative';`;
});

// Write back
fs.writeFileSync('src/components/DailyEvaluationGraph.tsx', content);
console.log('Done!');
