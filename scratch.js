const wtf = require('./src/index');
// const readFile = require('./tests/lib/_cachedPage');
// const wtf = require('./builds/wtf_wikipedia');
// const wtf = require('./build');

// (async () => {
//   var doc = await wtf.fetch('Jurassic Park (film)');
//   console.log(doc.infoboxes(0).keyValue());
// })();

// let doc = readFile('jodie_emery');{{MPC|75482|(75482) 1999 XC173}}
// console.log(doc.markdown());

var str = `{{MPC|75482|(75482) 1999 XC173}}`;

let doc = wtf(str);
console.log(doc.text());
console.log(doc.templates(0));
