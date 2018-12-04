var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer( (req, res) => {
    var query = url.parse(req.url, true);
    var type = query.path.split(".")[1]

    fs.readFile(`.${query.path}`, (err, data) => {
        res.writeHead(200, {Content: `text/${type}`});
        res.write(data);
        return res.end();
    });
}).listen(8080);
// http://localhost:8080/index.html