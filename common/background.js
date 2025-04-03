import storageService from "./services/storageService.js";
import stringService from "./services/stringService.js";
import dictionaryService from "./services/dictionaryService.js";
import browserService from "./services/browserService.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "wordSelected":
            return Promise.resolve(handleWordSelection(message.data));

        case "readToolbar":
            readToolbar().then((result) => {
                sendResponse({result});
            });
            return true;

        case "readStorage":
            storageService.get("library").then((result) => {
                sendResponse({result});
            });
            return true;

        case "dictionaryChanged":
            handleDictionaryChange(message.data).then((result) => {
                sendResponse({result});
            });
            return true;

        case "lookUpInNewWindow":
            handleNewWindowLookUp(message.data).then(() => {
                sendResponse(true);
            });
            return true;

        case "requestSettings":
            storageService.get("settings").then((result) => {
                sendResponse({result});
            });
            return true;

        case "updateFontSize":
            updateSettings(message.data).then(() => {
                sendResponse(true);
            })
            return true;

        default:
            return false;
    }
});

const handleDictionaryChange = async (dictionary) => {
    await storageService.set("library", "selectedDictionary", dictionary);

    const libraryStorage = await storageService.get("library");
    return dictionaryService.getDictionaryUrl(dictionary, libraryStorage.selectedWord);
};

const handleNewWindowLookUp = async (word) => {
    await handleWordSelection(word);

    const libraryStorage = await storageService.get("library");

    let url = "";
    if (libraryStorage.selectedWord === "") {
        url = chrome.runtime.getURL("sources/popup.html");
    } else {
        url = dictionaryService.getDictionaryUrl(libraryStorage.selectedDictionary ?? "english", libraryStorage.selectedWord);
    }

    await browserService.openNewWindow(url);
};

const handleWordSelection = async (word) => {
    const safeWord = stringService.safeString(word);
    if (safeWord === "") {
        await storageService.set("library", "selectedWord", "");

        chrome.contextMenus.update("lookupCambridge", {
            title: `Look up in Cambridge Dictionary`
        });
    } else {
        await storageService.set("library", "selectedWord", safeWord);

        chrome.contextMenus.update("lookupCambridge", {
            title: `Look up “${word}” in Cambridge Dictionary`
        });
    }
};

const readToolbar = async () => {
    const url = chrome.runtime.getURL("sources/toolbar.html");
    const result = await fetch(url).then(res => res.text())

    return {
        html: result
    };
}

const updateSettings = async (fontSize) => {
    await storageService.set("settings", 'fontSize', fontSize);
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "lookupCambridge",
        title: "Look up in Cambridge Dictionary",
        contexts: ["page", "selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "lookupCambridge") {
        await handleNewWindowLookUp(info.selectionText ?? "");
    }
});

const isChrome = navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Firefox");
if (!isChrome) {
    chrome.commands.onCommand.addListener(async (command) => {
        if (command === "look_up_word") {
            chrome.tabs.query({active: true, currentWindow: true}, async (tabs) => {
                if (tabs.length > 0) {
                    const activeTab = tabs[0];
                    const url = activeTab.url;

                    if (url.includes("#ref=cdext")) {
                        return;
                    }

                    const tabId = activeTab.id;

                    chrome.scripting.executeScript({
                        target: {tabId},
                        func: () => window.getSelection().toString()
                    }, (results) => {
                        const text = results?.[0]?.result?.trim();
                        handleNewWindowLookUp(text ?? "");
                    });
                }
            });
        }
    });
}
