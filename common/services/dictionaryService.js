import browserService from "./browserService.js";

const dictionaryService = {
    openDictionaryOnPopup: async (selectedDictionary, selectedWord) => {
        const dictionaryUrl = dictionaryService.getDictionaryUrl(selectedDictionary, selectedWord);

        const isChrome = navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Firefox");
        if (isChrome) {
            window.close();
            await browserService.openNewWindow(dictionaryUrl);
        } else {
            window.location.href = dictionaryUrl;
        }
    },
    getDictionaryUrl: (selectedDictionary, selectedWord) => {
        return 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + selectedWord + '?q=' + selectedWord + '#ref=cdext'
    }
};

export default dictionaryService;