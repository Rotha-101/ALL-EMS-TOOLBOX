const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM, VirtualConsole } = jsdom;

const content = fs.readFileSync('src/components/DailyEvaluationGraph.tsx', 'utf8');
let s = content.indexOf('<script>', 2500);
let e = content.indexOf('</script>', s);
let scriptContent = content.substring(s + 8, e);

const mockData = {
  timestamps: [new Date().toISOString()],
  pTotal: { plant1: [1], plant2: [2], plant3: [3] },
  freq: { plant1: [50], plant2: [50], plant3: [50] },
  cmdP: { plant1: [1], plant2: [2], plant3: [3] },
  remoteP: { plant1: [1], plant2: [2], plant3: [3] },
  soc: { plant1: [50], plant2: [50], plant3: [50] },
  vab: { plant1: [1], plant2: [2], plant3: [3] },
  vbc: { plant1: [1], plant2: [2], plant3: [3] },
  vca: { plant1: [1], plant2: [2], plant3: [3] },
  qTotal: { plant1: [1], plant2: [2], plant3: [3] },
  cmdQ: { plant1: [1], plant2: [2], plant3: [3] },
  dataDate: '2026-06-02',
  dailyCycle: { plant1: 1, plant2: 2, plant3: 3 },
  totalCycle: { plant1: 1, plant2: 2, plant3: 3 },
  dispatchP: { plant1: [1], plant2: [2], plant3: [3] },
  remoteP_Plant1: [1],
  remoteP_Plant2: [2],
  remoteP_Plant3: [3],
  pDispatch_Plant1: [1],
  pDispatch_Plant2: [2],
  pDispatch_Plant3: [3],
};

scriptContent = scriptContent.replace(/\$\{dataJson\}/g, JSON.stringify(mockData));
scriptContent = scriptContent.replace(/\$\{configJson\}/g, JSON.stringify({
  bgWhite: false, showGrid: true, showMarkers: false, traceVisible: [], lineWidths: [], lineDash: []
}));
scriptContent = scriptContent.replace(/\$\{metricJson\}/g, '"fig5"');
scriptContent = scriptContent.replace(/\$\{projectJson\}/g, '"SNTL600"');
scriptContent = scriptContent.replace(/\$\{plantJson\}/g, '"all"');
scriptContent = scriptContent.replace(/\$\{pinnedJson\}/g, '[]');

const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (err) => {
  console.error("JSDOM SCRIPT ERROR:", err.message);
});
virtualConsole.on("error", (err) => {
  console.error("CONSOLE ERROR:", err);
});

const dom = new JSDOM(`<!DOCTYPE html><html><body>
  <div id="chart-area"></div>
  <div id="plot-main-title"></div>
  <div id="pin-counter-container"></div>
  <div id="lines-config-container"></div>
  <select id="select-active-metric"></select>
</body></html>`, { runScripts: "dangerously", virtualConsole });

dom.window.tailwind = { config: {} };
dom.window.Plotly = { newPlot: () => Promise.resolve() };

try {
  dom.window.eval(scriptContent);
  dom.window.dispatchEvent(new dom.window.Event('load'));
  console.log("SUCCESS. Chart Area innerHTML length:", dom.window.document.getElementById('chart-area').innerHTML.length);
} catch(err) {
  console.error("ERROR CAUGHT IN TRY/CATCH:", err);
}
