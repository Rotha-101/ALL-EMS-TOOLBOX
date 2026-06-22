const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

const target = `      let yOffset = titleHeight;
      for (let i = 0; i < imageUrls.length; i++) {
        const img = await loadImage(imageUrls[i]);
        ctx.drawImage(img, 0, yOffset, targetWidth, subplotHeights[i]);
        yOffset += subplotHeights[i];
      }`;

const replacement = `      let yOffset = titleHeight;
      for (let i = 0; i < imageUrls.length; i++) {
        const img = await loadImage(imageUrls[i]);
        ctx.drawImage(img, 0, yOffset, targetWidth, subplotHeights[i]);

        if (activeMetric === 'fig5' && evalData && evalData.dailyCycle && evalData.totalCycle) {
          const drawInfoBox = (lines: string[], x: number, y: number, bgWhite: boolean, headerIdx: number, footerIdx: number) => {
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

          const hasPlant3 = project !== 'SNTL400' && evalData.soc.plant3 && evalData.soc.plant3.some((v: any) => !isNaN(v));
          const getStatus = (val: number) => val < 0.5 ? 'Take action' : val < 0.8 ? 'Warning' : (project === 'SNTL400' && val > 1 ? 'Alert' : 'Normal');

          if (i === 0) {
            const avgDaily = !isNaN(evalData.avgDailyCycle) ? evalData.avgDailyCycle : 0;
            const lines = [
              \`Daily cycle (\${evalData.dataDate}):\`,
              \`Cycle_Plant 01 = \${evalData.dailyCycle.plant1.toFixed(3)} -> \${getStatus(evalData.dailyCycle.plant1)}\`,
              \`Cycle_Plant 02 = \${evalData.dailyCycle.plant2.toFixed(3)} -> \${getStatus(evalData.dailyCycle.plant2)}\`
            ];
            if (hasPlant3) lines.push(\`Cycle_Plant 03 = \${evalData.dailyCycle.plant3.toFixed(3)} -> \${getStatus(evalData.dailyCycle.plant3)}\`);
            lines.push(\`Cycle_Average Daily Cycle = \${avgDaily.toFixed(3)} -> \${getStatus(avgDaily)}\`);
            drawInfoBox(lines, 160, yOffset + 60, graphConfig.bgWhite, 0, lines.length - 1);
          }

          if (i === 1) {
            const avgTotal = !isNaN(evalData.avgTotalCycle) ? evalData.avgTotalCycle : 0;
            const lines = [
              \`Plant Total Cycle (\${evalData.dataDate}):\`,
              \`Plant 01 Total Cycle = \${evalData.totalCycle.plant1.toFixed(6)}\`,
              \`Plant 02 Total Cycle = \${evalData.totalCycle.plant2.toFixed(6)}\`
            ];
            if (hasPlant3) lines.push(\`Plant 03 Total Cycle = \${evalData.totalCycle.plant3.toFixed(6)}\`);
            lines.push(\`Average Total Plant Cycle = \${avgTotal.toFixed(6)}\`);
            drawInfoBox(lines, 160, yOffset + 60, graphConfig.bgWhite, 0, lines.length - 1);

            if (evalData.deviations && evalData.deviations.highSOC) {
              const devLines = [
                \`Max deviation timings:\`,
                \`Max deviation (HIGH SOC): \${evalData.deviations.highSOC.pair} = \${evalData.deviations.highSOC.text}\`,
                \`Max deviation (LOW SOC): \${evalData.deviations.lowSOC.pair} = \${evalData.deviations.lowSOC.text}\`
              ];
              drawInfoBox(devLines, (targetWidth / 2) - 150, yOffset + 60, graphConfig.bgWhite, 0, -1);
            }
          }
        }

        yOffset += subplotHeights[i];
      }`;

if (content.includes('let yOffset = titleHeight;\r\n')) {
  // normalize CRLF
  content = content.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
} else {
  content = content.replace(target, replacement);
}

fs.writeFileSync(file, content);
console.log('Patched DailyEvaluationGraph.tsx successfully!');
