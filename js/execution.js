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

function waitLoad(selector, func) {
    document.querySelector(selector).onload = () => func();
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
    let styles = ["w3", "colors", "style"]
    $(styles).each(function () {
        $("<link>", {
            rel: "stylesheet",
            href: `${folder}/css/${this}.css`
        }).appendTo(head);
    });

    // Website Icon
    $("<link>", {
        rel: "icon",
        href: `${icons8}color/50/ffffff/external-link.png`,
        size: "16x16",
        type: "image/png"
    }).appendTo(head);

}

function addTopNav(color) {

    // Set Bar Item
    if (uri.includes("/toefl/")) {
        var test = "/toefl/"
        var barItems = ["TPO", "Essay", "OG", "PT", "EQ", "BE", "Cambridge", "Longman", "Notes"];
    } else if (uri.includes("/gre/")) {
        var test = "/gre/";
        var barItems = ["OG", "PQ", "PR", "Kap", "MP", "BE", "MH", "GR", "Notes"];
    } else {
        var test = "/"
        var barItems = ["Notes", "TOEFL", "GRE"];
    }

    topNav = $("<nav>", {
        class: `${color} w3-bar w3-card w3-center w3-margin-bottom`,
        id: "topNav"
    }).prependTo($("body"));

    let size = mobileFlag ? 16 : 18;
    let padding = mobileFlag ? "0 8px" : "4px 8px";
    $("<a>", {
        href: `${folder}/index.html`,
        class: "w3-bar-item w3-button",
        html: `<img src="${icons8}android/${size}/ffffff/home.png">`
    }).appendTo(topNav).css("padding", padding);

    // Add Bar Item
    $(barItems).each(function () {
        $("<a>", {
            href: folder + test + this.toLowerCase() + `/${this.toLowerCase()}.html`,
            class: "w3-bar-item w3-button my-padding",
            html: this
        }).appendTo(topNav);
    });

    // Add Top Nav Button
    $("<button>", {
        id: "topNavBtn",
        class: "w3-bar-item w3-button w3-right w3-hide-large w3-hide-medium w3-padding-small",
        html: "\u25BC"
    }).appendTo(topNav).click(function () {

        // toggle top navigation bar item
        hiddenNavItems.each(function () {
            $(this).toggleClass("w3-bar-block w3-hide-small");
        });

        // toggle top navigation shape
        if ($(this).html() == "\u25B2") {
            $(this).html("\u25BC");
        } else {
            $(this).html("\u25B2");
        }
    });


    $(window).scroll(() => {
        if (window.pageYOffset != $(topNav).offset().Top) {
            $(topNav).addClass("my-fixed")
        }
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
            src: `${icons8}metro/20/ffffff/${this}.png`,
            class: "my-margin-small"
        }).appendTo($("<a>", {
            href: `https://www.${this}.com`
        }).appendTo(footer));
    });

    $("<p>", {
        html: `Made by <a href="https://mygithubpage.github.io">GitHubPages</a>`
    }).appendTo(footer);
}

