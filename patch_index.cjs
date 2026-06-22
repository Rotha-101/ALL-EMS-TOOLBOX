const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('window.onerror')) {
  const script = `
  <script>
    window.onerror = function(msg, src, lineno, colno, error) {
      document.body.innerHTML += '<pre style="color:red;z-index:9999;position:fixed;top:0;left:0;background:white;padding:20px;width:100vw;height:100vh;">' + msg + '\\n' + (error && error.stack ? error.stack : '') + '</pre>';
    };
    window.onunhandledrejection = function(e) {
      document.body.innerHTML += '<pre style="color:red;z-index:9999;position:fixed;top:0;left:0;background:white;padding:20px;width:100vw;height:100vh;">Unhandled Promise: ' + e.reason + '</pre>';
    };
  </script>
  `;
  html = html.replace('<head>', '<head>' + script);
  fs.writeFileSync('index.html', html);
  console.log('Patched index.html');
}
