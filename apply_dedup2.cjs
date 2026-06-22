const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

let seenFilterCache = false;
let seenCurrentHash = false;

for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('const filterCache = useRef(new WeakMap());')) {
        if (seenFilterCache) {
            lines[i] = '';
            lines[i+1] = ''; // lastTimeHash
        } else {
            seenFilterCache = true;
        }
    }
    if (lines[i].includes('const currentTimeHash =')) {
        if (seenCurrentHash) {
            for (let j = i; j < i + 5; j++) {
                if (lines[j].includes('}')) {
                    lines[j] = '';
                    break;
                }
                lines[j] = '';
            }
        } else {
            seenCurrentHash = true;
        }
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed redeclarations correctly');
