Window.words = [];

function playSound(word) {
    var playFlag = false;
    $("<audio>", {
        src: `https://s3.amazonaws.com/audio.oxforddictionaries.com/en/mp3/${word}_us_1.mp3`
    }).appendTo(main).on('error', function () {
        playFlag = false
        let src = this.src
        if (src.match("us_1"))
            this.src = src.replace("us_1", "us_2")
        else if (src.match("us_2"))
            this.src = src.replace("us_2", "us_3")
        else if (src.match("us_3"))
            this.src = `https://www.collinsdictionary.com/us/sounds/e/en_/en_us/en_us_${word}_2.mp3`
        else
            this.src = `https://www.collinsdictionary.com/us/sounds/e/en_/en_us/en_us_${word}_1.mp3`
        this.play()
    }).on('canplay', function () {
        playFlag = true
    })[0].play()
    return playFlag;
}

function addSound(word, parent) {

    return $("<img>", {
        src: `${icons8}/metro/20/${rgb2hex(bgColor)}/speaker.png`,
        class: "w3-padding-small my-button"
    }).appendTo(parent).click(() => playSound(word));
}

function addWordModal(word, parent) {

    let wordDiv = $("<div>", {
        class: "w3-left w3-col l2"
    }).appendTo(parent);

    $("<div>", {
        class: "w3-card w3-center w3-border w3-large my-button",
        html: `<b>${word.word}</b>`
    }).appendTo(wordDiv).click(() => {
        $("<div>", {
            class: "w3-left"
        }).appendTo(main).css({
            height: "100%"
        }).css({
            cursor: "pointer"
        })
        showWordModal(word)

    });
    setStyle();
    return wordDiv
}

function showWordModal(word, target) {

    var details = Object.keys(word)
    var modal = createModal();

    // title bar
    let bar = $("<div>", {
        class: `${color} w3-bar`
    }).appendTo(modal).css({
        top: () => {
            if (mobileFlag) return "-52px"
        }
    }).addClass(() => {
        if (mobileFlag) return "my-sticky"
    });
    $("<span>", {
        class: "w3-left my-button my-padding",
        html: "Word Details"
    }).appendTo(bar).css({
        cursor: "pointer"
    });
    $("<span>", {
        class: "w3-right my-button my-padding",
        html: "X"
    }).appendTo(bar).click(() => {
        modal.parent().remove();
    });

    // word content div
    let div = $("<div>", {
        class: "my-margin",
        id: `${word.word}`
    }).appendTo(modal);
    var termDiv = $("<div>", {
        class: "w3-xlarge w3-center",
        html: `<b>${word.word}</b>`
    }).appendTo(div);

    addSound(word.word, termDiv).click();
    
    if (target) {
        $("<a>", {
            class: "w3-medium w3-center my-link",
            href: `https://en.oxforddictionaries.com/definition/us/${target}`,
            html: `<b>[${target}]</b>`
        }).appendTo(termDiv);
    }

    // details
    $(details).filter(function () {
        return !this.match(/word/)
    }).each(function () {
        let detailDiv = $("<div>", {
            class: "w3-padding-small"
        }).appendTo(div);

        detailDiv.html(`${detailDiv.html()}<h4>${this}</h4>${word[this]}`)

        if (this == "examples") {
            $("p", detailDiv).each(function () {
                var sentence = $(this)
                $(sentence.text().split(" ")).each(function () {
                    element = this.replace(/\W/g, "")
                    if (word.family.match(`<li>${element}<`)) {
                        sentence.html(sentence.html().replace(element, `<b>${element}</b>`))
                    }
                });
            });
        } else if (this == "synonyms") {

            $("div", detailDiv).each(function () {
                $(this).addClass("w3-section");
                let link = $(this).hasClass('exs') ? "https://en.oxforddictionaries.com/definition/us/" :
                    "https://www.thefreedictionary.com/"
                $(this).html($(this).html().replace(/(\w{3,})/g, `<a class="my-link" href="${link}$1">$1</a>`))
            });
        } else if (this == "family") {

            $("li", detailDiv).each(function () {
                let a = $("<a>", {
                    class: "my-link",
                    href: (`https://en.oxforddictionaries.com/definition/us/${this.childNodes[0].textContent}`),
                    text: this.childNodes[0].textContent
                }).prependTo($(this));
                this.childNodes[1].textContent = ""
                if (target == this.childNodes[0].textContent) addHighlight(a);
            });
        } else if (this == "etymology") {
            detailDiv.html(detailDiv.html().replace(/\u2018(.*?)\u2019/g, `<b>$1</b>`))
        } 

    });

    addWord();

    $("<button>", {
        class: `${color} w3-btn w3-bar w3-padding-small w3-section`,
        html: "close"
    }).appendTo(div).click(() => modal.parent().remove());
    setStyle();

    let words = sets.find(set => set.words.find(item => item.word.match(word.word))).words;
    let index = words.indexOf(word);
    let width = (screen.width - modal.width()) / 2;
    let buttons = ["left", "right"];
    $(buttons).each(function () {
        $("<div>", {
            class: `w3-${this}`,
        }).prependTo(modal).css({
            height: "100%",
            width: width,
            position: "fixed",
            cursor: "pointer"
        }).css(`${this}`, 0).click(function () {
            modal.parent().remove();
            if ($(this).hasClass("w3-left")) {
                if (index > 0) showWordModal(words[--index])
            } else {
                if (index < words.length - 1) showWordModal(words[++index])
            }
        });
    });
}

