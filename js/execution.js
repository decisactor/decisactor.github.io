/**
 * my initialize javascript
 * comes before any other script 
 */

function createNode(tag, attributes) {
    /** element format
     * <tagName>, {[attributeName : attributeValue[, attributeName : attributeValue]...]}
     */

    var node = document.createElement(tag.match(/\w+/)[0]);

    for (let i = 0; i < Object.keys(attributes).length; i++) {
        node.setAttribute(Object.keys(attributes)[i], Object.values(attributes)[i]);
    }

    document.head.appendChild(node);
    return node;
}

function getRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function addColor() {

    let cssNumber = getRandom(colors.length)
    let css = colors[cssNumber];
    let schemeNumber = getRandom(css.schemes.length)
    let scheme = css.schemes[schemeNumber]
    let colorNumber = getRandom(scheme.color.length)
    color = `${css.css}${scheme.scheme == "" ? "": "-"}${scheme.scheme}-` + scheme.color[colorNumber];

}

function addHead() {

    $("<meta>", {
        charset: "utf-8"
    }).appendTo(head);

    // Mobile first
    $("<meta>", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
    }).appendTo(head);

    // CSS 
    $("<link>", {
        rel: "stylesheet",
        href: `https://raw.githack.com/JaniRefsnes/w3css/master/w3.css`,
        type: 'text/css'
    }).appendTo(head);
    
    $("<link>", {
        rel: "stylesheet",
        href: `https://www.w3schools.com/w3css/4/w3.css`
    }).appendTo(head);

    let styles = ["colors", "style"]
    $(styles).each(function () {
        $("<link>", {
            rel: "stylesheet",
            href: `${folder}/css/${this}.css`
        }).appendTo(head);
    });

    // Website Icon
    $("<link>", {
        rel: "shortcut icon",
        href: `#`
    }).appendTo(head);
    $("<link>", {
        rel: "icon",
        href: `${icons8}/color/50/ffffff/external-link.png`,
        size: "16x16",
        type: "image/png"
    }).appendTo(head);

}

function addTopNav(color) {

    // Set Bar Item
    if (uri.match("/toefl/")) {
        var test = "/toefl/"
        var barItems = ["TPO", "Essay", "OG", "PT", "EQ", "BE", "Cambridge", "Longman", "Notes"];
    } else if (uri.match("/gre/")) {
        var test = "/gre/";
        var barItems = ["OG", "PQ", "PR", "Kap", "MP", "BE", "MH", "GR", "Notes"];
    } else {
        var test = "/"
        var barItems = ["Notes", "TOEFL", "GRE"];
    }

    topNav = $("<nav>", {
        class: `${color} w3-bar w3-card w3-center w3-margin-bottom my-sticky`,
        id: "topNav"
    }).prependTo($("body")).css({
        overflow: "auto",
        whiteSpace: "nowrap"
    })


    $("<a>", {
        href: `${folder}/index.html`,
        class: "w3-bar-item w3-button",
        html: `<img src="${icons8}/android/${mobileFlag ? 16 : 18}/ffffff/home.png">`
    }).appendTo(topNav).css({
        padding: mobileFlag ? "0 8px" : "4px 8px",
        display: "inline-block"
    })

    // Add Bar Item
    $(barItems).each(function () {
        $("<a>", {
            href: folder + test + this.toLowerCase() + `/${this.toLowerCase()}.html`,
            class: "w3-bar-item w3-button my-padding",
            html: this
        }).appendTo(topNav).css({
            float: mobileFlag ? "none" : "left",
            display: "inline-block"
        });;
    });
}

function addFooter(color) {

    var icons = ["youtube", "twitter", "facebook", "instagram", "linkedin", "pinterest"]

    footer = $("<footer>", {
        class: `${color} w3-container w3-center w3-margin-top`
    }).appendTo($("body"));

    $("<p>", {
        html: "This is my social media."
    }).appendTo(footer);

    $(icons).each(function () {
        $("<img>", {
            src: `${icons8}/metro/20/ffffff/${this}.png`,
            class: "my-margin-small"
        }).appendTo($("<a>", {
            href: `https://www.${this}.com`
        }).appendTo(footer));
    });

    $("<p>", {
        html: `Made by <a href="https://${uri.split('/').slice(2.3)[0]}">GitHubPages</a>`
    }).appendTo(footer);
}

