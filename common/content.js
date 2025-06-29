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
                    document.querySelector("#button_rate_addon").addEventListener('click', () => {
                        console.log("User agent")
                        const ua = navigator.userAgent.toLowerCase();
                        console.log(ua)
                        let url = "#";
                        if (ua.includes("chrome")) { // Chrome
                            url = "https://chromewebstore.google.com/detail/cambridge-dictionary/pobhkelhalpmkbblgepmhbojnpgbcbpc/reviews";
                        } else { // Firefox
                            url = "https://addons.mozilla.org/en-US/firefox/addon/cambridge-dictionary-english/reviews/";
                        }
                        window.open(url, '_blank');
                    });

                    document.querySelector("#cdext_selector").value = readStorageResponse.result.selectedDictionary ?? "english";
                    document.querySelector("#cdext_selector").addEventListener("change", onDictionaryChanged);
                    document.querySelector('#button_change_font_size').addEventListener('click', onFontSizeToggled)
                    
                    // Add event listener for the toggle button
                    const toggleButton = document.querySelector('.app-ad-toggle');
                    const adBlock = document.getElementById('app-ad-block');
                    
                    // Read toggle state from localStorage (default is open)
                    const isCollapsed = localStorage.getItem('cdext-ad-collapsed') === 'true';
                    if (isCollapsed && adBlock) {
                        adBlock.classList.add('collapsed');
                    }
                    
                    if (toggleButton) {
                        toggleButton.addEventListener('click', function() {
                            if (adBlock) {
                                adBlock.classList.toggle('collapsed');
                                // Save the new state to localStorage
                                const nowCollapsed = adBlock.classList.contains('collapsed');
                                localStorage.setItem('cdext-ad-collapsed', nowCollapsed.toString());
                            }
                        });
                    }
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
}