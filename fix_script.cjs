const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'apply_html_copy_fix.cjs');
let content = fs.readFileSync(file, 'utf8');

// The file currently has:
//     }
// 
//     `;
// 
// content = content.replace(targetRegex, replacement);

content = content.replace("    }\n\n    `;\n\ncontent = content.replace", "    }\n\n`;\n\ncontent = content.replace");

fs.writeFileSync(file, content);
console.log('Fixed script!');
