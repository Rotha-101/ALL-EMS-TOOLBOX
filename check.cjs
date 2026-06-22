const fs = require('fs');
const content = fs.readFileSync('src/components/DailyEvaluationGraph.tsx', 'utf8');

let s = content.indexOf('<script>', 2500);
let e = content.indexOf('</script>', s);
let scriptContent = content.substring(s + 8, e);

scriptContent = scriptContent.replace(/\$\{dataJson\}/g, '{}');
scriptContent = scriptContent.replace(/\$\{configJson\}/g, '{}');
scriptContent = scriptContent.replace(/\$\{projectJson\}/g, '"SNTL600"');

fs.writeFileSync('test-script-all.js', scriptContent);
console.log('test-script-all.js created.');
