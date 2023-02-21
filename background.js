function onCreated() {
    if (browser.runtime.lastError) {
        console.log(`Error: ${browser.runtime.lastError}`);
    } else {
        console.log("Created successfully");
    }
}

function onRemoved() {
    console.log("Removed successfully");
}

function onError(error) {
    console.log(`Error: ${error}`);
}

browser.contextMenus.create({
    id: "word-selection",
    title: "Look up in Cambridge Dictionary",
    contexts: ["selection"]
}, onCreated);


let clickHandler = (info, tab) => {
    switch (info.menuItemId) {
        case "word-selection":
            let selectedWord = info.selectionText;
            let url = 'https://dictionary.cambridge.org/dictionary/english/' + selectedWord;
            browser.tabs.create({
                url: url
            });
            break;
        default:
            console.log("Unsupported menu item")
            break;
    }
};

if (browser.contextMenus.onClicked.hasOwnProperty('addEventListener') === true) {
    browser.contextMenus.onClicked.addEventListener('click', clickHandler);
} else {
    browser.contextMenus.onClicked.addListener(clickHandler);
}
