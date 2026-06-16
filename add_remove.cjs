const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/CycleCalculation.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="flex justify-between items-center text-[10px] font-bold text-foreground/95">
                      <span>{r.DataDate}</span>
                      <span className="text-accent-blue text-[8px] bg-accent-blue/10 px-1 py-0.5 rounded uppercase">
                        {r.SourceFolder}
                      </span>
                    </div>`;

const replacement = `<div className="flex justify-between items-center text-[10px] font-bold text-foreground/95">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newResults = [...dailyResults];
                            newResults.splice(idx, 1);
                            setDailyResults(newResults);
                            localStorage.setItem(\`cycle_history_\${project}\`, JSON.stringify(newResults));
                            if (selectedDayIdx >= idx && selectedDayIdx > 0) {
                              setSelectedDayIdx(selectedDayIdx - 1);
                            }
                            setCalcStatus(\`Removed \${r.DataDate}\`);
                          }}
                          className="text-red-400 hover:bg-red-500/20 hover:text-red-300 w-4 h-4 flex items-center justify-center rounded transition-colors"
                          title="Remove this day"
                        >
                          ?
                        </button>
                        <span>{r.DataDate}</span>
                      </div>
                      <span className="text-accent-blue text-[8px] bg-accent-blue/10 px-1 py-0.5 rounded uppercase">
                        {r.SourceFolder}
                      </span>
                    </div>`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Added remove button successfully!");
} else {
    console.log("Could not find the target string.");
}
