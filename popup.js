const queryTab = browser.tabs.query({active: true});
queryTab.then(onQueryTabSuccessful, onQueryTabFailed);

function onQueryTabSuccessful(tabs) {
    const cookiePromise = browser.cookies.get({
        url: tabs[0].url,
        name: 'cd_ext_st'
    });
    cookiePromise.then(function (_cookie) {
        if (_cookie) {
            openDictionary(_cookie.value);
        }
    });
}

function onQueryTabFailed(error) {
    console.log('Error happened while querying tabs:', error)
}

function openDictionary(word) {
    console.log("Dictionary is loading for the word of " + word);

    const url = 'https://dictionary.cambridge.org/dictionary/english/' + word;

    const iframe = document.createElement('iframe');
    iframe.width = '580';
    iframe.height = '530';
    iframe.src = url;

    document.getElementById('cd_content').appendChild(iframe);
}
