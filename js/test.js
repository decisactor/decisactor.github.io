var setFlag = uri.match(/ing\d\.html/);
var num = +uri.match(/\d(?=\.html)/);
var sections = [{
    "type": "Reading",
    "length": 3
}, {
    "type": "Listening",
    "length": 6
}, {
    "type": "Speaking",
    "length": 6
}, {
    "type": "Writing",
    "length": 2
}];


function setArticleHeight(height) {

    height = height ? height : screen.height / 3 + "px";
    if (typeof height == "object") {
        article = height;
        height = screen.height / 3 + "px";
    }
    if (typeof article == "undefined") return
    article.addClass("w3-section").css({
        height: height,
        overflow: "scroll"
    });
}

// Reading Question
function showSpecialQuestion(article, section) {
    question = $(".question", section)

    if (question.text().match(/paragraph \d/)) {
        let para = question.text().match(/paragraph \d/)[0].slice(-1);
        let paragraph = $("p", article).eq(para - 1);
        paragraph[0].scrollIntoView();
    }

    // insert Text
    insertArea = $(".insert-area", article);
    insertArea.each(function () {
        $(this).text("")
    });
    if (!$(".choices > table") && $(".choices > p", section).text().length < 3) {
        addHighlight(question);

        // Add A B C D in inserted area
        insertArea.each(function () {
            if ($(this).data("answer") == "A") {
                this.scrollIntoView();
            }
            article.scrollTop -= 10
            this.text(`[${$(this).data("answer")}] `)
            addHighlight($(this));
        });

        // Add text in inserted area
        let inputs = $(".my-label input", section);
        inputs.each(function () {
            this.click(function () {
                insertArea.each(function () {
                    this.text(`[${$(this).data("answer")}] `);
                    addHighlight($(this));
                });
                this.text(question.text().replace(/\d{1,2}\./g, ""))
            });
        });
    }


    // highlight
    let highlight = $(`.${id}`);
    if (highlight.length) {
        highlight.children().each(function () {
            this.css({
                color: bgColor
            });
        });
        addHighlight(highlight);
        highlight.scrollIntoView();
        article.scrollTop(article.scrollTop() - (screen.height - section[0].offsetHeight) / 2 + 64)
        //index = parseInt(section.children[0].text().split(".")[0]) - 1;
        if (question.text().match("best expresses the essential")) {
            $(".my-highlight", highlight).each(function () {
                addHighlight($(this))
            });
            question.text("");
            setArticleHeight(Math.max(highlight[0].offsetHeight, screen.height - section[0].offsetHeight) + "px")
            highlight[0].scrollIntoView();
        }
    }
}

function addTextarea(parent) {
    function getAllIndexes(arr, val) {
        var indexes = [],
            i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }
    wordCountDiv = $("<div>", {
        class: "w3-padding w3-section"
    }).appendTo(parent);
    wordCount = $("<span>", {
        class: "w3-large my-highlight",
        html: "Word Count: 0"
    }).appendTo(wordCountDiv);

    $("<span>", {
        id: "time",
        class: "w3-large w3-right my-highlight"
    }).appendTo(wordCountDiv);

    if (typeof article != "undefined") article.toggleClass("w3-padding-small");
    if (typeof section != "undefined") section.toggleClass("w3-padding-small");

    return $("<textarea>", {
        class: "my-border w3-padding w3-block"
    }).appendTo(parent).height(window.innerHeight).on("input", function () {
        wordCount.html(`Word Count: ${getAllIndexes(this.value, " ").length + 1}`)
    });
}