function filterWord(value) {
    $("#words").html("");
    if (!value) return;
    $(sets).each(function () {
        $(this.words).each(function () {
            let flag = false
            $($.parseHTML(this.synonyms)).each(function () {
                flag = $(this).text() && $(this).text().split(",").indexOf(value) > 0
                if (flag) return;
            })
            if (this.word.match(value) || flag) addWordModal(this, $("#words"));
        });
    });
}

function createWordSets() {
    let div = $("<div>", {
        class: "w3-bar",
    }).appendTo(main);

    div = $("<div>", {
        class: `w3-bar w3-center w3-section`
    }).appendTo(main);

    createSearchBtn(mobileFlag ? main : div, `${color} my-search w3-padding w3-left`, filterWord)

    $("#topNav .my-padding").each(function () {
        if ($(this).html().match("Notes")) return
        $("<button>", {
            class: `${color} w3-bar-item w3-button my-padding w3-section w3-large w3-left`,
            html: $(this).html()
        }).appendTo(div).click(() => {
            $("div.my-margin").remove();
            $("#words").remove();
            createNavigation($(this).html().toLowerCase());
        });
    });

    setStyle();
}

function createWordTest(set) {

    // Confirm Action like "Exit"
    function showConfirmModal(type) {
        var modal = createModal();

        $("<div>", {
            class: `${color} w3-padding`,
            html: `Confirm ${type}`
        }).appendTo(modal);
        let p = $("<p>", {
            class: "w3-padding w3-section"
        }).appendTo(modal);

        // answering and correct rate
        p.html(`Do you really want to ${type}?`)

        let buttonBar = $("<div>", {
            class: "w3-bar",
            id: "buttonBar"
        }).appendTo(modal);
        yesBtn = $("<button>", {
            class: `${color} w3-btn w3-margin w3-left`,
            html: "Yes"
        }).appendTo(buttonBar).click(() => showReviewModal());;
        noBtn = $("<button>", {
            class: `${color} w3-btn w3-margin w3-right`,
            html: "No"
        }).appendTo(buttonBar).click(() => modal.parent().remove());

    }

    function showReviewModal() {
        var modal = createModal();

        $("<div>", {
            class: `${color} w3-padding`,
            html: "Review Test"
        }).appendTo(modal);
        let p = $("<p>", {
            class: "w3-padding w3-section"
        }).appendTo(modal);
        let div = $("<div>", {
            class: "w3-padding-small"
        }).appendTo(modal);

        // answering and correct rate
        p.html(`You have <b>answered ${wordCount * 2 - indexes.length}</b> of ${wordCount * 2} questions, <b>${wordCount * 2 - indexes.length - error} of ${wordCount * 2 - indexes.length}</b> answered questions are correct.`)

        // forgotten words
        $(forgottenWords).each(function () {
            addWordModal(this, div);
        });

        $("<button>", {
            class: `${color} w3-btn w3-padding w3-margin-top w3-bar`,
            html: "Exit"
        }).appendTo(modal).click(() => {
            modal.parent().remove();
            toggleElement();
            $("#testDiv").remove();
        });
        setStyle();
    }

    function showQuestion(set) {

        /** 
         * create question index array "0,0","0,1", ... , "0, n-1", "1,0", ... , "1, n-1"
         * randomly pop item from array 
         * if no item left, show review
         * show current number of all number  
         */

        function popRandom(array) {
            // randomly sway a element with the last one which will be pop soon.
            var random = getRandom(array.length);
            [array[random], array[array.length - 1]] = [array[array.length - 1], array[random]];
            return array.pop(); // pop last index object from indexes
        }

        // create question index array "0,0","0,1", ... , "0, n-1", "1,0", ... , "1, n-1"
        $("body").scrollTop(0);
        var words = set.words;
        wordCount = words.length;
        if (!indexes) {
            indexes = new Array(wordCount * 2);
            indexes = $(indexes).map((i) => {
                detail = i < wordCount ? "definitions" : "synonyms";
                return {
                    word: words[i % wordCount].word,
                    detail: detail
                }
            }).get();
        }

        // randomly pop item from array
        if (indexes.length == 0) {
            showReviewModal(set);
            return;
        }

        var index = popRandom(indexes);
        var detail = index.detail;
        var word = words.find(element => element.word == index.word);


        // show current number of all number
        numberP.html(`<b>Questions ${(wordCount * 2) - indexes.length} of ${wordCount * 2}</b>`)

        // show detail
        detailDiv.html(`<b>${word.word}</b>`).addClass("w3-large") // questions is word)
        addSound(word.word, detailDiv).click();

        var optionsLength = 4;
        var paragraphs = [];
        options = new Array(optionsLength);
        answers = new Array(optionsLength);

        $($.parseHTML(word[detail])).each(function () {
            if ($(this).html()) paragraphs.push(this)
        });

        // add random options from details
        $(options).each(() => {
            if (paragraphs.length) {
                do {
                    random = getRandom(options.length);
                } while (options[random])
                options[random] = paragraphs.pop();
                answers[random] = random;
            } else {
                do {
                    random = getRandom(words.length);
                } while (words[random].word == word.word)
                let choices = $.parseHTML(words[random][detail]);
                do {
                    random = getRandom(choices.length);
                } while (options.includes(choices[random]) || !$(choices[random]).html())
                options[options.findIndex(o => typeof o == "undefined")] = choices[random];
            }
        })

        // show options
        optionDiv.html("")
        $(options).each(function () {
            createChoiceInput(optionDiv, "checkbox", $(this).html());
        });

        // add check-next button
        $("<button>", {
            class: `${color} w3-btn w3-padding w3-section w3-left`,
            html: "Check"
        }).appendTo(optionDiv).click(function () {
            var btn = $(this)
            if ($(this).text() == "Next") showQuestion(set);

            var labels = $(".my-label", optionDiv);
            var flag;

            labels.each(function (i) {
                let input = $("input:checked", $(this));

                // add word and sound
                if (btn.text() == "Check" && answers[i] == null) {
                    let word = words.find(w => w[detail].includes($(options[i]).html()))
                    $("<b>", {
                        html: ` [${word.word}]`
                    }).appendTo($(this)).click(() => showWordModal(word));
                }

                if (input.length && answers[i] == null || !input.length && answers[i] != null) {
                    // add forgotten word to array
                    if (!forgottenWords.includes(word)) {
                        forgottenWords.push(word);
                    }
                    flag = true;
                }
            });

            detailDiv.click(() => showWordModal(word));
            if ($(this).text() == "Check" && flag) error++;
            $(this).text("Next");
            setStyle();
        });

        $("<button>", {
            class: `${color} w3-button w3-padding w3-section w3-right`,
            html: "Exit"
        }).appendTo(optionDiv).click(() => showConfirmModal("Exit"));

        setStyle();
    }

    var testDiv = $("<div>", {
        id: "testDiv",
        class: "w3-container"
    }).appendTo($("body"));
    var numberDiv = $("<div>", {
        class: "w3-section"
    }).appendTo(testDiv);
    var numberP = $("<p>", {
        class: "w3-large w3-center my-margin-small"
    }).appendTo(numberDiv);
    var detailDiv = $("<div>", {
        class: "show-article w3-section"
    }).appendTo(testDiv);
    var optionDiv = $("<div>", {
        class: " w3-section"
    }).appendTo(testDiv);
    var indexes; // vocabulary set indexes for random selection (n-1,0)
    var wordCount; // word count in specific vocabulary set
    var error = 0; // error count
    var forgottenWords = []; // wrong word you select in the test and correct word you didn't select

    toggleElement();
    showQuestion(set);
}

