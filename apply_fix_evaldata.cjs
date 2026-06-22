const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

const startIdx = content.indexOf('  const renderPlot = () => {');
if (startIdx !== -1) {
    const endIdx = content.indexOf('return (', startIdx + 100);
    const before = content.substring(0, startIdx);
    let plotBlock = content.substring(startIdx);
    
    // In renderPlot, evalDataRaw should be evalData
    plotBlock = plotBlock.replace(/evalDataRaw\.soc\.plant3/g, 'evalData.soc.plant3');
    
    fs.writeFileSync(file, before + plotBlock);
    console.log('SUCCESS');
} else {
    console.log('FAILED to find renderPlot');
}
