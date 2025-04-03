if (location.hash.includes('ref=cdext')) {
    const initialFontSize = 16;
    const maxFontSize = 26;
    const fontSizeStep = 2;
    let contentElements = null;
    const originalFontSizes = []; // Store original font sizes

    const onDictionaryChanged = (event) => {
        chrome.runtime
            .sendMessage({action: "dictionaryChanged", data: event.target.value})
            .then((response) => {
                window.location.href = response.result;
            });
    };

    const onFontSizeToggled = (event) => {
        readFontSize((response) => {
            const settings = response.result;
            let fontSize = settings.fontSize ?? initialFontSize;

            fontSize += fontSizeStep;

            if (fontSize > maxFontSize) {
                fontSize = initialFontSize;
            }

            applyFontSize(fontSize);

            chrome.runtime.sendMessage({action: "updateFontSize", data: fontSize});
        })
    };

    const readFontSize = (callback) => {
        chrome.runtime
            .sendMessage({action: "requestSettings"})
            .then(callback);
    }

    const getFontSizeIndex = (selectedSize) => {
        if (selectedSize < initialFontSize || selectedSize > maxFontSize) {
            return -1; // Size is out of range
        }

        return Math.floor((selectedSize - initialFontSize) / fontSizeStep);
    };

    const applyFontSize = (fontSize) => {
        document.querySelector('#button_change_font_size_tooltiptext').innerText = 'Toggle font size : ' + getFontSizeIndex(fontSize)

        contentElements.forEach((element, index) => {
            if (fontSize === initialFontSize) {
                element.style.fontSize = originalFontSizes[index] // this is like `24px`, no need to add `px` postfix
            } else {
                element.style.fontSize = `${fontSize}px`
            }
        })
    };

    const style = document.createElement("style");
    style.innerHTML = `
    body {
        width: 420px !important;
    }
    `
    document.head.appendChild(style);

    chrome.runtime.sendMessage({action: "readToolbar"})
        .then((readToolbarResponse) => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = readToolbarResponse.result.html;
            document.body.appendChild(wrapper);

            chrome.runtime.sendMessage({action: "readStorage", data: "library"})
                .then((readStorageResponse) => {
                    document.querySelector("#cdext_selector").value = readStorageResponse.result.selectedDictionary ?? "english";
                    document.querySelector("#cdext_selector").addEventListener("change", onDictionaryChanged);
                    document.querySelector('#button_change_font_size').addEventListener('click', onFontSizeToggled)
                    contentElements = document.querySelectorAll("#page-content *");
                    contentElements?.forEach(element => {
                        originalFontSizes.push(getComputedStyle(element).fontSize);
                    });
                    readFontSize((response) => {
                        const settings = response.result;
                        const fontSize = settings.fontSize ?? initialFontSize;
                        applyFontSize(fontSize);
                    });
                });
        });
} else {
    document.body.addEventListener('mouseup', function (event) {
        chrome.runtime.sendMessage({action: "wordSelected", data: document.getSelection().toString()});
    });

    document.addEventListener('keydown', function (e) {
        if (
            (e.ctrlKey && e.altKey && e.key === 'D') ||
            (e.ctrlKey && e.shiftKey && e.key === 'D')
        ) {
            const selectedWord = window.getSelection().toString();
            chrome.runtime.sendMessage({action: "lookUpInNewWindow", data: selectedWord});
        }
    });
}