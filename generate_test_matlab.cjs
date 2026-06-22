const fs = require('fs');
let c = fs.readFileSync('Mat code/Cycle_Calculation_Ver3.m', 'utf8');
c = c.replace(/parentFolder = '[^']+';/, "parentFolder = 'C:\\\\Users\\\\USER\\\\Desktop\\\\0. CHEA Rotha\\\\ESS_Project_V0.1-main - Copy\\\\Test\\\\Data\\\\SNTL 600';");
c = c.replace('close all;', '');
fs.writeFileSync('test_matlab.m', c);