function addWord() {
    //let name = html.replace(/-verbal\d*.html/, "")
    //let regexp = new RegExp(name.replace("-verbal", ""), "i");
    //words = sets.find(set => set.name.match(regexp));

    $(sets).each(function () {
        words = this.words
        $(".my-label span, .passage, #question p, .exs, .syn", main).each(function () {
            let content = $(this);
            $(content.html().match(/\w{3,}/g)).each(function () {
                let word = words.find(word => word.family.match(`<li>${this}<`));
                if (word && $(`#${this}`).length <= 0) {
                    let regexp = new RegExp(`${this}(?!")`)
                    content.html(content.html().replace(regexp, `<b id="${this}">${this}</b>`))
                    Window.words.push({word:word, id:this})
                    if ($(`#${this}`).parent()[0].tagName == 'A') 
                        $(`#${this}`).unwrap();
                }
            });
            
        })
        $(`b[id]`).click(function () {
            let id = this.id
            let word = Window.words.find(word => word.id == id);
            if (word) {
                var div = $(`div#${word.word.word}`)
                if (div.length <= 0) {
                    showWordModal(word.word, $(this).text());
                }
                else {
                    $('.w3-modal').hide();
                    div.parent().parent().show();
                    //$('img', div)[0].click();
                }
            }
        }).css({cursor:'pointer'})
    })
}

