const dictionaryService = {
    openDictionaryOnPopup: (selectedDictionary, selectedWord) => {
        window.location = dictionaryService.getDictionaryUrl(selectedDictionary, selectedWord);
    },
    getDictionaryUrl: (selectedDictionary, selectedWord) => {
        return 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + selectedWord + '?q=' + selectedWord + '#ref=cdext'
    }
};

export default dictionaryService;