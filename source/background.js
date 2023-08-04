const dictionaries = {
    bilingual: [
        {
            "key": "english-dutch",
            "title": "English–Dutch"
        },
        {
            "key": "english-french",
            "title": "English–French"
        },
        {
            "key": "english-german",
            "title": "English–German"
        },
        {
            "key": "english-indonesian",
            "title": "English–Indonesian"
        },
        {
            "key": "english-italian",
            "title": "English–Italian"
        },
        {
            "key": "english-japanese",
            "title": "English–Japanese"
        },
        {
            "key": "english-norwegian",
            "title": "English–Norwegian"
        },
        {
            "key": "english-polish",
            "title": "English–Polish"
        },
        {
            "key": "english-portuguese",
            "title": "English–Portuguese"
        },
        {
            "key": "english-spanish",
            "title": "English–Spanish"
        }
    ],
    semiBilingual: [
        {
            "key": "english-arabic",
            "title": "English–Arabic"
        },
        {
            "key": "english-catalan",
            "title": "English–Catalan"
        },
        {
            "key": "english-chinese-simplified",
            "title": "English–Chinese (Simplified)"
        },
        {
            "key": "english-chinese-traditional",
            "title": "English–Chinese (Traditional)"
        },
        {
            "key": "english-czech",
            "title": "English–Czech"
        },
        {
            "key": "english-danish",
            "title": "English–Danish"
        },
        {
            "key": "english-hindi",
            "title": "English–Hindi"
        },
        {
            "key": "english-korean",
            "title": "English–Korean"
        },
        {
            "key": "english-malaysian",
            "title": "English–Malay"
        },
        {
            "key": "english-russian",
            "title": "English–Russian"
        },
        {
            "key": "english-thai",
            "title": "English–Thai"
        },
        {
            "key": "english-turkish",
            "title": "English–Turkish"
        },
        {
            "key": "english-ukrainian",
            "title": "English–Ukrainian"
        },
        {
            "key": "english-vietnamese",
            "title": "English–Vietnamese"
        }]
}

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

function addMenu(type, id, title) {
    const obj = {
        id: id,
        contexts: ["selection"]
    };

    if (title !== undefined) {
        obj.title = title;
    }

    if (type === 'separator') {
        obj.type = type;
    }

    browser.contextMenus.create(obj, onCreated);
}

addMenu(undefined, 'dictionary-english', 'English');
addMenu('separator', 'separator-1', undefined);

for (let i = 0; i < dictionaries.bilingual.length; i++) {
    addMenu(undefined, 'dictionary-' + dictionaries.bilingual[i].key, dictionaries.bilingual[i].title)
}

addMenu('separator', 'separator-2', undefined);

for (let i = 0; i < dictionaries.semiBilingual.length; i++) {
    addMenu(undefined, 'dictionary-' + dictionaries.semiBilingual[i].key, dictionaries.semiBilingual[i].title)
}

let clickHandler = (info, tab) => {
    let menuID = info.menuItemId;
    if (!menuID.startsWith('dictionary')) {
        return;
    }

    let dictionary = menuID.replace('dictionary-', '')

    let selectedWord = encodeURI(info.selectionText);
    let url = 'https://dictionary.cambridge.org/dictionary/' + dictionary + '/' + selectedWord;
    browser.tabs.create({
        url: url
    });
};

if (browser.contextMenus.onClicked.hasOwnProperty('addEventListener') === true) {
    browser.contextMenus.onClicked.addEventListener('click', clickHandler);
} else {
    browser.contextMenus.onClicked.addListener(clickHandler);
}