function createListening(set) {

    var modal = createModal();

    // title bar
    let bar = $("<div>", {
        class: `${color} w3-bar`,
        id: "word"
    }).appendTo(modal);
    $("<span>", {
        class: "w3-left my-button my-padding",
        html: "Sounds"
    }).appendTo(bar);
    $("<span>", {
        class: "w3-right my-button my-padding",
        html: "X"
    }).appendTo(bar).click(() => {
        modal.parent().remove();
    });

    // word content div
    var div = $("<div>", {
        class: "my-margin"
    }).appendTo(modal);

    var progressDiv = $("<div>", {
        class: "w3-center w3-round-xlarge w3-text-white my-color"
    }).appendTo($("<div>", {
        class: "w3-gray w3-round-xlarge my-margin"
    }).appendTo(div));

    var wordDiv = $("<div>", {
        class: "w3-padding-small"
    }).appendTo(div);

    function timer(ms) {
        return new Promise(res => setTimeout(res, ms));
    }

    async function play(words) {

        for (var i = 0; i < words.length; i++) {
            $(wordDiv).html("")
            addWordModal(words[i], $(wordDiv)).removeClass("w3-col l2 w3-left");
            let playFlag = playSound(words[i].word);
            //while (!playFlag) { }
            progressDiv.html(`${i+1}/${words.length}`).width(`${(i+1)/words.length*100}%`)
            await timer(2000);
        }
    }

    while ($(".w3-modal").length > 1) {
        play(set.words);
        while (!$(".w3-text-white").text().match(/^(\d+).\1$/)) {}
    }
    play(set.words);

}