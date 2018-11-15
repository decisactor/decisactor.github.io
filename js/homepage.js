function showHomepage() {
    function createIconText(element, parent) {
        tag = "p" //tag ? tag : "p";
    
        let node = $(`<p>`).appendTo(parent);
        let size = 24 //tag == "p" ? 24 : (8 - parseInt(tag[1])) * 6
        let style = element.style ? element.style : "ios"
    
        $("<img>", {
            src: `${icons8}/${style}/${size}/${rgb2hex(bgColor)}/${element.link}-filled.png`,
            class: "w3-padding-small"
        }).appendTo(node);
    
        $("<span>", {
            html: `<b>${element.text}</b>`
        }).appendTo(node);
    
    }
    
    let info = [{
            "link": "developer",
            "text": "Developer"
        },
        {
            "link": "marker",
            "text": "San Francisco"
        },
        {
            "link": "email",
            "text": "AI@mail.com"
        },
        {
            "link": "phone",
            "text": "1800800800"
        },
    ]
    $(info).each(function () {
        createIconText(this, $("#info"));
    })
    
    let skills = [{
        "link": "machine-learning",
        "text": "Machine-learning",
        "percent": "60%"
    }, {
        "link": "powershell",
        "text": "PowerShell",
        "percent": "50%"
    }, {
        "link": "javascript",
        "text": "JavaScript",
        "percent": "40%"
    }, {
        "link": "python",
        "text": "Python",
        "percent": "30%"
    }, ]
    let parent = $("#skills");
    
    $(skills).each(function () {
    
        createIconText(this, parent);
        $("<div>", {
            class: "w3-center w3-round-xlarge w3-text-white my-color",
            html: this.percent
        }).appendTo($("<div>", {
            class: "w3-light-gray w3-round-xlarge w3-small"
        }).appendTo(parent)).width(this.percent);
    
    });
}