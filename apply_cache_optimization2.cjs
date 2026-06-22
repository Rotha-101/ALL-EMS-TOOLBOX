const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Insert refs before renderPlot
const target1 = `  const renderPlot = () => {`;
const replacement1 = `  const filterCache = useRef(new WeakMap());
  const lastTimeHash = useRef('');

  const renderPlot = () => {`;
content = content.replace(target1, replacement1);

// 2. Replace applyTimeRange
const target2Start = `    const applyTimeRange = (dataArr: any[]) => {`;
const target2End = `    // Helper: apply graphConfig to a trace object`;
const startIdx = content.indexOf(target2Start);
const endIdx = content.indexOf(target2End);
if (startIdx === -1 || endIdx === -1) {
    console.error("Could not find applyTimeRange");
    process.exit(1);
}

const oldBlock = content.substring(startIdx, endIdx);

const newBlock = `    const currentTimeHash = \`\${graphConfig.timeFrom}_\${graphConfig.timeTo}_\${graphConfig.dataResolution}\`;
    if (lastTimeHash.current !== currentTimeHash) {
       filterCache.current = new WeakMap();
       lastTimeHash.current = currentTimeHash;
    }

    const applyTimeRange = (dataArr: any[]) => {
      if (!dataArr) return [];
      if (!graphConfig.timeFrom && !graphConfig.timeTo && (!graphConfig.dataResolution || graphConfig.dataResolution <= 1)) return dataArr;
      
      if (typeof dataArr === 'object' && filterCache.current.has(dataArr)) {
         return filterCache.current.get(dataArr);
      }

      const toSeconds = (t: string) => {
        const [h, m, s] = t.split(':').map(Number);
        return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
      };
      const fromSec = toSeconds(graphConfig.timeFrom || '00:00:00');
      const toSec   = toSeconds(graphConfig.timeTo   || '23:59:59');
      let sliced = dataArr.slice(fromSec, toSec + 1);
      const step = graphConfig.dataResolution || 1;
      let result = sliced;
      if (step > 1) {
        result = sliced.filter((_, i) => i % step === 0);
      }
      
      if (typeof dataArr === 'object') {
         filterCache.current.set(dataArr, result);
      }
      return result;
    };

`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(file, content);
console.log("SUCCESS!");
