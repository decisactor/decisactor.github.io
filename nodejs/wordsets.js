const fs = require('fs');
const os = require('os');

var modules_path = `${os.homedir}/AppData/Roaming/npm/node_modules`
cheerio = require(`${modules_path}/cheerio`);

function getHTML(uri) {

    function requestURI(uri) {
        return new Promise(function (resolve) {
            request(uri, function (error, response, body) {
                content = body
                content = content.replace(/\n(\s+\n)*/, "")
                let $ = cheerio.load(content);
                $('svg').remove();
                fs.writeFileSync(path, $(selector).html(), 'utf8');
                resolve(content);
            });
        });
    }

    const request = require(`${modules_path}/request`);
    var content;
    var selector;

    if (uri.match(/oxford/)) {
        selector = `.entryWrapper`
    } else if (uri.match(/thefree/)) {
        selector = `#MainTxt`
    } else if (uri.match(/vocabulary/)) {
        selector = `.centeredContent`
    }

    if (uri.match(/^http/)) {
        var directory = `C:/GitHub/temp/html/${uri.split('/')[2]}`
        var path = `${directory}/${uri.split('/').slice(-1)}.html`
        if (fs.existsSync(path)) {
            content = fs.readFileSync(path, "utf8");
            if (content == 'null') 
            requestURI(uri).then(result => content = result)
        } else {
            requestURI(uri).then(result => content = result)
        }
    } else {
        content = fs.readFileSync(uri, "utf8");
    }

    return cheerio.load(content);
}

// Load Vocabulary
function setWords() {
    var content = fs.readFileSync("C:/GitHub/gre/notes/vocabulary.html", "utf8");
    var $ = cheerio.load(content);
    $(`div[id]`).each(function () {
        var id = $(this).attr("id");
        console.log(id);

        var set = {
            name: id,
            words: []
        }

        $($(this).html().toString().split(" ")).each(function () {
            var word = this.toString();
            console.log(word);

            var $ = getHTML(`https://www.vocabulary.com/dictionary/${word}`);
            var members = JSON.parse($("[data]").attr("data"));

            function getChildren(parent, family) {
                words = []
                words = members.filter(word => word.parent == parent)

                if (words.length == 0)
                    return family

                if (!parent)
                    parent = ""

                $(words).each(function () {
                    family = family.replace(parent, `${parent}<ul><li>${this.word}</li></ul>`)
                    family = getChildren(this.word, family)
                })
                return family
            }

            var family = getChildren(null, ``)

            $ = getHTML(`https://en.oxforddictionaries.com/definition/us/${word}`)

            // defintion
            var definitions = ""
            $(".ind").each(function () {
                definitions += `<p>${$(this).html()}</p>`
            })

            // example
            var examples = ""
            $(".examples").each(function () {
                sentences = []
                $(".ex", $(this)).each(function () {
                    sentences.push($(this).text().replace(/[\u2018-\u2019]/g, ''))
                })
                examples += `<p>${sentences.sort(function (a,b) {
                return b.length - a.length
            })[0]}</p>`
            })

            // synonym
            var synonyms = "";
            $(".exs").each(function () {
                synonyms += `<div class="exs">${$(this).html().replace(/<\/?strong>/g, '')}</div>`
            })

            // etymology
            var etymology = ""
            $(".etymology").each(function () {
                if ($(".etymology p").html().match(/\bOrigin\b/))
                    etymology += `<p>${$(".etymology p").html()}</p>`
            })

            // synonyms
            $ = getHTML(`https://www.thefreedictionary.com/${word}`)
            synonyms += `<div class="syn">`

            $("#ThesaurusInner .Syn").each(function () {
                if ($(this).text().match(/=/) || !$(this).text().match(/,/)) return
                var words = []
                $("a", $(this)).each(function () {
                    if (!synonyms.includes($(this).text())) {
                        words.push($(this).text())
                    }
                })
                synonyms += (words.join(", ")) + ", "
            });
            synonyms = synonyms.trimEnd(", ").replace("'", "").toLowerCase() + "</div>"
            synonyms = synonyms.replace(/((?<=>)| )\w+([ -]\w+)+(,|(?=<))/g, '')
            synonyms = synonyms.replace(/,(?=<)|(?<="syn">| ),/g, '')
            synonyms = synonyms.replace(/<div.*exs"><\/div>|<div class="syn">\(.*\)<\/div>|(?<=("|n")>) (?=\w+)/g, '')

            // etymology
            etymology += `<p>${$(".etyseg").html()}</p>`
            etymology = etymology.replace(/<\/?[A-Z]+.*?>/g, '')
            etymology = etymology.replace(/<A.*?>(.*?)<\/A>/g, '<b>$1</b>')
            etymology = etymology.replace(/(<i.*?>.*?<\/i>)/g, '<b>$1</b>')
            etymology = etymology.replace(/<span.*?>(.*?)<\/span>/g, '$1')
            etymology = etymology.toLowerCase()

            set.words.push({
                word: word,
                synonyms: synonyms,
                definitions: definitions,
                etymology: etymology,
                family: family,
                examples: examples
            })
        })


        if (sets && sets.find(set => set.name == id))
            sets[sets.findIndex(set => set.name == id)] = set
        else sets.push(set)
    })
}

// Load Word Sets
var content = fs.readFileSync("C:/GitHub/js/literals/words.js", "utf8");
content = content.replace(/^.*sets = /, "").replace(/(\n\s+|, |{)(\w+):/g, `$1"$2":`)
var sets = JSON.parse(content);

setWords();

var content = `sets = ${JSON.stringify(sets)}`
//fs.writeFileSync("C:/GitHub/temp/temp.js", content, 'utf8');
fs.writeFileSync("C:/GitHub/js/literals/words.js", content, 'utf8');