function startTest() {

    let seconds = [
        ["45", "60", "60"],
        ["15", "30", "20"]
    ];

    let reading = $("article.passage");

    let audio;
    let testDiv = $("<div>", {
        id: "testDiv",
        class: "w3-container"
    }).appendTo($("body"));
    let myAnswer = new Array(questions.length);


    function setTimer(second) {
        function startTimer() {
            min = parseInt(timer / 60);
            sec = parseInt(timer % 60);

            if (timer < 0) {
                return
            }
            let secStr = sec < 10 ? `0${sec.toString()}` : sec.toString();
            if (time.length) time.html(min.toString() + `:${secStr}`);
            timer--;
            setTimeout(() => startTimer(), 1000);
        }
        var time = $("#time");
        var timer = second,
            min = 0,
            sec = 0;
        startTimer();
    }

    function playAudio(link, onEnd) {
        audio = new Audio(link);
        //audio = document.createElement('audio');
        //audio.src = link;
        //testDiv.appendChild(audio);
        let promise = audio.play();

        if (promise != undefined) {
            promise.catch(() => {
                // Auto-play was prevented
                // Show a UI element to let the user manually start playback
                article.toggle();
                let button = $("#playAudio", testDiv);
                if (!button) {
                    button = $("<button>", {
                        class: `${color} w3-btn w3-block w3-section w3-hide`,
                        id: "playAudio",
                        html: "Play Audio"
                    }).prependTo(testDiv);
                }
                button.toggle();
                button.click(() => {
                    audio.play();
                    article.toggle();
                    button.toggle();
                    audio.onended = () => onEnd();
                });
            }).then(() => audio.onended = () => onEnd);
        }
    }

    function waitTime(second, onTimeout) {
        setTimer(second);
        setTimeout(() => onTimeout, second * 1000);
    }

    function endTest() {
        $("#testDiv").remove();
        toggleElement();
    }

    function recordAudio() {

        let data = [];

        let onFulfilled = stream => {
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.on("stop", () => {
                var blob = new Blob(data, {
                    'type': 'audio/mp3'
                });
                audioURL = window.URL.createObjectURL(blob);

                $("<a>", {
                    controls: 'controls',
                    src: audioURL
                }).appendTo(testDiv);
            });
            mediaRecorder.on("dataavailable", event => data.push(event.data));
            return mediaRecorder;
        }
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(onFulfilled);

    }

    function navigateQuestion(button, question) {
        let id = question[0].id.match(/\d+/)[0];
        index = Math.abs(button.text() == "Next" ? +id + 1 : +id - 1);
        setAnswer(question);

        if (id == questions.length) {
            showModal(uri);
        } else {
            showQuestion(index);
        }
    }

    function setAnswer(question) {
        let index = question[0].id.match(/\d+/)[0] - 1;
        let answer = $(".explanation", question).data("answer");
        let flag;

        //if (!myAnswer[id - 1] || !myAnswer[id - 1].split("->")[0]) {}
        myAnswer[index] = "";
        if ($(".choice table", question).length) {
            let table = $("table", questions[id - 1]);
            for (let i = 1; i < table.rows.length; i++) {
                const element = table.rows[i];
                let inputs = $("input", element);
                flag = false;
                inputs.each(function () {
                    const element = inputs[j];
                    if (element.checked) {
                        myAnswer[id - 1] += String.fromCharCode(65 + j);

                    }
                    flag = true;
                });
                if (!flag) {
                    if (!myAnswer[id - 1]) {
                        myAnswer[id - 1] = ""
                    }
                    myAnswer[id - 1] += "N";
                }
            }
            if (uri.match("reading")) {
                let category = answer.split("@");
                let keys = new Array(answer.length + 1);
                answer = ""
                category[0].each(function () {
                    keys[category[0].charCodeAt(i) - 65] = "A"
                });
                category[1].each(function () {
                    keys[category[1].charCodeAt(i) - 65] = "B"
                });
                keys.each(function () {
                    if (keys[i] !== "A" && keys[i] !== "B") {
                        keys[i] = "N";
                    }
                    answer += keys[i];
                });
            }
        } else if (question.data("choiceType") == "select") {
            $(".sentence", $(`#passage`)).each(function (i) {
                if ($(this).css("fontWeight") == "700") {
                    myAnswer[index] = `${i + 1}`;
                }
            });
        } else {
            let questionDiv = $(`#question`)
            $("input:checked", questionDiv).each(function () {
                myAnswer[index] += String.fromCharCode(65 + $("input").index($(this)));
            });
        }
    }

    function showModal() {

        function saveExit() {

            function downloadResponse(url, fileName) {

                $("<a>", {
                    href: url,
                    download: fileName
                }).appendTo(testDiv)[0].click();
            }

            if (uri.match("speaking")) {
                downloadResponse(audioURL, html.replace(".html", "-recording.mp3"));
            } else if (uri.match("writing")) {
                let text = $("textarea").value.replace("\n", "</p><p>", testDiv);
                text = `<p>${text}</p>`

                let blob = new Blob([text], {
                    type: 'text/plain'
                });
                downloadResponse(window.URL.createObjectURL(blob), html);
            } else {
                let text = $("table", testDiv).outerHTML;

                let blob = new Blob([text], {
                    type: 'text/plain'
                });
                downloadResponse(window.URL.createObjectURL(blob), html);
            }
        }

        if (uri.match(/-speaking|-writing/)) {
            modal = createModal();
            p = $("<p>").appendTo(modal);
        } else {
            modal = reviewQuestions();
            // answering and correct rate

            var error = $("i", modal).length
            $("<p>", {
                class: "w3-padding w3-section"
            }).prependTo(modal).html(`<b>${myAnswer.length - error} of ${myAnswer.length}</b> answered questions are correct.`);

            $("<div>", {
                class: `${color} w3-padding`,
                html: "Review Test"
            }).prependTo(modal);
        }

        let buttonBar = $("<div>", {
            class: "w3-bar",
            id: "buttonBar"
        }).appendTo(modal);

        exitBtn = $("<button>", {
            class: `${color} w3-btn w3-margin w3-left`,
            html: "Save and Exit"
        }).appendTo(buttonBar).click(() => {
            saveExit();
            endTest();
        });
        cancelBtn = $("<button>", {
            class: `${color} w3-btn w3-margin w3-right`,
            html: "Cancel"
        }).appendTo(buttonBar).click(() => {
            modal.parent().remove();
        });

        if (uri.match("speaking")) {
            p.html($("audio", testDiv).outerHTML)
        }
        modal.parent().show();
        setStyle();
    }

    function reviewQuestions(question) {
        function checkAnswer(i) {
            let answer = $(".explanation", $(questions[i])).data("answer");
            let text = `<b>${answer}<b>`;
            let report = myAnswer[i] == answer ? text : `<i>${myAnswer[i]}</i> -> ${text}`;
            return report;
        }

        if (question) {
            setAnswer(question);
        }

        modal = createModal();
        let table = $("<table>", {
            class: "w3-table-all w3-padding-small"
        }).appendTo(modal);
        let tr = $("<tr>", {
            class: color
        }).appendTo($("<thead>").appendTo(table));
        $("<td>", {
            html: "Question"
        }).appendTo(tr);
        $("<td>", {
            html: "Option"
        }).appendTo(tr);

        let tbody = $("<tbody>").appendTo(table);
        questions.each(function (i) {

            if (myAnswer[i] == undefined) {
                myAnswer[i] = ""
            }

            tr = $("<tr>").appendTo(tbody).click(() => {
                modal.parent().remove();
                showQuestion(i + 1);
            });

            $("<td>", {
                html: $(".question", $(this)).text()
            }).appendTo(tr).css({
                maxWidth: "200px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis"
            });

            $("<td>", {
                html: question ? myAnswer[i] : checkAnswer(i)
            }).appendTo(tr);
        });

        if (question) {
            modal.parent().show();
        } else {
            return modal
        }
    }

    function showQuestion(index) {

        let question = $(`#question${index}`);

        createQuestion(question);

        inputs = $(".my-label input", testDiv);

        // Previous and Next Button
        let div = $("<div>", {
            class: "w3-bar w3-display-container w3-section "
        }).appendTo(questionDiv);
        $("<button>", {
            class: `${color} w3-btn w3-left`,
            html: "Previous"
        }).appendTo(div);

        // Time Ticking 
        time.hide();
        timer = $("<span>", {
            class: "w3-display-middle w3-xxlarge"
        }).appendTo(div);

        // Callback function to execute when mutations are observed
        var callback = () => {
            timer.html(`<b>${time.text()}</b>`);
            setStyle();
        };

        // Create an observer instance linked to the callback function
        // Start observing the target node for configured mutations
        new MutationObserver(callback).observe(time[0], {
            childList: true // Options for the observer (which mutations to observe)
        });

        $("<button>", {
            class: `${color} w3-btn w3-right`,
            html: "Next"
        }).appendTo(div);

        // show current number of all number
        let numberDiv = $("<div>", {
            class: "w3-section"
        }).appendTo(questionDiv);
        let numberP = $("<p>", {
            class: "w3-xlarge w3-center my-margin-small"
        }).appendTo(numberDiv);
        numberP.html(`<b>Questions ${index} of ${questions.length}</b>`);

        // Review Button
        $("<button>", {
            class: `${color} w3-btn w3-block`,
            id: "review",
            html: "Review Questions"
        }).appendTo(questionDiv).click(function () {
            reviewQuestions(question);
        });
        $("button", div).each(function () {
            this.onclick = () => navigateQuestion($(this), question);
        });

        if (!question.data("passage") && greFlag) { // Not Reading Comprehension
            if (!mobileFlag) {
                questionDiv.removeClass("w3-half");
                passageDiv.removeClass("w3-half");
            }
        } else { // Reading Comprehension

            if (mobileFlag) {
                questionDiv.css({
                    borderTop: `3px solid ${bgColor}`
                });
                setArticleHeight(screen.height - questionDiv[0].offsetHeight + 40 + "px");

            } else {
                setArticleHeight("680px");
                questionDiv.addClass("w3-padding w3-half");
                passageDiv.addClass("w3-half");
            }
        }

        if (!greFlag && !uri.match("test.html")) showSpecialQuestion(passageDiv, questionDiv);


        // select sentence question
        if (question.data("choiceType") == "select") {

            // split sentence with span
            addSentence(passageDiv);

            // Add sentence click event
            addFilterClick("article .sentence", ["my-highlight"]);
        }

        // click Options
        if (myAnswer[index - 1]) {
            options = myAnswer[index - 1];

            $(options.split("")).each(function () {
                if (options.length > 4) {
                    option = this.charCodeAt(0) - 65;
                    if (option !== 13) {
                        let elem = inputs[i * 2 + option].parentNode;
                        $(".my-checkbox", elem).css({
                            backgroundColor: bgColor
                        });
                        elem.children[0].checked = true;
                    }
                } else {
                    if (question.data("choiceType") == "select") {
                        $(".sentence", passageDiv)[+this - 1].click()
                    } else {
                        $("input")[this.charCodeAt(0) - 65].click();
                        if (!greFlag && section.children[1].text().length < 3) {
                            insertArea[this.charCodeAt(0) - 65].text() = section.children[0].text().split(".")[1] + ". "
                        }
                    }
                }
            });
        }
        setStyle();
    }

    $("#practice").remove();
    toggleElement();
    passageDiv = $("<article>", {
        class: "w3-half w3-section",
        id: "passage"
    }).appendTo(testDiv);
    questionDiv = $("<section>", {
        class: "w3-half",
        id: "question"
    }).appendTo(testDiv);
    time = $("<p>", {
        id: "time",
        class: "w3-xxlarge w3-center my-margin-small my-highlight"
    }).appendTo(testDiv);
    if (greFlag) {

        if (uri.match(/issue|argument/)) {
            passageDiv.html($("#question").html());
            addTextarea(questionDiv);
            waitTime(1800, showModal);
        } else {
            function getCountdown() {
                if (questions.length == 25) countdown = 2100
                else if (questions.length == 20) countdown = 1800
                else {
                    countdown = Math.ceil($('[data-passage]').length * 1.75 + $('#questions > [data-choice-type]:not([data-passage])').length * 1.25) * 60
                }
                return countdown
            }
            waitTime(getCountdown(), showModal);
            showQuestion(1);
        }
    } else if (uri.match("reading")) {

        waitTime(1200, showModal);
        showQuestion(1);

    } else if (uri.match("listening")) {
        article.toggleClass("w3-half");
        let button = $("<button>", {
            class: `${color} w3-btn w3-block w3-section w3-hide`,
            html: "Next"
        }).appendTo(testDiv);
        button.onclick = () => navigateQuestion(this);

        function showQuestion(index) {
            id = questions[index].id

            function playListening() {
                article.id = element.id;
                article.html() = $(".question", element).html()
                button.hide();
                time.hide();
                playAudio(html.replace(".html", `-${element.id}.mp3`), () => {
                    article.html(element.html());
                    inputs = $("input", testDiv);
                    button.classList.remove("w3-hide");
                    time.classList.remove("w3-hide");
                    setStyle();
                });
            }

            if ($(questions[index]).hasClass("replay")) {
                article.html() = "<p>Listen again to part of the lecture. Then answer the question.</p>"
                button.hide();
                time.hide();
                playAudio(html.replace(".html", `-${element.id}-replay.mp3`), () => playListening());
            } else {
                playListening();
            }

        }

        playAudio(html.replace(".html", ".mp3"), () => {
            setTimer(240);
            showQuestion(1);
        })

    } else if (uri.match("speaking")) {
        if (uri.startsWith("file:/")) {
            mediaRecorder = recordAudio();
        }

        article.toggleClass("w3-half w3-section");

        playListening = () => {
            article.toggle();
            time.toggle();
            playAudio(html.replace(".html", ".mp3"), playQuestion);
        }
        playQuestion = () => {
            article.html($("#question", main).html());
            article.classList.remove("w3-hide");
            playAudio(html.replace(".html", "-question.mp3"), startPreparation);
        }
        startPreparation = () => playAudio("../../speaking_beep_prepare.mp3", waitPreparation);
        waitPreparation = () => {
            time.classList.remove("w3-hide");
            waitTime(seconds[1][Math.ceil(num / 2) - 1], startSpeak);
        }
        startSpeak = () => playAudio("../../speaking_beep_answer.mp3", waitSpeak);
        waitSpeak = () => {
            if (uri.startsWith("file:/")) {
                mediaRecorder.start();
                waitTime(seconds[0][Math.ceil(num / 2) - 1], () => {
                    mediaRecorder.stop();
                    waitTime(1, showModal);
                });
            } else {
                var handleSuccess = stream => {
                    var audio = document.createElement('audio');
                    if (window.URL) {
                        audio.src = window.URL.createObjectURL(stream);
                    } else {
                        audio.src = stream;
                    }
                    audio.setAttribute('controls', 'controls');
                    testDiv.appendChild(audio);
                };

                navigator.mediaDevices.getUserMedia({
                    audio: true
                }).then(handleSuccess);
            }
        }

        if (num < 3) {
            playQuestion();
        } else if (num > 4) {
            playListening();
        } else {
            playAudio(html.replace(".html", "-reading.mp3"), () => {
                article.html() = reading.html()
                waitTime(45, playListening);
            });
        }
    } else if (uri.match("writing")) {
        addTextarea(section);
        if (num == 1) {
            article.html() = reading.html()
            waitTime(180, endReading);

            function playListening() {
                playAudio(html.replace(".html", ".mp3"), waitWriting);
            }

            function endReading() {
                wordCountDiv.toggle();
                article.toggle();
                playListening();
            }

            function waitWriting() {
                article.toggle();
                wordCountDiv.toggle();
                waitTime(1200, showModal);
            }

        } else {
            article.html($("#question", main).html());
            waitTime(1800, showModal);
        }
    }
    setStyle();
}

