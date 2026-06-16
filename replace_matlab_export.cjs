const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/lib/exportMatlab.ts';
let content = fs.readFileSync(file, 'utf8');

// The original line is:
// const prefix = `${i + 1}. ${dateStr}_${projLabel}_`;
// We will change it to:
// const prefix = `${dateStr}_${projLabel}_`;

content = content.replace("const prefix = `${i + 1}. ${dateStr}_${projLabel}_`;", "const prefix = `${dateStr}_${projLabel}_`;");

// The original safeName is:
// const safeName = s.name.replace(/\s+/g, '_').replace(/SWG/g, 'SPPC-');
// We will change it to use underscore instead of hyphen for better MATLAB compatibility
content = content.replace("const safeName = s.name.replace(/\\s+/g, '_').replace(/SWG/g, 'SPPC-');", "const safeName = s.name.replace(/\\s+/g, '_').replace(/SWG/g, 'SPPC_').replace(/-/g, '_');");

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
