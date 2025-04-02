import storageService from "./services/storageService.js";
import stringService from "./services/stringService.js";
import dictionaryService from "./services/dictionaryService.js";

const showElement = (element) => {
    element.classList.remove("hidden");
    element.classList.add("visible");
}

const hideElement = (element) => {
    element.classList.remove("visible");
    element.classList.add("hidden");
}

document.addEventListener('DOMContentLoaded', () => {
    const blankContainer = document.querySelector("#blank-container");
    const loadingContainer = document.querySelector("#loading-status");

    storageService.get("library").then((library) => {
        const selectedWord = library.selectedWord;
        const selectedDictionary = library.selectedDictionary ?? "english";

        if (selectedWord && selectedWord.length > 0) {
            dictionaryService.openDictionaryOnPopup(selectedDictionary, selectedWord);
            return;
        }

        hideElement(loadingContainer);
        showElement(blankContainer);

        const input = document.getElementById('manual-word');
        input.focus();

        const button = document.getElementById('lookup-button');

        const lookupWord = async () => {
            const safeWord = stringService.safeString(input.value);
            if (safeWord && safeWord.length > 0) {
                hideElement(blankContainer);
                showElement(loadingContainer);
                await storageService.set("library", "selectedWord", safeWord);
                await dictionaryService.openDictionaryOnPopup(selectedDictionary, safeWord);
            } else {
                alert("Please enter a word to look up.");
            }
        };

        button.addEventListener('click', lookupWord);
        input.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                lookupWord();
            }
        });
    })
});