function addScripts(scripts, func) {

    function createScript(script) {
        createNode("<script>", {
            id: `${script.split("/").slice(-1)}js`,
            src: `${folder}/js/${script}.js`
        });
    }

    function waitLoad(selector, func) {
        document.querySelector(selector).onload = () => func();
    }
    if (!scripts.length) {
        func();
        return
    }
    if (typeof scripts == "string") scripts = new Array(scripts);
    createScript(scripts[0]);
    waitLoad(`#${scripts[0].split("/").slice(-1)}js`, () => {
        scripts.shift()
        addScripts(scripts, func);
    });
}

function createNavigation(name) {

    function createWords(div, name, regexp) {

        $("<button>", {
            class: "my-page w3-margin-top",
            html: name
        }).appendTo(div).click((e) => {
            if ($(e.target).text().match("V")) {
                name = "Verbal";
                regexp = regexp.replace(/V\w*/, "");
            }
            if (!regexp.match(/\d/)) {
                name = link.sets.find(set => set.links.includes(name)).name;
                regexp = regexp.replace(" ", "-") + name.toLowerCase()
            }
            wordsDiv.html("");
            set = sets.find(set => set.name.match(regexp));

            let buttons = ["Practice", "Listen", "Recite"];

            div = $("<div>", {
                class: `w3-bar w3-center w3-section`
            }).appendTo(wordsDiv);

            $(buttons).each(function () {
                $("<button>", {
                    class: `${color} w3-button w3-large w3-left`,
                    html: this
                }).appendTo(div).click(() => {
                    if (this.match("Practice")) {
                        $(set.words).each(function () {
                            addWordModal(this, wordsDiv);
                        });
                    } else if (this.match("Recite")) {
                        createWordTest(set);
                    } else if (this.match("Listen")) {
                        createListening(set);
                    }
                });
            });
        });
    }

    link = links.find(set => set.name.match(name));

    $(link.sets).each(function () {
        let div = $("<div>", {
            class: "w3-bar my-margin"
        }).appendTo(main);

        $("<div>", {
            class: "w3-margin-right my-page w3-margin-top",
            html: `${this.name}`
        }).appendTo(div);

        if (this.links) {
            href = this
            $(this.links).each(function () {
                if (!mobileFlag) name = this
                else name = this.replace(/Issue ?/, "I").replace(/Argument ?/, "A").replace(/Verbal ?/, "V")

                if (html.match(/vocabulary/)) {
                    createWords(div, name, `${link.name} ${name}`);
                } else {
                    $("<a>", {
                        class: "my-page w3-margin-top",
                        html: name,
                        href: `${link.name}-${href.name}-${this}.html`.toLowerCase()
                    }).appendTo(div);
                }
            });
        } else {
            for (let i = 1; i <= this.count; i++) {

                if (html.match(/vocabulary/)) {
                    createWords(div, i, `${this.href}`.replace("-verbal.html", i));
                } else {
                    $("<a>", {
                        class: "w3-button w3-bar-item my-color my-page w3-margin-top",
                        html: `${i}`,
                        href: `${this.href}`.replace("verbal.html", `verbal${i}.html`)
                    }).appendTo(div);
                }
            }
        }
    });

    if (html.match(/vocabulary/)) {
        wordsDiv = $("<div>", {
            class: "w3-section w3-bar w3-row",
            id: "words"
        }).appendTo(main);
    }
    setStyle();
}

