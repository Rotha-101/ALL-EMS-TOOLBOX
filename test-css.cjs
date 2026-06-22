const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const dom = new JSDOM(`
<html>
<head>
<style>
  .h-\\[280px\\] { height: 280px !important; }
</style>
</head>
<body>
  <div class="h-[280px]"></div>
</body>
</html>
`);

const div = dom.window.document.querySelector('div');
const style = dom.window.getComputedStyle(div);
console.log('Height with single backslash:', style.height);

const dom2 = new JSDOM(`
<html>
<head>
<style>
  .h-\\\\[280px\\\\] { height: 280px !important; }
</style>
</head>
<body>
  <div class="h-[280px]"></div>
</body>
</html>
`);

const div2 = dom2.window.document.querySelector('div');
const style2 = dom2.window.getComputedStyle(div2);
console.log('Height with double backslash:', style2.height);