// Add Category Filter for test set page
function addCategoryFilter() {

    let length;

    if (setFlag) {
        length = 1;
    } else {
        let number = $("#number");
        if (number.length > 0) {
            length = +number.text();
        } else {
            length = 4;
        }
    }
    var sets = html;

    setsDiv = $("<div>", {
        id: "setsDiv"
    }).prependTo(main);

    // add sets
    for (let i = 1; i <= length; i++) {
        let number = (i < 10 && !html.includes("og") ? `0${i}` : i);
        set = setFlag ? sets : sets + number;
        div = $("<div>", {
            class: "w3-bar w3-section"
        }).appendTo(setsDiv).css({
            fontSize: () => {
                if (!setFlag) return "13px"
                if (!mobileFlag) return "14px"
            }
        });
        if (!setFlag) {
            $("<span>", {
                class: "w3-bar-item w3-btn w3-padding-small my-color",
                html: set.toUpperCase()
            }).appendTo(div);
        }

        $(sections).each(function () {
            addDropDown(this.type, this.length, div);
        });
    }

    if (setFlag) { // Add category Button
        $(categories[html.match(/\w+(?=\d$)/)]).each(function () {
            let category = this.category
            $(this.links).each(function () {
                if (this.toString().match(html)) {
                    tag = category;
                }
            });
        });
        href = `../${uri.split("/").slice(-3)[0]}.html`
        categoryBtn = $("<a>", {
            class: `${color} w3-btn w3-section`,
            href: href,
            html: `${tag}`
        }).appendTo(div).addClass(() => {
            if (mobileFlag) return 'w3-left'
        }).click(() => {
            tag = {
                tag: tag,
                href: html
            }
            sessionStorage.setItem("tag", JSON.stringify(tag));
        });

        if (testFlag) testBtn = $("<button>", {
            class: `${color} w3-btn w3-section w3-right`,
            id: "test",
            html: "Test"
        }).appendTo(div);


    } else { // Add Category tags
        function filterSet(category) {

            // hide sets
            $("#setsDiv > div").each(function () {
                $(this).hide()
            });

            let setDiv = $("#setDiv");
            if (setDiv.length <= 0) {
                setDiv = $("<div>", {
                    class: "w3-section",
                    id: "setDiv"
                }).prependTo($("#setsDiv"));
            }

            setDiv.show();
            setDiv.html("");

            $("#setsDiv a").each(function () {
                if (category.links.includes(this.href.split("/").splice(-1)[0])) {
                    innerText = `${this.href.split("/").slice(-2)[0].toUpperCase()}  ${$(this).text()}`;
                    $("<a>", {
                        class: `${color} w3-left w3-button w3-padding-small my-margin-small`,
                        href: this.href,
                        html: innerText
                    }).appendTo(setDiv);
                }
            })
        }

        categoryDiv = $("<div>").prependTo(main).css({
            fontSize: () => {
                if (mobileFlag) return "13px"
            }
        });

        div = $("<div>", {
            class: "w3-bar w3-card my-color"
        }).appendTo(categoryDiv);

        // sections category
        $(sections).each(function () {
            button = $("<button>", {
                class: "w3-bar-item w3-button w3-col l2 my-color w3-hide w3-show",
                html: this.type
            }).appendTo(div).removeClass(() => {
                if (mobileFlag) return "l2"
            }).addClass(() => {
                if (mobileFlag) return "w3-padding-small"
            }).click(function () {
                categoryDiv.html("");
                $(categories[$(this).text().toLowerCase()]).each(function () {
                    createTag(this.category, categoryDiv, () => {
                        filterSet(this)
                    });
                });
                addFilterClick("#tagsDiv button", ["my-highlight", "w3-text-white", color], tagsDiv);
            });
        });

        let searchBtn = $("#searchBtn", main);
        if (!searchBtn) searchBtn = createSearchBtn(div, "w3-bar-item w3-button w3-right w3-padding-small", filterNodes);

        categoryDiv = $("<div>", {
            id: "tagsDiv",
            class: "w3-padding-small w3-card w3-white"
        }).appendTo(categoryDiv);

        var tag = sessionStorage.tag;

        if (tag) {
            tag = JSON.parse(sessionStorage.tag);
            $(sections).each(function (i) {
                var button = $($("div .w3-bar-item.w3-button")[i]);
                if (tag.href.match(button.text().toLowerCase())) {
                    button.click();
                    categoryDiv.children().each(function () {
                        if (tag.tag == $(this).text()) {
                            this.click();
                            sessionStorage.removeItem("tag");
                        }
                    });
                }
            });
        }
    }

}

