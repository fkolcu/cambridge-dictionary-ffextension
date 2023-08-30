document.body.addEventListener('mouseup', function (e) {
    if (location.hash.includes('ref=cdext')) {
        return
    }

    let selectedText = document.getSelection().toString().trim()
    selectedText = encodeURI(selectedText);

    browser.storage.sync.set({
        selectedWord: selectedText
    });
});

const template = `
<style>
   html,body{
    width: 600px;
    height: 520px;
   }
  .additional-options{
    position: fixed;
    width: 100%;
    height: 51px;
    z-index: 9999;
    bottom: 0;
    display:flex;
    align-items: center;
  }
  .additional-options .cdext_selector_container{
    flex-grow: 1;
  }
 
  .additional-options .cdext_selector_container select#cdext_selector {
    border: none;
    background-color: #e74c3c;
    color: white;
    width: 100%;
    height: 50px;
    padding: 10px;
    cursor: pointer;
  }
  
  .additional-options .font-size-selector button#button_change_font_size{
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    fill:#ffffff;
  }
  
  .tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
}

.tooltip .tooltiptext {
visibility: hidden;
  width: 200px;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 0;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: ;
  margin-left: -27px;
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 8%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>

<div class="additional-options">
    <div class="font-size-selector">
        <button id="button_change_font_size" class="tooltip">
           <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m22 6-3-4-3 4h2v4h-2l3 4 3-4h-2V6zM9.307 4l-6 16h2.137l1.875-5h6.363l1.875 5h2.137l-6-16H9.307zm-1.239 9L10.5 6.515 12.932 13H8.068z"/></svg>
           <span id="button_change_font_size_tooltiptext" class="tooltiptext"></span>
        </button>
    </div>
    <div class="cdext_selector_container">
  <select id="cdext_selector">
    <option value="english">English</option>
    <optgroup label="Bilingual Dictionaries">
      <option value="english-dutch">English–Dutch</option>
      <option value="english-french">English–French</option>
      <option value="english-german">English–German</option>
      <option value="english-indonesian">English–Indonesian</option>
      <option value="english-italian">English–Italian</option>
      <option value="english-japanese">English–Japanese</option>
      <option value="english-norwegian">English–Norwegian</option>
      <option value="english-polish">English–Polish</option>
      <option value="english-portuguese">English–Portuguese</option>
      <option value="english-spanish">English–Spanish</option>
    </optgroup>
    <optgroup label="Semi-bilingual Dictionaries">
      <option value="english-arabic">English–Arabic</option>
      <option value="english-catalan">English–Catalan</option>
      <option value="english-chinese-simplified">English–Chinese (Simplified)</option>
      <option value="english-chinese-traditional">English–Chinese (Traditional)</option>
      <option value="english-czech">English–Czech</option>
      <option value="english-danish">English–Danish</option>
      <option value="english-hindi">English–Hindi</option>
      <option value="english-korean">English–Korean</option>
      <option value="english-malaysian">English–Malay</option>
      <option value="english-russian">English–Russian</option>
      <option value="english-thai">English–Thai</option>
      <option value="english-turkish">English–Turkish</option>
      <option value="english-ukrainian">English–Ukrainian</option>
      <option value="english-vietnamese">English–Vietnamese</option>
    </optgroup>
  </select>
</div>
</div>
`;

if (location.hash.includes('ref=cdext')) {
    let storageItem = browser.storage.sync.get('selectedDictionaryKey');
    storageItem.then((res) => {
        let selectedDictionary = res.selectedDictionaryKey
        if (selectedDictionary === undefined) {
            selectedDictionary = "english"
        }

        const templateContainer = document.createElement('div');
        templateContainer.innerHTML = template;
        document.body.appendChild(templateContainer);

        document.getElementById('cdext_selector').value = selectedDictionary;
        document.getElementById('cdext_selector').addEventListener('change', onDictionaryChanged)

        document.getElementById('button_change_font_size').addEventListener('click', onFontSizeToggled)
    });
}

function onDictionaryChanged(event) {
    browser.storage.sync.set({
        selectedDictionaryName: event.target.innerText, selectedDictionaryKey: event.target.value,
    });

    let storageItem = browser.storage.sync.get('selectedWord');
    storageItem.then((res) => {
        let selectedWord = res.selectedWord
        if (selectedWord === undefined || selectedWord === "") {
            return
        }

        window.location = 'https://dictionary.cambridge.org/dictionary/' + event.target.value + '/' + selectedWord + '?q=' + selectedWord + '#ref=cdext';
    });
}

const initialFontSize = 16;
const maxFontSize = 26;
const fontSizeStep = 2;

// Read the latest font size
readFontSize(function (res) {
    let fontSize = res.fontSize
    if (fontSize === undefined || fontSize === "") {
        fontSize = initialFontSize
    }

    applyFontSize(fontSize)
})

function onFontSizeToggled(event) {
    readFontSize(function (res) {
        let fontSize = res.fontSize
        if (fontSize === undefined || fontSize === "") {
            fontSize = initialFontSize
        }

        fontSize += fontSizeStep;

        if (fontSize > maxFontSize) {
            fontSize = initialFontSize;
        }

        applyFontSize(fontSize)

        browser.storage.sync.set({
            fontSize: fontSize
        });
    })
}

function readFontSize(fontSizeHandler) {
    let storageItem = browser.storage.sync.get('fontSize');
    storageItem.then((res) => {
        fontSizeHandler(res)
    });
}

const contentElements = document.querySelectorAll("#page-content *")

const originalFontSizes = []; // Store original font sizes
contentElements.forEach(element => {
    originalFontSizes.push(getComputedStyle(element).fontSize);
});

function applyFontSize(fontSize) {
    document.getElementById('button_change_font_size_tooltiptext').innerText = 'Toggle font size : ' + getFontSizeIndex(fontSize)

    contentElements.forEach((element, index) => {
        if (fontSize === initialFontSize) {
            element.style.fontSize = originalFontSizes[index] // this is like `24px`, no need to add `px` postfix
        } else {
            element.style.fontSize = `${fontSize}px`
        }
    })
}

function getFontSizeIndex(selectedSize) {
    if (selectedSize < initialFontSize || selectedSize > maxFontSize) {
        return -1; // Size is out of range
    }

    return Math.floor((selectedSize - initialFontSize) / fontSizeStep);
}
