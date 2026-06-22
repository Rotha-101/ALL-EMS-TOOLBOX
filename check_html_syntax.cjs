const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

// I will look for any typescript syntax like ' as ' or '!' or '?' inside the templates!
// Specifically, look at the traces.
// In DailyEvaluationGraph.tsx, I replaced `(v: any)` with `(v)`.
// But wait, the line:
// showlegend: Boolean((evalData?.cmdQ?.[pk] || evalData?.cmdQ?.[pk])?.some((v) => v != null && !isNaN(v)))
// Uses optional chaining `?.`!
// Optional chaining `?.` is perfectly valid in modern browsers! It shouldn't crash unless they are using an ancient browser. But the user is using Edge (Chromium based).

// Wait, is there any other TypeScript syntax?
// What about `pk as keyof typeof evalData.pTotal`?
const matchAs = content.match(/as keyof typeof/g);
if (matchAs) console.log("Found 'as keyof typeof':", matchAs.length);

const matchAny = content.match(/any/g);
console.log("Found 'any':", matchAny ? matchAny.length : 0);

// Let's just pull out the script content of handleExportHtml and use new Function() to check for SyntaxError!
const exportHtmlRegex = /const htmlContent = `([\s\S]*?)`;/g;
let match;
let count = 0;
while ((match = exportHtmlRegex.exec(content)) !== null) {
    count++;
    console.log("Found template", count);
    const html = match[1];
    
    // extract script blocks
    const scriptRegex = /<script>([\s\S]*?)<\/script>/g;
    let sMatch;
    let sCount = 0;
    while ((sMatch = scriptRegex.exec(html)) !== null) {
        sCount++;
        const scriptCode = sMatch[1];
        
        // mock the variables that are injected
        const testCode = `
            const dataJson = {};
            const configJson = {};
            const metricJson = 'fig5';
            const projectJson = 'SNTL400';
            const plantJson = 'plant1';
            const pinnedJson = [];
            
            ${scriptCode.replace(/\$\{dataJson\}/g, 'dataJson')
                        .replace(/\$\{configJson\}/g, 'configJson')
                        .replace(/\$\{metricJson\}/g, 'metricJson')
                        .replace(/\$\{projectJson\}/g, 'projectJson')
                        .replace(/\$\{plantJson\}/g, 'plantJson')
                        .replace(/\$\{pinnedJson\}/g, 'pinnedJson')}
        `;
        
        try {
            // this parses the code without executing it
            new Function(testCode);
            console.log("Script", sCount, "in template", count, "is VALID JavaScript.");
        } catch (e) {
            console.log("Script", sCount, "in template", count, "has SYNTAX ERROR:", e.message);
            // Let's print the specific line causing the error if possible
            const lines = testCode.split('\\n');
            // We can't easily get the line number from the syntax error directly in all node versions,
            // but we can try to find common TS syntax.
            const tsMatch = testCode.match(/[a-zA-Z]+\s*:\s*[a-zA-Z]+/g);
            if (tsMatch) console.log("Possible TS types found:", tsMatch.slice(0, 5));
        }
    }
}
