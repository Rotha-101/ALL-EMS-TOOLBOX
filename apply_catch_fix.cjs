const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

for (let i = 718; i < 735; i++) {
    if (lines[i] && lines[i].includes('parsedAvgTotal = ((parsedTotals.plant1 * 64) + (parsedTotals.plant2 * 40) + (parsedTotals.plant3 * 44)) / 148;')) {
        lines[i+1] = '              }';
        lines[i+2] = '            }';
        lines[i+3] = '          }';
        lines[i+4] = '        } catch (e) {';
        lines[i+5] = '          console.error("Error parsing ESS daily cycles:", e);';
        lines[i+6] = '        }';
        break;
    }
}

fs.writeFileSync(file, lines.join('\n'), 'utf8');
console.log('Fixed missing catch block');
