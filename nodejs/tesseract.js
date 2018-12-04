const os = require('os');

var modulePath = `${os.homedir}/AppData/Roaming/npm/node_modules`
var Tesseract = require(`${modulePath}/tesseract.js`),
    image = require('path').resolve(__dirname, 'C:/GitHub/temp/files/apps/IMG_0105.PNG');

Tesseract.recognize(image).then(data => {
    console.log(data.text)
})