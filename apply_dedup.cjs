const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let removed = 0;
for (let i = 3800; i < 3900; i++) {
    if (lines[i] && lines[i].includes('let filterCache:')) {
        if (removed > 0) {
            lines[i] = '';
            lines[i+1] = '';
        }
        removed++;
    }
    if (lines[i] && lines[i].includes('let currentTimeHash =')) {
        if (removed > 2) { // just tracking
            // wait, we can just replace 'let currentTimeHash' with 'currentTimeHash' on duplicates
        }
    }
}

// better way: just replace let filterCache with empty if we already saw it
let seenFilterCache = false;
let seenCurrentHash = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('let filterCache: WeakMap')) {
        if (seenFilterCache) {
            lines[i] = '';
            lines[i+1] = ''; // lastTimeHash
        } else {
            seenFilterCache = true;
        }
    }
    if (lines[i].includes('let currentTimeHash = timeX.length')) {
        if (seenCurrentHash) {
            lines[i] = lines[i].replace('let currentTimeHash =', 'currentTimeHash =');
        } else {
            seenCurrentHash = true;
        }
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed redeclarations');