function execScripts() {

    function updateCharacter() {
        main.html(main.html().replace(/\u00E2\u20AC\u201D/g, "\u2013"))
        main.html(main.html().replace(/\u00E2\u20AC\u201C/g, "\u2014"))
        main.html(main.html().replace(/\u00E2\u20Ac\u2122/g, "\u2019"))
        main.html(main.html().replace(/\u00E2\u20AC\u0153/g, "\u201C"))
        main.html(main.html().replace(/\u00E2\u20AC\u009D/g, "\u201D"))
        main.html(main.html().replace(/\u00E2\u20AC\u00A6/g, "\u2026"))
    }

    updateCharacter();

    $(["literals/notes", "literals/bookmarks"]).each(function () {
        if (uri.match(`github(.io)?/notes/${this.toString().replace("literals/", "")}`)) {
            addScripts(this.toString(), () => addTags());
        }
    })

    if ($("code").length) {
        addScripts("code", () => showCode());
    }

    if (sidebar.length) {
        addTOC();
    }

    if (uri.match("vocabulary") || uri.match(/gre\/(\w+).\1.html/) && !uri.match("notes")) {
        addScripts("literals/gre", () => {
            if (!uri.match("vocabulary")) createNavigation(html);
        });
    }

    if (uri.match("topic")) {

        $("article").toggleClass("w3-section").css({
            height: () => {
                if (mobileFlag) return `${screen.height / 2 - 96}px`;
            },
            overflow: () => {
                if (mobileFlag) return "scroll";
            }
        });

        addTextarea(main).addClass("w3-section w3-block").removeClass("w3-half").css({
            height: () => {
                if (mobileFlag) return `${screen.height / 4 - 16 }px`;
            }
        });

    }

    if (uri.match("essay.html")) {
        addScripts("literals/topics", () => {
            topics.forEach(topic => {
                let div = $("<div>", {
                    class: "my-margin"
                }).appendTo(main);
                if (!mobileFlag) {
                    $("<span>", {
                        class: "w3-padding my-color my-margin-small",
                        html: `${topic.name}`
                    }).appendTo(div);
                }
                addDropDown(topic.name, topic.count, div);
            })
            let div = $("<div>", {
                class: "w3-bar"
            }).appendTo(main, true);
            createSearchBtn(div, `${color} my-search`, filterNodes, $(".w3-section", main));
            setStyle();
        })
    }

    if (html == "" || html.match(/^index$/)) {
        addScripts("homepage", () => showHomepage());
    }

    if (testFlag || uri.match(/toefl(\/(tpo|og)){2}\.html/) || uri.match("vocabulary.html")) {
        addScripts(["literals/words", "vocabulary"], () => {
            if (uri.match("vocabulary.html")) {
                createWordSets()
            } else {
                addScripts("test", () => {
                    updateQuestionUI(questions);
                    if (uri.match(/ing\d\.html/) || uri.match(/toefl\/(tpo|og)\/\1/)) {
                        addScripts("literals/categories", () => {
                            addCategoryFilter()
                            setStyle();
                        });
                    } else {
                        var parent;
                        if (greFlag) {
                            parent = $("<div>", {
                                class: `w3-bar`,
                            }).prependTo(main)
                        } else {
                            parent = main
                        }
                        $("<button>", {
                            id: "test",
                            class: `${color} w3-button w3-right w3-section my-bar-small`,
                            html: "Test"
                        }).prependTo(parent).click(startTest);
                    }
                })
            }
        })
    }

    if (uri.match("quantitative")) {
        let scripts = [
            "mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML",
            "jsxgraph/1.3.5/jsxgraphcore.js",
        ]
        $(scripts).each(function () {
            $.getScript(`${prefix}${this}`, function () {
                if (this.url.match(/jsxgraph/)) {
                    createSVG();
                }
            });
        });
    }

    setStyle();
}

mobileFlag = screen.width < 420 ? true : false;
icons8 = "https://png.icons8.com";
html = uri.split("/").slice(-1)[0].split(".")[0];
mediaRoot = "https://raw.githubusercontent.com/decisacters/media/master"

window.onload = () => {
    $(() => {
        head = $("head");
        main = $("main");
        sidebar = $("#sidebar");

        if ($("#questions").length) questions = $("#questions [id^='question']");
        else questions = $("#question > div");
        testFlag = questions.length || $("#question").length;
        greFlag = uri.match(/verbal|quantitative|issue|argument|test/)

        addHead();

        addScripts("literals/colors", () => {
            addColor();
            addTopNav(color);
            addFooter(color);

            addScripts(["style", "filter"], () => {
                (function waitColor() {
                    setTimeout(() => {
                        bgColor = getComputedStyle(topNav[0]).backgroundColor;
                        if (bgColor.match("rgba")) waitColor();
                        else execScripts();
                    }, 100);
                })();
            });
        });
    });
}