if (location.hash.includes('ref=cdext')) {
    const onDictionaryChanged = (event) => {
        chrome.runtime
            .sendMessage({action: "dictionaryChanged", data: event.target.value})
            .then((response) => {
                window.location.href = response.result;
            });
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