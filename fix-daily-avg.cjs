const fs = require('fs');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Re-apply legend fixes
  content = content.replace(
    /name: 'Remote Active Power',\s*line: { color: '#731A66', width: 1.6 }/g,
    "name: 'Remote Active Power', showlegend: Boolean(evalData?.remoteP?.[pKey]?.some((v) => v != null && !isNaN(v))),\n            line: { color: '#731A66', width: 1.6 }"
  );
  content = content.replace(
    /name: 'P dispatch allocation',\s*line: { color: '#339933', width: 1.8, dash: 'dash' }/g,
    "name: 'P dispatch allocation', showlegend: Boolean(evalData?.dispatchP?.[pKey]?.some((v) => v != null && !isNaN(v))),\n            line: { color: '#339933', width: 1.8, dash: 'dash' }"
  );
  content = content.replace(
    /name: 'P dispatch allocation', line: { color: '#339933', width: 1.8, dash: 'dash' }/g,
    "name: 'P dispatch allocation', showlegend: Boolean(evalDataRaw?.dispatchP?.[pk]?.some((v) => v != null && !isNaN(v))), line: { color: '#339933', width: 1.8, dash: 'dash' }"
  );

  // 2. Apply DailyEvaluationGraph average fixes
  const oldMatchingBlock = `              parsedDaily.plant1 = matchingDay.SWG01_DailyReached !== null ? matchingDay.SWG01_DailyReached : NaN;
              parsedDaily.plant2 = matchingDay.SWG02_DailyReached !== null ? matchingDay.SWG02_DailyReached : NaN;
              parsedDaily.plant3 = matchingDay.SWG03_DailyReached !== null ? matchingDay.SWG03_DailyReached : NaN;
            } else {`;
            
  const newMatchingBlock = `              parsedDaily.plant1 = matchingDay.SWG01_DailyReached !== null ? matchingDay.SWG01_DailyReached : NaN;
              parsedDaily.plant2 = matchingDay.SWG02_DailyReached !== null ? matchingDay.SWG02_DailyReached : NaN;
              parsedDaily.plant3 = matchingDay.SWG03_DailyReached !== null ? matchingDay.SWG03_DailyReached : NaN;
              
              parsedAvgTotal = matchingDay.Average_Total_Plant_Cycle !== null && matchingDay.Average_Total_Plant_Cycle !== undefined ? matchingDay.Average_Total_Plant_Cycle : NaN;
              parsedAvgDaily = matchingDay.Average_Daily_Cycle !== null && matchingDay.Average_Daily_Cycle !== undefined ? matchingDay.Average_Daily_Cycle : NaN;
            } else {`;
            
  content = content.replace(oldMatchingBlock, newMatchingBlock);

  const oldFallbackBlock = `              parsedDaily.plant1 = getDailyDiff(p1Rows);
              parsedDaily.plant2 = getDailyDiff(p2Rows);
              parsedDaily.plant3 = getDailyDiff(p3Rows);
            }
          }
        } catch (e) {
          console.error("Error parsing ESS daily cycles:", e);
        }
      }

      parsedData.dailyCycle = {
        plant1: !isNaN(parsedDaily.plant1) ? parsedDaily.plant1 : (isNaN(cycleP1) ? 0.891 : cycleP1),
        plant2: !isNaN(parsedDaily.plant2) ? parsedDaily.plant2 : (isNaN(cycleP2) ? 0.925 : cycleP2),
        plant3: !isNaN(parsedDaily.plant3) ? parsedDaily.plant3 : (isNaN(cycleP3) ? 0.879 : cycleP3),
      };

      parsedData.totalCycle = {
        plant1: isNaN(parsedTotals.plant1) ? 170.546875 : parsedTotals.plant1,
        plant2: isNaN(parsedTotals.plant2) ? 171.875000 : parsedTotals.plant2,
        plant3: isNaN(parsedTotals.plant3) ? 171.666667 : parsedTotals.plant3,
      };

      parsedData.avgTotalCycle = isNaN(parsedAvgTotal) ? (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148) : parsedAvgTotal;
      parsedData.avgDailyCycle = isNaN(parsedAvgDaily) ? (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148) : parsedAvgDaily;`;

  const newFallbackBlock = `              parsedDaily.plant1 = getDailyDiff(p1Rows);
              parsedDaily.plant2 = getDailyDiff(p2Rows);
              parsedDaily.plant3 = getDailyDiff(p3Rows);
              
              const allRows = project === 'SNTL400' ? [...p1Rows, ...p2Rows] : [...p1Rows, ...p2Rows, ...p3Rows];
              parsedAvgDaily = getDailyDiff(allRows);
              
              const allBlocks = project === 'SNTL400' ? [...p1Blocks, ...p2Blocks] : [...p1Blocks, ...p2Blocks, ...p3Blocks];
              const validCycles = allBlocks.map(b => b.LastEquivalentNumberOfCycle).filter(v => v !== null && !isNaN(v));
              parsedAvgTotal = validCycles.length > 0 ? validCycles.reduce((s, v) => s + v, 0) / validCycles.length : NaN;
            }
          }
        } catch (e) {
          console.error("Error parsing ESS daily cycles:", e);
        }
      }

      parsedData.dailyCycle = {
        plant1: !isNaN(parsedDaily.plant1) ? parsedDaily.plant1 : (isNaN(cycleP1) ? 0.891 : cycleP1),
        plant2: !isNaN(parsedDaily.plant2) ? parsedDaily.plant2 : (isNaN(cycleP2) ? 0.925 : cycleP2),
        plant3: !isNaN(parsedDaily.plant3) ? parsedDaily.plant3 : (isNaN(cycleP3) ? 0.879 : cycleP3),
      };

      parsedData.totalCycle = {
        plant1: isNaN(parsedTotals.plant1) ? 170.546875 : parsedTotals.plant1,
        plant2: isNaN(parsedTotals.plant2) ? 171.875000 : parsedTotals.plant2,
        plant3: isNaN(parsedTotals.plant3) ? 171.666667 : parsedTotals.plant3,
      };

      parsedData.avgTotalCycle = !isNaN(parsedAvgTotal) ? parsedAvgTotal : (project === 'SNTL400' ? ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40)) / 104 : ((parsedData.totalCycle.plant1 * 64) + (parsedData.totalCycle.plant2 * 40) + (parsedData.totalCycle.plant3 * 44)) / 148);
      parsedData.avgDailyCycle = !isNaN(parsedAvgDaily) ? parsedAvgDaily : (project === 'SNTL400' ? ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40)) / 104 : ((parsedData.dailyCycle.plant1 * 64) + (parsedData.dailyCycle.plant2 * 40) + (parsedData.dailyCycle.plant3 * 44)) / 148);`;

  content = content.replace(oldFallbackBlock, newFallbackBlock);

  fs.writeFileSync(filePath, content, 'utf8');
}

fixFile('src/components/DailyEvaluationGraph.tsx');
fixFile('src/lib/portable-view-template.ts');
console.log('Fixed DailyEvaluationGraph.tsx');
