function addHighlight(element) {
    element.css({
        color: bgColor,
        fontWeight: "bold"
    });
    if (element[0].tagName == "u")
        element.css({
            textDecoration: `underline ${bgColor} solid`
        });
}

function removeHighlight(element) {
    element.css({
        color: "black",
        fontWeight: "normal"
    });
}

function rgb2hex(rgb) {

    rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+).*?\)$/);

    function hex(x) {
        return `${("0" + (+x).toString(16)).slice(-2)}`;
    }
    return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function createModal() {
    let parent = typeof testDiv != "undefined" ? testDiv : main;
    return $("<div>", {
        class: "w3-modal-content"
    }).appendTo($("<div>", {
        class: "w3-modal"
    }).appendTo(parent).show());
}

function toggleElement() {
    topNav.toggle();
    footer.toggle();
    main.toggle();
}

function createChoiceInput(parent, type, innerHTML, name = type) {

    let label = $("<label>", {
        class: "my-label"
    }).appendTo(parent).click(function () {
        $("input:checked").next().css("backgroundColor", bgColor);
        $("input:not(:checked)").next().css("backgroundColor", "lightgray");
    });;

    $("<span>", {
        html: innerHTML
    }).appendTo(label);

    $("<input>", {
        name: name,
        type: type
    }).appendTo(label);

    $("<span>", {
        class: `my-${type}`
    }).appendTo(label);

    return label
}

function renameTitle() {
    function toTitleCase(str) {
        return str.replace(/(?:^|\s|-)\w/g, function (match) {
            return match.toUpperCase();
        });
    }

    title = html.replace(/-/g, ' ');
    title = title.replace(/\bog\b/, "Official Guide");
    title = title.replace(/\bmh\b/, "McGraw-Hill");
    title = title.replace(/\bkap\b/, "Kaplan");
    title = title.replace(/\bpr\b/, "Princeton Review");
    title = title.replace(/\bmp\b/, "Manhattan Prep");
    title = title.replace(/\bbe\b/, "Barron's Edu");
    title = title.replace(/\bgr\b/, "Gruber's");
    title = title.replace(/\bdt(\d+)?/, "Diagnostic Test $1");
    title = title.replace(/\bpd(\d+)?/, "Practice Drill $1");
    title = title.replace(/\bpp(\d+)?/, "Practice Problems $1");
    title = title.replace(/\bpq(\d+)?/, "Practice Questions $1");
    title = title.replace(/\bes(\d+)?/, "Exercise Set $1");
    title = title.replace(/\bps(\d+)?/, "Practice Set $1");
    title = title.replace(/(\w)(\d)/, "$1 $2");
    if (!document.title) document.title = toTitleCase(title);
    document.title = document.title.replace("Mcgraw-hill", "McGraw-Hill");

}

function setListStyle() {
    var selector = "ul>li";
    icons = ["material/9/,/filled-circle", "material/9/,/circled", "material-sharp/9/,/unchecked-checkbox", "windows/9/,/unchecked-checkbox"];

    $(icons).each(function () {
        const element = this.split(",");
        $(selector).css("listStyle", `url('${icons8}/${element[0]}${rgb2hex(bgColor)}${element[1]}')`);
        selector += ">ul>li";
    })

    $("ol>ol").css("listStyle", "lower-alpha");
}

function addLinks() {

    // add computers links
    $("td a").each(function () {
        text = $(this).text()
        if (text.match(/lg/)) {
            this.href = `https://www.lg.com/us/laptops/${text}-ultra-slim-laptop`
        } else if (text.match(/ipad/)) { // Apple
            this.href = `https://www.apple.com/${text}/specs/`
        } else if (text.match(/i\d-\w+/)) { // Intel Core CPU
            this.href = `https://www.intel.com/content/www/us/en/products/processors/core/${text.match(/i\d\b/)}-processors/${text}.html`
        } else if (text.match(/\bS\d/)) { // Snapdragon CPU
            this.href = `https://www.qualcomm.com/products/snapdragon-${text.match(/\d+/)}-mobile-platform`
        } else if (text.match(/(Idea|Think)Pad/)) { // Lenovo
            this.href = `https://www.lenovo.com/us/en/laptop/${this.href}`
        } else if (text.match(/Surface/)) { // Surface
            this.href = `https://www.microsoft.com/en-us/p/surface/${this.href}`
        } else if (text.match(/(Zen|Vivo)Book/)) { // ASUS
            this.href = `https://www.asus.com/us/Laptops/ASUS-${text}/specifications/`
        } else if (text.match(/OnePlus/)) { // OnePlus
            this.href = `https://www.oneplus.com${text.match(/\/\w+/)}/specs`
        } else if (this.href.match(/chrome/)) { // OnePlus
            this.href = `https://chrome.google.com/webstore/search/${text}`
        }
    });
    $("main a:not([class])").each(function () {
        text = $(this).text();
        if (this.href == undefined) this.href = ""
        if (this.href.match(/chrome/)) {
            this.href = `https://chrome.google.com/webstore/search/${text}`
        } else if (this.href.match(/^npm$/)) {
            this.href = `https://www.npmjs.com/package/${text}`
        } else if (text.match(/git/)) {
            this.href = `https://git-scm.com/docs/${text.replace(" ", "-")}`
        }
    });
}

