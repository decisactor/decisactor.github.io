var fs = require('fs');
var content = fs.readFileSync("C:/GitHub/js/literals/words.js", "utf8");
var sets = JSON.parse(content.replace(/^.*sets = /, "").replace(/\n\s+(\w+):/g, `"$1":`));
console.log(sets[0].name);