function createQuestion(question) {
    var questionDiv = $(`#question`).html("");
    var passageDiv = $(`#passage`).html("");

    // Show Reading Comprehension question related passage if exist
    if (greFlag) {
        passageDiv.html($(`#${question.data("passage")}`).html());
        if ($(`span[data-question="${question[0].id}"]`).length > 0)
            addHighlight($(`span[data-question="${question[0].id}"]`));

    } else {
        passageDiv.html($(".passage").html());
    }

    $("<div>", {
        html: $(".question", question).html()
    }).appendTo(questionDiv);


    // Decide choice type based on question type
    let choiceType = question.data("choiceType");
    let choicesDiv = $("<div>").appendTo(questionDiv);

    let choices = $(".choices", question) // Choices in one question
    // Update choices
    choices.each(function (i) {
        //choice = $(this)
        // $(this).hide();
        choiceDiv = $("<div>", {
            class: "w3-padding-small w3-left"
        }).appendTo(choicesDiv);

        $(this).children().each(function () {
            createChoiceInput(choiceDiv, choiceType, $(this).text(), choiceType + i)
        });
    });
}

function addSentence(article) {
    let passage = article.html().replace(". . . ", "&#8230; ")
    passage = passage.replace(/\s{2,}</g, "<")
    passage = passage.replace(/(\w{2,}[?!\.])\s{1}/g, `$1</span><span class="sentence"> `)
    passage = passage.replace(/<p>/g, `<p><span class="sentence"> `)
    passage = passage.replace(/<\/p>/g, "</span></p>")
    article.html(passage);
    return article;
}