function setStyle() {

    addLinks();
    renameTitle();
    setListStyle();

    $("main a:not([class])").addClass("my-highlight").css({
        textDecoration: "none"
    });
    $("code a").removeClass("my-highlight");
    $("pre code").addClass("w3-code w3-panel w3-card").css({
        borderLeft: `3px solid ${bgColor}`,
        display: "block",
        overflow: mobileFlag ? "scroll" : "none"
    });
    $("table").wrap($("<div>").css({
        overflow: "auto"
    }))
    //$(".my-button").addClass("w3-round-medium")
    
    $(".my-page").addClass("w3-button w3-bar-item my-color");
    $(".my-color").addClass(color);
    $(".my-search").addClass("w3-btn w3-section w3-large w3-right");
    $(".my-tag").addClass("w3-btn w3-padding-small my-margin-small my-highlight my-border");
    $(".my-border, hr").css({
        border: `2px solid ${bgColor}`
    });
    $(".my-math").addClass("my-highlight").css({
        fontSize: "16px"
    });
    $(".my-highlight, h1, h2, h3, h4, h5, h6, b, u, em, strong").each(function () {
        addHighlight($(this))
    });

}

function addTOC() {

    function addHeading(level, section, parent) {
        if (level > 6 || $("h" + level, section).length < 1) return;
        let parentId = "";
        if (level > initial)
            parentId = parent[0].lastChild.children[1].id.split("#h")[1];
        let div = $("<div>", {
            id: (level > initial ? `s${parentId}` : "")
        }).appendTo(parent).hide();

        if (level == initial) div.show();
        $("h" + level, section).each(function (i) {
            this.id = `h${(level > initial ? parentId : "") + level + i}`;
            let headingDiv = $("<div>", {
                class: "w3-padding-small"
            }).appendTo(div).css("textIndent", `${(level - initial) * 20}px`);

            $("<span>", {
                class: "w3-padding-small my-button",
                html: "\u23F5"
            }).appendTo(headingDiv).click(function () {
                if ($(this).html() == "\u23F5")
                    $(this).html("\u23F7");
                else if ($(this).html() == "\u23F7")
                    $(this).html("\u23F5");
                $(`#s${$(this).next().attr("id").match(/\d+/)}`).each(function () {
                    $(this).toggle();
                });
            });

            $("<a>", {
                class: "w3-padding-small my-link my-button",
                id: "#" + this.id,
                html: $(this).html()
            }).appendTo(headingDiv).click(function () {
                sidebar.toggle();
                $(this.id)[0].scrollIntoView();
                window.scrollBy(0, -40);
            }).css("whiteSpace", "nowrap");

            headingDiv.children().each(function () {
                addHighlight($(this))
            });
            addHeading(level + 1, this.parentNode, div);
        });
    }

    sidebar.addClass("w3-sidebar w3-card w3-light-gray").hide();
    $("<button>", {
        class: "w3-button w3-left my-padding",
        id: "sidebarBtn",
        html: "\u2630"
    }).prependTo(topNav).click(() => {
        sidebar.toggle()
    });


    // Create Search Input
    let div = $("<div>", {
        class: "w3-padding-small w3-bar",
    }).appendTo(sidebar);

    for (initial = 2; initial < 7; initial++) {
        if ($(`h${initial}`).length > 2) break
    }
    addHeading(initial, main, sidebar)
    $("a", sidebar).each(function () {
        if (!$(`#s${this.id.split("#h")[1]}`, sidebar).length)
            $(this).prev().html("\u2003")
    });
    createSearchBtn(div, `${color} my-search`, filterNodes, $(".my-link", sidebar)).click(() => {
        $(".my-button", sidebar).toggle();
        $("div", sidebar).show().removeClass("w3-padding-small")
    });
    setStyle();
}


function addDropDown(element, length, parent) {
    if (mobileFlag) {
        dropdown = $("<div>", {
            class: "w3-dropdown-click"
        }).appendTo(parent);
        $("<button>", {
            class: "w3-bar-item w3-button w3-padding-small my-color",
            html: element
        }).appendTo(dropdown);
        dropdownContent = $("<div>", {
            class: "w3-dropdown-content w3-bar-block w3-card"
        }).appendTo(dropdown)
    }
    for (let i = 1; i <= length; i++) {
        let href;
        if (uri.match("essay")) {
            let count = 0;
            let index = topics.findIndex(topic => topic.name == element);
            for (let j = 0; j < index; j++) {
                count += topics[j].count;
            }
            href = `topic${index+1}-${count+i}.html`;
        } else {
            href = set + `-${element.toLowerCase() + i}.html`;
            href = !setFlag ? `${set}/${href}` : `${set.split("-")[0]}-${element.toLowerCase() + i}.html`;
        }

        if (mobileFlag) {
            if (dropdown.parent().hasClass("w3-bar")) dropdownContent.css({
                marginTop: "32px"
            });
            if (!dropdown.parent().hasClass("w3-bar"))
                dropdownContent.width("-webkit-fill-available");

            $("<a>", {
                class: "w3-bar-item w3-btn",
                href: href,
                html: uri.match("essay") ? `<b>Essay ${i}</b>` : `${element} ${i}`
            }).appendTo(dropdownContent);
        } else {

            if (uri.match("essay")) {
                innerHTML = `Essay ${i}`;
            } else {
                type = element.replace("ing", "").replace("Writ", "Write");
                innerHTML = type + " " + i
            }
            let a = $("<a>", {
                class: `${color} w3-padding-small w3-button`,
                href: href,
                html: innerHTML
            }).appendTo(parent);
            if (uri.match("essay")) a.addClass("my-margin-small")
        }
    }

    $(".w3-dropdown-click button").each(function () {
        $(this).click(function () {
            $(".w3-dropdown-content").each(function () {
                $(this).hide()
            });
            $(this.nextElementSibling).toggle();
        });
    });

}