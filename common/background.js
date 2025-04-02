import storageService from "./services/storageService.js";
import stringService from "./services/stringService.js";
import dictionaryService from "./services/dictionaryService.js";

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    switch (message.action) {
        case "wordSelected":
            await handleWordSelection(message.data);
            break;

        case "readToolbar":
            return {
                result: await readToolbar()
            }

        case "readStorage":
            return {
                result: await storageService.get("library")
            }

        case "dictionaryChanged":
            return {
                result: await handleDictionaryChange(message.data)
            };
    }
});

const handleDictionaryChange = async (dictionary) => {
    await storageService.set("library", "selectedDictionary", dictionary);

    const libraryStorage = await storageService.get("library");
    return dictionaryService.getDictionaryUrl(dictionary, libraryStorage.selectedWord);
};

const handleWordSelection = async (word) => {
    const safeWord = stringService.safeString(word);
    if (safeWord === "") {
        await storageService.set("library", "selectedWord", "");
    } else {
        await storageService.set("library", "selectedWord", safeWord);
    }
};

const readToolbar = async () => {
    const url = chrome.runtime.getURL("sources/toolbar.html");
    return {
        html: await fetch(url).then(res => res.text())
    };
}