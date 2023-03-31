let currentTab = null;
let currentSelectedWord = null;
const cookieNameMap = {
    selectedWord: "fk_cd_ext_st",
};

initialize();

function initialize() {
    const queryTab = browser.tabs.query({active: true});
    queryTab.then(onQueryTabSuccessful, onQueryTabFailed);

    let storageItem = browser.storage.sync.get('selectedDictionaryKey');
    storageItem.then((res) => {
        let selectedDictionary = res.selectedDictionaryKey
        if (selectedDictionary === undefined) {
            selectedDictionary = "english"
        }

        document.getElementById('dictionary-selector').value = selectedDictionary;
    });
}

function onQueryTabSuccessful(tabs) {
    currentTab = tabs[0];

    readCookie(currentTab, cookieNameMap.selectedWord, function (cookie1) {
        if (cookie1) {
            currentSelectedWord = cookie1.value
            let storageItem = browser.storage.sync.get('selectedDictionaryKey');
            storageItem.then((res) => {
                let selectedDictionary = res.selectedDictionaryKey
                if (selectedDictionary === undefined) {
                    selectedDictionary = "english"
                }

                openDictionary(currentSelectedWord, selectedDictionary)
            });
        }
    });
}

function onQueryTabFailed(error) {
    console.log('Error happened while querying tabs:', error)
}

function readCookie(tab, cookieName, callback) {
    const cookiePromise = browser.cookies.get({
        url: tab.url,
        name: cookieName
    });
    cookiePromise.then(callback);
}

function openDictionary(word, dictionary) {
    let iframe = null
    let existIframes = document.getElementById('cd_content').getElementsByTagName('iframe')
    if (existIframes.length > 0) {
        iframe = existIframes[0]
    }

    console.log("Dictionary of " + dictionary + " is loading for the word of " + word);

    const url = 'https://dictionary.cambridge.org/dictionary/' + dictionary + '/' + word;

    if (iframe === null) {
        iframe = document.createElement('iframe');
    }

    iframe.width = '580';
    iframe.height = '530';
    iframe.src = url;

    document.getElementById('cd_content').appendChild(iframe);
}

// Add listener to dictionary selector
document.getElementById('dictionary-selector')
    .addEventListener("change", onDictionarySelected);

function onDictionarySelected(event) {
    browser.storage.sync.set({
        selectedDictionaryName: event.target.innerText,
        selectedDictionaryKey: event.target.value,
    });

    openDictionary(currentSelectedWord, event.target.value)
}
