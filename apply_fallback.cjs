const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'DailyEvaluationGraph.tsx');
let content = fs.readFileSync(file, 'utf8');

const badCatch = `          } catch (err) {
            console.error('Clipboard write error:', err);
            btn.innerHTML = 'ERROR';
            alert('Failed to copy. Please ensure browser allows clipboard access from local files.');
          }`;

const goodCatch = `          } catch (err) {
            console.error('Clipboard write error:', err);
            try {
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'EMS_Export_' + Date.now() + '.png';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              btn.innerHTML = 'DOWNLOADED!';
              alert('Local file security prevents direct clipboard access. The high-res image has been downloaded to your computer instead!');
            } catch (fallbackErr) {
              console.error('Fallback download error:', fallbackErr);
              btn.innerHTML = 'ERROR';
              alert('Failed to copy or download. Local file restrictions active.');
            }
          }`;

if (content.includes(badCatch)) {
    content = content.split(badCatch).join(goodCatch);
    fs.writeFileSync(file, content);
    console.log('Fixed clipboard fallback!');
} else {
    console.log('Could not find exact catch block to replace.');
}
