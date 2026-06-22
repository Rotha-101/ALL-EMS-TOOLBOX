const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

// I need to find the FIRST function resetAllConfig() and insert copyGraphsToClipboard() right before it.
// The first function resetAllConfig() is inside handleExportHtml.

const searchString = `    function resetAllConfig() {
      graphConfig = {
        showGrid: true,`;

const functionToAdd = `
    async function copyGraphsToClipboard() {
      const btn = document.getElementById('btn-copy-clipboard');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'COPYING...';
      btn.disabled = true;
      try {
        const plotDivs = document.querySelectorAll('.js-plotly-plot');
        if (plotDivs.length === 0) throw new Error('No graphs found');

        const targetWidth = 1920;
        let totalHeight = 0;
        const imageUrls = [];
        const subplotHeights = [];

        for (let i = 0; i < plotDivs.length; i++) {
          const div = plotDivs[i];
          const ratio = targetWidth / div.clientWidth;
          const url = await Plotly.toImage(div, { format: 'png', width: targetWidth, height: div.clientHeight * ratio });
          imageUrls.push(url);
          subplotHeights.push(div.clientHeight * ratio);
          totalHeight += subplotHeights[i];
        }

        const titleText = document.getElementById('plot-main-title').innerText || 'Exported Graphs';
        const titleHeight = 60;
        totalHeight += titleHeight;

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = totalHeight;
        const ctx = canvas.getContext('2d');

        const bgWhite = graphConfig.bgWhite;
        ctx.fillStyle = bgWhite ? '#FFFFFF' : '#0B0F19';
        ctx.fillRect(0, 0, targetWidth, totalHeight);

        ctx.fillStyle = bgWhite ? '#000000' : '#FFFFFF';
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(titleText, targetWidth / 2, titleHeight / 2);

        let yOffset = titleHeight;
        for (let i = 0; i < imageUrls.length; i++) {
          const img = new Image();
          img.src = imageUrls[i];
          await new Promise(r => { img.onload = r; });
          ctx.drawImage(img, 0, yOffset, targetWidth, subplotHeights[i]);

          if (activeMetric === 'fig5' && evalDataRaw && evalDataRaw.dailyCycle && evalDataRaw.totalCycle) {
            const drawInfoBox = (lines, x, y, bgWhite, headerIdx, footerIdx) => {
              const padding = 12;
              const lineHeight = 22;
              ctx.font = '15px "JetBrains Mono", monospace';
              let maxWidth = 0;
              lines.forEach((line, idx) => {
                ctx.font = idx === headerIdx ? 'bold 16px "JetBrains Mono", monospace' : (idx === footerIdx ? 'bold 15px "JetBrains Mono", monospace' : '15px "JetBrains Mono", monospace');
                const w = ctx.measureText(line).width;
                if (w > maxWidth) maxWidth = w;
              });
              const boxWidth = maxWidth + padding * 2;
              const boxHeight = lines.length * lineHeight + padding * 2;

              ctx.fillStyle = bgWhite ? 'rgba(255,255,255,0.95)' : 'rgba(30,30,46,0.95)';
              ctx.fillRect(x, y, boxWidth, boxHeight);
              ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
              ctx.lineWidth = 1;
              ctx.strokeRect(x, y, boxWidth, boxHeight);

              lines.forEach((line, idx) => {
                if (idx === headerIdx) {
                  ctx.font = 'bold 16px "JetBrains Mono", monospace';
                  ctx.fillStyle = bgWhite ? '#000' : '#FFF';
                } else if (idx === footerIdx) {
                  ctx.font = 'bold 15px "JetBrains Mono", monospace';
                  ctx.fillStyle = '#2563EB';
                } else {
                  ctx.font = '15px "JetBrains Mono", monospace';
                  ctx.fillStyle = bgWhite ? '#000' : '#E0E0E0';
                }
                ctx.textAlign = 'left';
                ctx.fillText(line, x + padding, y + padding + idx * lineHeight + 15);

                if (idx === headerIdx) {
                  ctx.beginPath();
                  ctx.moveTo(x + padding, y + padding + idx * lineHeight + 20);
                  ctx.lineTo(x + boxWidth - padding, y + padding + idx * lineHeight + 20);
                  ctx.strokeStyle = 'rgba(229, 231, 235, 1)';
                  ctx.stroke();
                }
                if (footerIdx > 0 && idx === footerIdx - 1) {
                  ctx.beginPath();
                  ctx.moveTo(x + padding, y + padding + idx * lineHeight + 24);
                  ctx.lineTo(x + boxWidth - padding, y + padding + idx * lineHeight + 24);
                  ctx.strokeStyle = 'rgba(229, 231, 235, 1)';
                  ctx.stroke();
                }
              });
            };

            const hasPlant3 = typeof project !== 'undefined' && project !== 'SNTL400' && evalDataRaw.soc.plant3 && evalDataRaw.soc.plant3.some(v => !isNaN(v));
            const prj = typeof project !== 'undefined' ? project : 'Unknown';
            const getStatus = (val) => val < 0.5 ? 'Take action' : val < 0.8 ? 'Warning' : (prj === 'SNTL400' && val > 1 ? 'Alert' : 'Normal');

            if (i === 0) {
              const avgDaily = !isNaN(evalDataRaw.avgDailyCycle) ? evalDataRaw.avgDailyCycle : 0;
              const lines = [
                'Daily cycle (' + evalDataRaw.dataDate + '):',
                'Cycle_Plant 01 = ' + evalDataRaw.dailyCycle.plant1.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant1),
                'Cycle_Plant 02 = ' + evalDataRaw.dailyCycle.plant2.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant2)
              ];
              if (hasPlant3) lines.push('Cycle_Plant 03 = ' + evalDataRaw.dailyCycle.plant3.toFixed(3) + ' -> ' + getStatus(evalDataRaw.dailyCycle.plant3));
              lines.push('Cycle_Average Daily Cycle = ' + avgDaily.toFixed(3) + ' -> ' + getStatus(avgDaily));
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);
            }

            if (i === 1) {
              const avgTotal = !isNaN(evalDataRaw.avgTotalCycle) ? evalDataRaw.avgTotalCycle : 0;
              const lines = [
                'Plant Total Cycle (' + evalDataRaw.dataDate + '):',
                'Plant 01 Total Cycle = ' + evalDataRaw.totalCycle.plant1.toFixed(6),
                'Plant 02 Total Cycle = ' + evalDataRaw.totalCycle.plant2.toFixed(6)
              ];
              if (hasPlant3) lines.push('Plant 03 Total Cycle = ' + evalDataRaw.totalCycle.plant3.toFixed(6));
              lines.push('Average Total Plant Cycle = ' + avgTotal.toFixed(6));
              drawInfoBox(lines, 160, yOffset + 60, bgWhite, 0, lines.length - 1);

              if (evalDataRaw.deviations && evalDataRaw.deviations.highSOC) {
                const devLines = [
                  'Max deviation timings:',
                  'Max deviation (HIGH SOC): ' + evalDataRaw.deviations.highSOC.pair + ' = ' + evalDataRaw.deviations.highSOC.text,
                  'Max deviation (LOW SOC): ' + evalDataRaw.deviations.lowSOC.pair + ' = ' + evalDataRaw.deviations.lowSOC.text
                ];
                drawInfoBox(devLines, (targetWidth / 2) - 150, yOffset + 60, bgWhite, 0, -1);
              }
            }
          }

          yOffset += subplotHeights[i];
        }

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]);
            btn.innerHTML = 'COPIED!';
          } catch (err) {
            console.error('Clipboard write error:', err);
            btn.innerHTML = 'ERROR';
            alert('Failed to copy. Please ensure browser allows clipboard access from local files.');
          }
          setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
        }, 'image/png');

      } catch (err) {
        console.error('Copy error:', err);
        btn.innerHTML = 'ERROR';
        alert('Failed to copy image: ' + err.message);
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 2000);
      }
    }

`;

// Let's replace the first occurrence
if (content.indexOf(functionToAdd.trim()) === -1) {
  content = content.replace(searchString, functionToAdd + searchString);
  fs.writeFileSync(file, content);
  console.log('Added copyGraphsToClipboard to handleExportHtml!');
} else {
  console.log('copyGraphsToClipboard already exists in handleExportHtml.');
}
