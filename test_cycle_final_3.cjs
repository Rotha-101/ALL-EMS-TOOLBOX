const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function parseCycleExcelFile(filePath) {
  const buf = fs.readFileSync(filePath);
  const wb = xlsx.read(buf, { type: 'buffer', cellDates: true, raw: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws || !ws['!ref']) return null;
  const aoa = xlsx.utils.sheet_to_json(ws, { header: 1, raw: true, defval: null });
  if (aoa.length < 1) return null;

  let headerRowIndex = 3;
  let headerRow = aoa[3] || [];
  let headers = headerRow.map(h => h == null ? '' : String(h).trim());
  let lowerVars = headers.map(h => h.toLowerCase());

  let plantIdx = lowerVars.findIndex(h => h.includes('plant') && h.includes('name'));
  let deviceIdx = lowerVars.findIndex(h => h.includes('device') && h.includes('name'));
  let startIdx = lowerVars.findIndex(h => h.includes('start') && h.includes('time'));
  let eqIdx = headers.findIndex(h => h === 'Equivalent number of cycles');
  if (eqIdx === -1) {
    eqIdx = lowerVars.findIndex(h => h.includes('equivalent') && h.includes('cycle'));
  }

  if (plantIdx === -1 || deviceIdx === -1 || startIdx === -1 || eqIdx === -1) {
    headerRowIndex = 0;
    headerRow = aoa[0] || [];
    headers = headerRow.map(h => h == null ? '' : String(h).trim());
    lowerVars = headers.map(h => h.toLowerCase());
    plantIdx = lowerVars.findIndex(h => h.includes('plant') && h.includes('name'));
    deviceIdx = lowerVars.findIndex(h => h.includes('device') && h.includes('name'));
    startIdx = lowerVars.findIndex(h => h.includes('start') && h.includes('time'));
    eqIdx = headers.findIndex(h => h === 'Equivalent number of cycles');
    if (eqIdx === -1) {
      eqIdx = lowerVars.findIndex(h => h.includes('equivalent') && h.includes('cycle'));
    }
  }

  if (plantIdx === -1 || deviceIdx === -1 || startIdx === -1 || eqIdx === -1) {
    return null;
  }

  const dataRows = aoa.slice(4);
  const parsedRows = [];

  for (const r of dataRows) {
    if (!r || r.length === 0) continue;
    const pName = r[plantIdx] != null ? String(r[plantIdx]) : '';
    const dName = r[deviceIdx] != null ? String(r[deviceIdx]) : '';
    const sTimeRaw = r[startIdx];
    const eqCycleRaw = r[eqIdx];

    if (!dName || eqCycleRaw == null) continue;

    const eqCycle = parseFloat(String(eqCycleRaw));
    if (isNaN(eqCycle)) continue;

    let sacuNum = NaN;
    let essNum = NaN;

    const tokSACU = dName.match(/(SACU|STS)-?(\d+)/i);
    const tokB = dName.match(/B(\d+)/i);
    if (tokSACU) {
      sacuNum = parseInt(tokSACU[2], 10);
    } else if (tokB) {
      sacuNum = parseInt(tokB[1], 10);
    }

    const tokESS = dName.match(/ESS[-_ ]?0?(\d+)/i);
    if (tokESS) {
      essNum = parseInt(tokESS[1], 10);
    }

    parsedRows.push({
      PlantName: pName,
      DeviceName: dName,
      SACU_Number: sacuNum,
      ESS_Number: essNum,
      StartTime: sTimeRaw,
      EquivalentNumberOfCycles: eqCycle
    });
  }

  return parsedRows;
}

function processFolder(folderPath) {
  const files = [];
  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const full = path.join(dir, item);
      if (fs.statSync(full).isDirectory()) walk(full);
      else if (full.match(/\.xlsx?$/i) && !item.startsWith('~$')) files.push(full);
    }
  }
  walk(folderPath);
  
  let allRows = [];
  for (const f of files) {
    if (f.toLowerCase().includes('ess')) {
      const rows = parseCycleExcelFile(f);
      if (rows) allRows.push(...rows);
    }
  }
  return allRows;
}

const dataFolder = 'C:\\Users\\USER\\Desktop\\0. CHEA Rotha\\ESS_Project_V0.1-main - Copy\\Test\\Data\\SNTL 600\\June 02, 2026';
const allRows = processFolder(dataFolder);

function buildPlantCycleTableJs(rows, plantLabel, sacus) {
  const sorted = rows.filter(r => sacus.includes(r.SACU_Number)).sort((a,b) => {
    if (a.SACU_Number !== b.SACU_Number) return a.SACU_Number - b.SACU_Number;
    if (a.ESS_Number !== b.ESS_Number) return a.ESS_Number - b.ESS_Number;
    return new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime();
  });
  const uniqueSACUs = Array.from(new Set(sorted.map(r => r.SACU_Number).filter(n => !isNaN(n)))).sort((a,b)=>a-b);
  const outTbl = [];
  for (const sacuNum of uniqueSACUs) {
    const currentData = sorted.filter(r => r.SACU_Number === sacuNum);
    const existingESS = Array.from(new Set(currentData.map(r => r.ESS_Number).filter(n => !isNaN(n)))).sort((a,b)=>a-b);
    let essListToUse = [1,2,3,4];
    if (sacuNum === 37 && existingESS.length === 3) essListToUse = existingESS;
    const lastCycles = [];
    for (const essNum of essListToUse) {
      const essData = currentData.filter(r => r.ESS_Number === essNum);
      let lastCycle = NaN;
      if (essData.length > 0) {
        essData.sort((a,b) => new Date(a.StartTime).getTime() - new Date(b.StartTime).getTime());
        lastCycle = essData[essData.length - 1].EquivalentNumberOfCycles;
      }
      lastCycles.push(lastCycle);
    }
    const valid = lastCycles.filter(c => !isNaN(c));
    const avgBlock = valid.length > 0 ? valid.reduce((s,v)=>s+v,0)/valid.length : NaN;
    outTbl.push({sacuNum, lastCycles, avgBlock});
  }
  const validBlocks = outTbl.map(b => b.avgBlock).filter(v => !isNaN(v));
  const truePlantAvg = validBlocks.length > 0 ? validBlocks.reduce((s,c)=>s+c,0)/validBlocks.length : NaN;
  return { truePlantAvg, outTbl };
}
const SPPC1_SACU = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17];
const SPPC2_SACU = [15, 18, 21, 24, 27, 30, 31, 32, 33, 34];
console.log('SPPC1:', buildPlantCycleTableJs(allRows, 'P1', SPPC1_SACU).truePlantAvg);
console.log('SPPC2:', buildPlantCycleTableJs(allRows, 'P2', SPPC2_SACU).truePlantAvg);

const SPPC3_SACU = [19, 20, 22, 23, 25, 26, 28, 29, 35, 36, 37]; console.log('SPPC3:', buildPlantCycleTableJs(allRows, 'P3', SPPC3_SACU).truePlantAvg);