const xlsx = require('xlsx');
const wb = xlsx.readFile('C:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/Test/Data/SNTL 400/SPPC_Extracted_EquivalentCycles_AllDays_2026-06-03.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];

// Start reading from row 4 (index 3)
const data = xlsx.utils.sheet_to_json(sheet, { header: ['PlantName', 'BlockName', 'ESS_Number', 'LastEquivalentNumberOfCycle', 'AverageCycleOfBlock', 'AverageCycleOfSPPC'], range: 3 });

const p1 = data.filter(r => String(r.PlantName).includes('SPPC1'));
const p2 = data.filter(r => String(r.PlantName).includes('SPPC2'));

console.log('P1 Count:', p1.length, 'P2 Count:', p2.length);

const p1Valid = p1.filter(r => r.LastEquivalentNumberOfCycle !== null && !isNaN(r.LastEquivalentNumberOfCycle) && typeof r.LastEquivalentNumberOfCycle === 'number');
const p2Valid = p2.filter(r => r.LastEquivalentNumberOfCycle !== null && !isNaN(r.LastEquivalentNumberOfCycle) && typeof r.LastEquivalentNumberOfCycle === 'number');

console.log('P1 Valid Count:', p1Valid.length, 'P2 Valid Count:', p2Valid.length);

const p1Avg = p1Valid.reduce((s, r) => s + r.LastEquivalentNumberOfCycle, 0) / p1Valid.length;
const p2Avg = p2Valid.reduce((s, r) => s + r.LastEquivalentNumberOfCycle, 0) / p2Valid.length;

const allValid = [...p1Valid, ...p2Valid];
const totalAvg = allValid.reduce((s, r) => s + r.LastEquivalentNumberOfCycle, 0) / allValid.length;

console.log('P1 Avg:', p1Avg);
console.log('P2 Avg:', p2Avg);
console.log('Total Avg (Flattened/True):', totalAvg);
console.log('Total Avg (Weighted 64/40):', ((p1Avg*64) + (p2Avg*40)) / 104);
console.log('Total Avg (Weighted P1Count/P2Count):', ((p1Avg*p1.length) + (p2Avg*p2.length)) / (p1.length + p2.length));
