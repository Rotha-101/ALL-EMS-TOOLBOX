const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `      if (typeof dataArr === 'object') {
         filterCache.current.set(dataArr, result);
      }
      return result;
    };

    // Helper: apply graphConfig to a trace object`;

const replacement = `      if (typeof dataArr === 'object') {
         filterCache.current.set(dataArr, result);
      }
      return result;
    };

    const filteredTimeX  = applyTimeRange(timeX);
    const filterArr      = (arr: any[]) => applyTimeRange(arr);

    // Helper: apply graphConfig to a trace object`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content);
console.log('SUCCESS');
