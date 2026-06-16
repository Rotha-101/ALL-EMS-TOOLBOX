const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /<Button\s+onClick=\{handleDownloadExcelLogs\}[\s\S]*?Export Realtime Dispatch Excel\s*<\/Button>/;

if (content.match(regex)) {
    content = content.replace(regex, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log("Button removed successfully");
} else {
    console.log("Button not found");
}
