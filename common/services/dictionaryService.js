import browserService from "./browserService.js";

const dictionaryService = {
    openDictionaryOnPopup: async (selectedDictionary, selectedWord) => {
        const dictionaryUrl = dictionaryService.getDictionaryUrl(selectedDictionary, selectedWord);

        const isChrome = navigator.userAgent.includes("Chrome") && !navigator.userAgent.includes("Firefox");
        if (isChrome) {
            // Create window and notify background script about it
            const windowId = await browserService.openNewWindowAndGetId(dictionaryUrl);
            if (windowId) {
                // Notify background script to track this window for auto-close
                // Send message BEFORE closing the popup to ensure it gets through
                try {
                    await chrome.runtime.sendMessage({
                        action: "trackPopupWindow",
                        data: windowId
                    });
                } catch (err) {
                    // Silently ignore if message fails
                }
            }
            // Close popup AFTER message is sent
            window.close();
        } else {
            window.location.href = dictionaryUrl;
        }
    },
    getDictionaryUrl: (selectedDictionary, selectedWord) => {
        return 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + selectedWord + '?q=' + selectedWord + '#ref=cdext'
    }
};

export default dictionaryService;