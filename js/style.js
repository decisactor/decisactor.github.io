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
    }).appendTo(parent));
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

function hideNavItems() {
    let width = 0;

    topNav.children().each(function () {
        width += this.offsetWidth
        if (width > $(window).width() - 16 && $(this).attr("id") !== "topNavBtn")
            $(this).addClass("w3-hide-small");
    });
    hiddenNavItems = $(".w3-hide-small");
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
        $(selector).css("listStyle", `url('${icons8}${element[0]}${rgb2hex(bgColor)}${element[1]}')`);
        selector += ">ul>li";
    })

    $("ol>ol").css("listStyle", "lower-alpha");
}

function addLinks() {

    // add computers links
    $("td a").each(function () {
        text = $(this).text()
        if (text.match(/lg/)) {
            $(this).attr("href", `https://www.lg.com/us/laptops/${text}-ultra-slim-laptop`)
        }
        else if (text.match(/ipad/)) { // Apple
            $(this).attr("href", `https://www.apple.com/${text}/specs/`)
        }
        else if (text.match(/i\d-\w+/)) { // Intel Core CPU
            $(this).attr("href", `https://www.intel.com/content/www/us/en/products/processors/core/${text.match(/i\d\b/)}-processors/${text}.html`)
        }
        else if (text.match(/\bS\d/)) { // Snapdragon CPU
            $(this).attr("href", `https://www.qualcomm.com/products/snapdragon-${text.match(/\d+/)}-mobile-platform`)
        }
        else if (text.match(/(Idea|Think)Pad/)) { // Lenovo
            $(this).attr("href", `https://www.lenovo.com/us/en/laptop/${$(this).attr("href")}`)
        }
        else if (text.match(/Surface/)) { // Surface
            $(this).attr("href", `https://www.microsoft.com/en-us/p/surface/${$(this).attr("href")}`)
        }
        else if (text.match(/(Zen|Vivo)Book/)) { // ASUS
            $(this).attr("href", `https://www.asus.com/us/Laptops/ASUS-${text}/specifications/`)
        }
        else if (text.match(/OnePlus/)) { // OnePlus
            $(this).attr("href", `https://www.oneplus.com${text.match(/\/\w+/)}/specs`)
        }
        
    });
}

function setStyle() {

    $("main a:not([class])").addClass("my-highlight").css("textDecoration", "none");
    $("code a").removeClass("my-highlight");
    $("pre code").addClass("w3-code w3-panel w3-card").css({"borderLeft": `3px solid ${bgColor}`,"display":"block"});
    $(".my-page").addClass("w3-button w3-bar-item my-color");
    $(".my-color").addClass(color);
    $(".my-search").addClass("w3-btn w3-section w3-large w3-right");
    $(".my-tag").addClass("w3-btn w3-padding-small my-margin-small my-highlight my-border");
    $(".my-border, hr").css("border", `2px solid ${bgColor}`);
    $(".my-math").addClass("my-highlight").css("font-size", "16px");
    $(".my-highlight, h1, h2, h3, h4, h5, h6, b, u, em, strong").each(function () {
        addHighlight($(this))
    });

    renameTitle();
    setListStyle();
    hideNavItems();
    addLinks();

}

function addTOC() {

    function addHeading(level, section, parent) {
        if (level > 6 || $("h" + level, section).length < 1) return;
        let parentId = "";
        if (level > initial) 
            parentId = parent[0].lastChild.children[1].id.split("#h")[1];
        let div = $("<div>", {
            id: (level > initial ? "s" + parentId : "")
        }).appendTo(parent).hide();

        if (level == initial) div.show();
        $("h" + level, section).each(function (i) {
            this.id = "h" + (level > initial ? parentId : "") + level + i;
            let headingDiv = $("<div>", {
                class: "w3-padding-small"
            }).appendTo(div).css("textIndent", (level - initial) * 20 + "px");
            
            $("<span>", {
                class: "w3-padding-small my-button",
                html: "\u23F5"
            }).appendTo(headingDiv).click(function () {
                if ($(this).html() == "\u23F5")
                    $(this).html("\u23F7");
                else if ($(this).html() == "\u23F7")
                    $(this).html("\u23F5");
                $("#s" + $(this).next().attr("id").match(/\d+/)).each(function () {
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

            headingDiv.children().each(function () { addHighlight($(this)) });
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
        if (!$("#s" + this.id.split("#h")[1], sidebar).length)
            $(this).prev().html("\u2003")
    });
    createSearchBtn(div, `${color} my-search`, filterNodes, $(".my-link", sidebar)).click(() => {
        $(".my-button", sidebar).toggle();
        $("div", sidebar).show().removeClass("w3-padding-small")
    });
}