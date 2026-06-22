const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

function replaceStr(target, replacement) {
  const index = content.indexOf(target);
  if (index === -1) {
    console.error("COULD NOT FIND TARGET:\\n" + target.substring(0, 100));
    process.exit(1);
  }
  content = content.substring(0, index) + replacement + content.substring(index + target.length);
}

// Target string in renderPlot:
const target1 = `  const renderPlot = () => {
    // Large, beautiful glassmorphic Empty State Dropzone when no data is loaded`;

const replacement1 = `  const filterCache = useRef(new WeakMap());
  const lastTimeHash = useRef('');

  const renderPlot = () => {
    // Large, beautiful glassmorphic Empty State Dropzone when no data is loaded`;

replaceStr(target1, replacement1);


// Now update the applyTimeRange in renderPlot
const target2 = `    const applyTimeRange = (dataArr: any[]) => {
      if (!graphConfig.timeFrom && !graphConfig.timeTo && (!graphConfig.dataResolution || graphConfig.dataResolution <= 1)) return dataArr;
      const toSeconds = (t: string) => {
        const [h, m, s] = t.split(':').map(Number);
        return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
      };
      const fromSec = toSeconds(graphConfig.timeFrom || '00:00:00');
      const toSec   = toSeconds(graphConfig.timeTo   || '23:59:59');
      let sliced = dataArr.slice(fromSec, toSec + 1);
      const step = graphConfig.dataResolution || 1;
      if (step > 1) {
        return sliced.filter((_, i) => i % step === 0);
      }
      return sliced;
    };`;

const replacement2 = `    const currentTimeHash = \`\${graphConfig.timeFrom}_\${graphConfig.timeTo}_\${graphConfig.dataResolution}\`;
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
    };`;

replaceStr(target2, replacement2);

fs.writeFileSync(file, content);
console.log('SUCCESS! renderPlot cached');
