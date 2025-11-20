import storageService from "./services/storageService.js";
import stringService from "./services/stringService.js";
import dictionaryService from "./services/dictionaryService.js";
import browserService from "./services/browserService.js";

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

    // Display addon version
    const manifest = chrome.runtime.getManifest();
    const versionElement = document.getElementById('addon-version');
    if (versionElement && manifest.version) {
        versionElement.textContent = manifest.version;
    }

    storageService.get("library").then((library) => {
        const selectedWord = library.selectedWord;
        const selectedDictionary = library.selectedDictionary ?? "english";

        if (selectedWord && selectedWord.length > 0) {
            dictionaryService.openDictionaryOnPopup(selectedDictionary, selectedWord);
            // Clear the word from storage immediately after opening
            storageService.set("library", "selectedWord", "");
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
                // Store word temporarily for the lookup
                await storageService.set("library", "selectedWord", safeWord);
                await dictionaryService.openDictionaryOnPopup(selectedDictionary, safeWord);
                // Clear the word from storage immediately after opening
                await storageService.set("library", "selectedWord", "");
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

        // Add event listeners for footer buttons
        const reportIssueBtn = document.getElementById('report-issue-btn');
        const rateAddonBtn = document.getElementById('rate-addon-btn');

        if (reportIssueBtn) {
            reportIssueBtn.addEventListener('click', () => {
                chrome.tabs.create({
                    url: 'https://github.com/fkolcu/cambridge-dictionary-ffextension/issues/new'
                });
            });
        }

        if (rateAddonBtn) {
            rateAddonBtn.addEventListener('click', () => {
                const isChrome = navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Firefox");
                let ratingUrl = "";

                if (isChrome) {
                    ratingUrl = "https://chromewebstore.google.com/detail/cambridge-dictionary/pobhkelhalpmkbblgepmhbojnpgbcbpc?authuser=0&hl=tr";
                } else {
                    ratingUrl = "https://addons.mozilla.org/en-US/firefox/addon/cambridge-dictionary-english/";
                }

                chrome.tabs.create({
                    url: ratingUrl
                });
            });
        }
    })
});