function updateQuestionUI() {

    function showQuestion(article) {

        let div = $("<div>", {
            class: "w3-section",
            id: "practice"
        }).appendTo(main);
        var pageBar = $("<div>", {
            class: "w3-bar"
        }).appendTo(div);
        $("<div>", {
            class: "my-passage",
            id: "passage",
        }).appendTo(div);
        var questionDiv = $("<div>", {
            id: "question"
        }).appendTo(div);

        questions.each(function (i) {
            $("<button>", {
                class: `${color} my-page`,
                html: i + 1
            }).appendTo(pageBar).click(function () {
                let id = `question${$(this).text()}`;
                let question = $(`#${id}`);

                createQuestion(question);

                let div = $("<div>", {
                    class: "w3-bar"
                }).appendTo(questionDiv) // this div is for button to display in block

                $("<button>", {
                    class: `${color} w3-btn`,
                    html: "Show Answer"
                }).appendTo(div).click(function () {
                    var explanation = $(".explanation", question);
                    var answers = explanation.data("answer");
                    explanation = $("<div>", {
                        html: `<p><b>${answers}</b></p>` + explanation.html()
                    }).appendTo($(`#question`));

                    $("em, i", explanation).each(function () {
                        addHighlight($(this))
                    });

                    // Click Choices
                    if (answers.length > 9) {
                        article = addSentence($("#passage"));
                        var index;
                        $(".sentence", article).each(function (i) {
                            if ($(this).text().includes(answers)) {
                                index = i;
                                return;
                            }
                        });
                        addHighlight($($(".sentence", article)[index]));
                    } else {
                        $(answers.split("")).each(function (i) {
                            let replacement;
                            let option = $("#question input").eq(this.charCodeAt(0) - 65);
                            if ($("#question input").attr('type') == "checkbox" && i == 0)
                                replacement = `${option.parent().text().replace(/^[A-I] /, "")}/_`;
                            else
                                replacement = option.parent().text().replace(/^[A-I] /, "");
                            $('#question :first-child p').html($('#question :first-child p').html().replace(/_+/, `<b>${replacement}</b>`))
                            option[0].click();
                        });
                    }

                    setStyle();

                }) //[0].click();

                if (!greFlag && !uri.match("test.html")) showSpecialQuestion(article, questionDiv);
                addWord();
                setStyle();
            });
        });
    }

    questions = $("#questions [id^='question']");
    var audio = $("audio", main);
    if (audio.length > 0) {
        audio[0].src = `${mediaRoot}/audio/toefl/${html.match(/[a-z]+/)}/${html.match(/\w+/)}/${html}.mp3`
    }
    if ($("#questions").length > 0) { // Update Verbal Reasoning UI
        // audio lyrics
        if (audio.length > 0 && uri.match("listening")) {

            //let listening = $("article.passage", main);
            //setArticleHeight(listening, screen.height - audio.offset().top - 160 + "px")

            var times = $(".time", main).hide();
            var n = 0;
            if (times.length > 0) {
                audio[0].ontimeupdate = () => {
                    let time = $(times[n]);
                    let duration = parseFloat(time.data("times")) + parseFloat(time.data("time"));
                    let parent = time.parent()
                    time[0].scrollIntoView()
                    if (parseFloat(audio[0].currentTime.toFixed(2)) <= duration) {
                        //screen.scrollTop(parent.offset().top - 320);
                        addHighlight(parent);
                    } else {
                        removeHighlight(parent);
                        n++;
                    }
                };
            }
        }

        $(`#questions`).hide();
        showQuestion($("article.passage", main));


    } else { // Update Speaking and Writing
        var responses = $(".response", main)
        if (responses.length > 1) {
            //$("#question").toggle()
            div = $("<div>").appendTo(main);
            pageBar = $("<div>", {
                class: "w3-bar"
            }).appendTo(div);
            responseDiv = $("<div>", {
                id: "responseDiv"
            }).appendTo(div);
            //setArticleHeight(div);
            responses.each(function (i) {
                $("<button>", {
                    class: `${color} w3-bar-item w3-button`,
                    html: `${i+1}`
                }).appendTo(pageBar).click(function () {
                    responseDiv.html(responses.eq(i).html())
                });
            });
        }
        /**
         * response = $("#response");
        question = $("#question");
        setArticleHeight(response);

        if (response) {
            question.toggle();
            questionDiv = $("<div>").appendTo(response, true);
            questionDiv.html(question.html());
        }

        listening = $("#listening-text");
        if (listening) {
            audio = $("audio");
            newAudio = $("<audio>",{
                controls: true
            }).appendTo(listening, true);
            newAudio.outerHTML = audio.outerHTML;
            audio.toggle();
        }
        setArticleHeight(listening);
        setArticleHeight($("#reading-text"));
         */
    }

    setStyle();
}