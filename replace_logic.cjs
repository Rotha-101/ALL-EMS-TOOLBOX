const fs = require('fs');
const file = 'src/components/DailyEvaluationGraph.tsx';
let content = fs.readFileSync(file, 'utf8');

const t1 = `      const chartArea = document.getElementById('chart-area');\r
      chartArea.innerHTML = '';`;
const r1 = `      const chartArea = document.getElementById('chart-area');
      window.existingPlots = window.existingPlots || {};
      chartArea.querySelectorAll('.js-plotly-plot').forEach(plot => {
        if (plot.id) window.existingPlots[plot.id] = plot;
      });
      window.reusedPlotIds = new Set();
      chartArea.innerHTML = '';`;
content = content.replace(new RegExp(t1.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\r\\n|\\n/g, '\\r?\\n'), 'g'), r1);

const t2 = `      const createPlotWithEvents = (div, traces, layout, graphId) => {\r
        Plotly.newPlot(div, traces, layout, plotCfgZoom).then(gd => {\r
          gd.on('plotly_hover', function(data) {`;
const r2 = `      const createPlotWithEvents = (div, traces, layout, graphId) => {
        const isReused = window.existingPlots && window.existingPlots[graphId];
        let targetDiv = div;
        if (isReused) {
           targetDiv = window.existingPlots[graphId];
           if (div.parentNode) {
             div.parentNode.replaceChild(targetDiv, div);
           }
           window.reusedPlotIds.add(graphId);
        } else {
           targetDiv.id = graphId;
        }

        const plotPromise = isReused ? Plotly.react(targetDiv, traces, layout, plotCfgZoom) : Plotly.newPlot(targetDiv, traces, layout, plotCfgZoom);
        
        plotPromise.then(gd => {
          if (isReused) return;
          
          gd.on('plotly_hover', function(data) {`;
content = content.replace(new RegExp(t2.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&').replace(/\\r\\n|\\n/g, '\\r?\\n'), 'g'), r2);

const t3 = `            applyTrace({ y: evalDataRaw.cmdQ[pk], type: 'scatter', mode: 'lines', name: 'Q command from NCC', showlegend: Boolean((evalData?.cmdQ?.[pk] || evalData?.cmdQ?.[pk])?.some((v) => v != null && !isNaN(v))), yaxis: 'y2', line: { color: '#000000', width: 1.8 } }, 4)`;
const r3 = `            applyTrace({ y: evalDataRaw.cmdQ[pk], type: 'scatter', mode: 'lines', name: 'Q command from NCC', showlegend: Boolean((evalDataRaw?.cmdQ?.[pk] || evalDataRaw?.cmdQ?.[pk])?.some((v) => v != null && !isNaN(v))), yaxis: 'y2', line: { color: '#000000', width: 1.8 } }, 4)`;
content = content.replace(new RegExp(t3.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), r3);

const t4 = `        });\r
      }\r
    }`;
const r4 = `        });
      }
      setTimeout(() => {
        if (window.existingPlots) {
          Object.keys(window.existingPlots).forEach(id => {
            if (!window.reusedPlotIds.has(id)) {
              Plotly.purge(window.existingPlots[id]);
            }
          });
        }
        window.existingPlots = {};
      }, 50);
    }`;
// careful, this might match too much. Let's do a more precise replacement for t4
let lastIdx1 = content.indexOf(`          layout.annotations = [...layout.annotations, ...annotations];`);
let lastIdx2 = content.indexOf(`          layout.annotations = [...layout.annotations, ...annotations];`, lastIdx1 + 1);

let end1 = content.indexOf(`    }`, lastIdx1);
let end2 = content.indexOf(`    }`, lastIdx2);

content = content.substring(0, end1) + r4.substring(13) + content.substring(end1 + 5);

// Need to recalculate end2 because content length changed
lastIdx2 = content.indexOf(`          layout.annotations = [...layout.annotations, ...annotations];`, lastIdx1 + 1);
end2 = content.indexOf(`    }`, lastIdx2);
content = content.substring(0, end2) + r4.substring(13) + content.substring(end2 + 5);

fs.writeFileSync(file, content);
console.log('done');