function addScripts(scripts) {
    $(scripts).each(function () {
        createNode("<script>", {
            id: `${this.split("/").slice(-1)}`,
            src: `${folder}/js/${this}.js`
        }).async = false;
    });
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

    function createNavigation() {
        set = links.find(set => set.name.match(html));

        $(set.sets).each(function () {
            let div = $("<div>", {
                class: "w3-bar my-margin"
            }).appendTo(main);

            $("<div>", {
                class: "w3-margin-right my-page",
                html: `${this.name}`
            }).appendTo(div);

            if (this.links) {
                sets = this
                $(this.links).each(function () {
                    if (!mobileFlag) name = this
                    else name = this.replace(/Issue ?/, "I").replace(/Argument ?/, "A").replace(/Verbal ?/, "V")
                    $("<a>", {
                        class: "my-page",
                        html: name,
                        href: `${set.name}-${sets.name}-${this}.html`.toLowerCase()
                    }).appendTo(div);
                });
            } else {
                for (let i = 1; i <= this.count; i++) {
                    $("<a>", {
                        class: "w3-button w3-bar-item my-color my-page",
                        html: `${i}`,
                        href: `${this.href}`.replace("verbal.html", `verbal${i}.html`)
                    }).appendTo(div);
                }
            }
        });
        setStyle();
    }

    updateCharacter();
    bgColor = window.getComputedStyle(topNav[0]).backgroundColor;

    $(["computers", "literals/notes", "literals/bookmarks"]).each(function () {
        if (uri.includes(`${this.replace("literals/", "")}.html`)) {
            addScripts([this]);
            if (this.includes("literals/")) waitLoad(`#${this.replace("literals/", "")}`, () => addTags());
        }
    })

    if (uri.includes("vocabulary")) {
        addScripts(["vocabulary", "literals/words"]);
        waitLoad("#words", () => createWordSets());
    }

    if ($("code").length) {
        addScripts(["code"]);
        waitLoad("#code", () => showCode());
    }

    if (sidebar.length) {
        addScripts(["filter"]);
        waitLoad("#filter", () => addTOC());
    }

    if (uri.match(/gre\/(\w+).\1.html/) && !uri.includes("notes.html")) {
        addScripts(["literals/gre"]);
        waitLoad("#gre", createNavigation);
    }

    if (uri.includes("topic")) {
        //question = $("section").hide();
        article = $("article").toggleClass("w3-section");

        //createNode(["div", question.html()], article, true);
        var textarea = addTextarea(main).addClass("w3-section w3-block").removeClass("w3-half");
        if (mobileFlag) {
            textarea.css({
                height: screen.height / 4 - 16 + "px"
            });
            article.css({
                height: screen.height / 2 - 96 + "px",
                overflow: "scroll"
            });
        }
    }

    if (uri.includes("essay.html")) {
        addScripts(["literals/topics"]);
        topics.forEach(topic => {
            let div = $("<div>", {
                class: "w3-section"
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
        createSearchBtn(div, `${color} my-search`, filterNodes, main.querySelectorAll(".w3-section"));
    }

    if (uri.includes("scoring-rubric")) {

        function getChecked(array, description, table) {
            let row = 1
            let col = 0
            let length = table.querySelector("tr").children.length - 2
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.checked) {
                    if (index > length) {
                        row = index - length;
                    } else {
                        col = index + 1;
                    }
                }
            }

            description.html(table.rows[row].cells[col].textContent);
        }

        if (mobileFlag) {
            main.querySelectorAll(".my-table").forEach(table => {
                table.addClass("w3-hide");

                // create row select and col select radio input
                let mobileTable = $("<table>", {
                    class: "table"
                }).appendTo(table.parentNode);
                let tr = $("<tr>").appendTo(mobileTable);
                for (let i = 1; i < table.querySelectorAll("th").length; i++) {
                    const element = table.querySelectorAll("th")[i].text();
                    createChoiceInput(tr, "radio", element, "header").addClass("my-margin-small");
                }
                tr = $("<tr>").appendTo(mobileTable);
                for (let i = 1; i < table.rows.length; i++) {
                    createChoiceInput(tr, "radio", table.rows[i].cells[0].text(), table.rows[0].cells[0].text()).addClass("my-margin-small");
                }

                tr = $("<tr>").appendTo(mobileTable);
                let description = $("<div>", {
                    class: "w3-section description"
                }).appendTo(tr);

                let inputs = mobileTable.querySelectorAll("input");
                inputs.forEach(element => element.onchange = () => getChecked(inputs, description, table));
                mobileTable.querySelectorAll("label").forEach(element => {
                    element.style.display = "unset";
                });
            })

        }
    }

    // index page
    if (uri.includes("index.html")) {
        addScripts(["index"]);
        waitLoad("#index", () => showHomepage());
    }

    if (uri.includes("quantitative")) {
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

    if (testFlag) {
        addScripts(["test", "vocabulary", "literals/words"]);
        waitLoad("#test", () => {
            updateQuestionUI(questions);
            if (uri.match(/ing\d\.html/)) {
                addCategoryFilter();
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

    if (uri.match(/toefl(\/(tpo|og)){2}\.html/)) addCategoryFilter();
    waitLoad("#style", () => setStyle());

}

mobileFlag = screen.width < 600 ? true : false;
icons8 = "https://png.icons8.com/";
html = uri.split("/").slice(-1)[0].split(".")[0];

window.addEventListener("load", () => {
    $(() => {
        head = $("head");
        main = $("main");
        sidebar = $("#sidebar");

        if ($("#questions").length) questions = $("#questions [id^='question']");
        else questions = $("#question > div");
        testFlag = questions.length || $("#question").length;
        greFlag = (/verbal|quantitative|issue|argument|test/).exec(uri)
        addScripts(["literals/colors", "style", "filter"]);
        addHead();
        waitLoad("#colors", () => {
            addColor();
            addTopNav(color);
            addFooter(color);
            execScripts();
        });

    });
})