const fs = require('fs');
const file = 'c:/Users/USER/Desktop/0. CHEA Rotha/ESS_Project_V0.1-main - Copy/src/components/ValidationDebug.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `                              <label 
                                className={cn(
                                  "flex-1 border-2 border-dashed rounded bg-accent-blue/5 hover:bg-accent-blue/10 border-accent-blue/30 hover:border-accent-blue/60 transition-colors flex flex-col items-center justify-center cursor-pointer text-[11px] text-accent-blue font-mono"
                                )}
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-accent-blue/20'); }}
                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-accent-blue/20'); }}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  e.currentTarget.classList.remove('bg-accent-blue/20');
                                  if (!e.dataTransfer.files) return;
                                  const filesArray = await getFilesFromDataTransfer(e.dataTransfer);
                                  await hcAcceptFiles(plant, cat, filesArray);
                                  showUploadSuccess();
                                }}
                              >
                                <span>Drop {cat.label} xlsx (or click)</span>
                                <input type="file" multiple className="hidden" accept=".xlsx,.xls" onChange={async (e) => {
                                  if (!e.target.files) return;
                                  const filesArray = Array.from(e.target.files).map(f => ({ file: f, path: f.webkitRelativePath || f.name }));
                                  e.target.value = '';
                                  await hcAcceptFiles(plant, cat, filesArray);
                                  showUploadSuccess();
                                }}/>
                              </label>`;

const replacementStr = `                              <div 
                                className={cn(
                                  "flex-1 border-2 border-dashed rounded bg-accent-blue/5 hover:bg-accent-blue/10 border-accent-blue/30 hover:border-accent-blue/60 transition-colors flex flex-col items-center justify-center text-[11px] text-accent-blue font-mono relative"
                                )}
                                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('bg-accent-blue/20'); }}
                                onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('bg-accent-blue/20'); }}
                                onDrop={async (e) => {
                                  e.preventDefault();
                                  e.currentTarget.classList.remove('bg-accent-blue/20');
                                  if (!e.dataTransfer.files) return;
                                  const filesArray = await getFilesFromDataTransfer(e.dataTransfer);
                                  await hcAcceptFiles(plant, cat, filesArray);
                                  showUploadSuccess();
                                }}
                              >
                                <span className="mb-2 pointer-events-none font-bold text-[10px] opacity-70 tracking-wider">Drop {cat.label}</span>
                                <div className="flex gap-2 w-full max-w-[180px] px-2 pointer-events-auto">
                                  <Button 
                                    onClick={(e) => { e.stopPropagation(); (e.currentTarget.parentElement?.nextElementSibling as HTMLInputElement)?.click(); }}
                                    className="bg-accent-blue text-foreground hover:bg-blue-600 h-6 text-[9px] flex-1 font-bold px-0"
                                  >
                                    File
                                  </Button>
                                  <Button 
                                    onClick={(e) => { e.stopPropagation(); (e.currentTarget.parentElement?.nextElementSibling?.nextElementSibling as HTMLInputElement)?.click(); }}
                                    variant="outline" 
                                    className="border-accent-blue/50 hover:bg-accent-blue/20 h-6 text-[9px] flex-1 text-accent-blue bg-transparent font-bold px-0"
                                  >
                                    Folder
                                  </Button>
                                </div>
                                <input type="file" multiple className="hidden" accept=".xlsx,.xls" onChange={async (e) => {
                                  if (!e.target.files) return;
                                  const filesArray = Array.from(e.target.files).map(f => ({ file: f, path: f.webkitRelativePath || f.name }));
                                  e.target.value = '';
                                  await hcAcceptFiles(plant, cat, filesArray);
                                  showUploadSuccess();
                                }}/>
                                <input type="file" multiple className="hidden" {...({webkitdirectory: "", directory: ""} as any)} onChange={async (e) => {
                                  if (!e.target.files) return;
                                  const filesArray = Array.from(e.target.files).map(f => ({ file: f, path: f.webkitRelativePath || f.name }));
                                  e.target.value = '';
                                  await hcAcceptFiles(plant, cat, filesArray);
                                  showUploadSuccess();
                                }}/>
                              </div>`;

content = content.replace(targetStr, replacementStr);
fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
