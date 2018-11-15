function highlightJS() {
    
    $("code").each(function () {
        if (uri.match(/javascript.html/)) {
            $(this).addClass("js");
        }
        else if (uri.match(/powershell.html/)) {
            $(this).addClass("ps");
        }
    });
    
    highlightjs = `${prefix}highlight.js/9.13.1/highlight.min.js`
    $.getScript(highlightjs, () => {
        flag = true;
        languages = ["apache", "bash", "cs", "cpp", "css", "coffeescript", "diff", "xml", "http", "ini", "json", "java", "js", "makefile", "markdown", "nginx", "objectivec", "php", "perl", "python", "ruby", "sql", "shell"]
        $("code").each(function () {
            let language = this.className.split(" ")[0];
            if (language && !languages.includes(language) && !language.includes("-")) {
                flag = false;
                languages.push(language);
                if (language == "ps") language = "powershell"
                highlightjs = highlightjs.replace("highlight.min", `languages/${language}.min`)
                $.getScript(highlightjs, () => {
                    hljs.initHighlighting();                        
                });
            }
        });
        if (flag) hljs.initHighlighting();
    
        $("code").each(function () {
            //hljs.highlightBlock(this);
            $(this).addClass("w3-light-gray").css("display","unset");
        });
        setStyle();
    });

}

function highlightCode() {
    
    function replaceCode(regExp, type) {
        regExp = new RegExp(regExp, "g")
        $(code.html().match(regExp)).each(function () {
            text = this;
            flag = true;
            $("a", code).each(function () { 
                if (this.href.includes(text)) flag = false
            });
            if (flag == true) {
                prefix = regExp.toString().match(/\(\?<[=!].*?\)/)
                suffix = regExp.toString().match(/\(\?[=!].*\)/)
                text = (prefix ? prefix : "") + this.replace("$","\\$").replace("[","\\[") + (suffix ? suffix : "")
                regExp = new RegExp(text,"g")
                code.html(code.html().replace(regExp, `<span class="my-${type}">${this}</span>`));
            }
        }) 
    }

    var keywords = "for|function";
    var start = "((?<=\\s*)|[^\\.\\n])";

    $("code").each(function () {
        code = $(this).addClass("w3-light-gray")
        var html = uri.match(/html.html/) || code.hasClass("html") ? "=" : ""
        replaceCode(`(?<=[\\( ${html}])('|").*?\\1`, "string");
        if (uri.match(/javascript.html/) || code.hasClass("js")) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference
            keywords += "|var"
            comment = "//"
            objects = "document";
        }
        else if (uri.match(/powershell.html/) || code.hasClass("ps")) {
            comment = "#";
            objects = "System";

            replaceCode(`${start}\\w+-\\w+(?=\\s)`, "function");
            replaceCode(`(?<=\\s)-\\w+`, "option");
            replaceCode(`\\$\\w+`, "variable");
            replaceCode(`\\[.*?\\]`, "keyword");
        }
        else if (uri.match(/git.html/) || code.hasClass("git")) {
            
            if (code.text().match(/^git\s+\w+$/)) 
                $("a", code).attr("href", `https://git-scm.com/docs/${code.text().replace(" ", "-")}`)
            replaceCode(`(?<=git\\s+)\\w+`, "command");
            replaceCode(` *git +`, "git");
            replaceCode(`--\\w+`, "option");
        }
        else if (uri.match(/html.html/) || code.hasClass("html")) {
            replaceCode(`(?<= )\\w+(?==<)`, "attribute");
            replaceCode(`(?<=&lt;)\\w+ `, "tag");
            replaceCode(`(?<=&lt;/)\\w+(?=&gt;)`, "tag");
        }
        if (typeof objects != "undefined") replaceCode(`${start}${objects}(?=\\.)`, "object");
        if (typeof keywords != "undefined") replaceCode(`(?<=[\\s\\(])(${keywords})(?=[ \\(])`, "keyword");
        if (typeof comment != "undefined") replaceCode(`${comment}.*`, "comment");
        replaceCode(`((?<=\\s*)|[^\\.])\\w+(?=\\.)`, "variable");
        replaceCode(`(?<!-)\\w+(?=\\(.*?\\))`, "function");
        replaceCode(`(?<=\\.)\\w+(?=\\s)`, "variable");
        replaceCode(`\\b\\d+\\b`, "number");
        $(code.html().match(/(?<=var<\/span>\s)\w+(?=\s)/g)).each(function () {
            replaceCode(`(?<=\\b)${this}(?=\\b)`, "variable");
        })

        $(".my-keyword > span, .my-string > span").removeClass("my-variable my-object");
        $("code > a").each(function () {
            this.href = this.href.replace(/<span.*?>|<\/span>/g);
        });
    });
}

function showCode() {

    function formatCode () {
        $("pre").each(function () {
            let lines = $(this).html().split("\n");
            if (lines[1]) { var length = lines[1].length - lines[1].trimLeft(" ").length } // The Greatest WhiteSpace Length to be removed
            let innerHTML = "";
        
            $(lines).each(function () {
                let regexp = new RegExp(` {${length}}`)
                innerHTML += this.replace(regexp, "") + (this.match(/code/) ? "" : "\n");
            })
        
            $(this).html(innerHTML.replace(/\s+</, "<"));
        });
    }
    
    formatCode();
    highlightCode();

}
