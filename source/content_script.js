document.body.addEventListener('mouseup', function (e) {
    if (location.search.includes('ref=cdext')) {
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
  .cdext_selector_container{
    position: fixed;
    width: 100%;
    height: 51px;
    border: 1px solid #f0f0f0;
    z-index: 9999;
    bottom: 0;
  }
  select#cdext_selector {
    border: none;
    background-color: #e74c3c;
    color: white;
    width: 100%;
    height: 50px;
    padding: 10px;
    cursor: pointer;
  }
</style>

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
`;

if (location.search.includes('ref=cdext')) {
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

        window.location = 'https://dictionary.cambridge.org/dictionary/' + event.target.value + '/' + selectedWord + '?q=' + selectedWord + '&ref=cdext';
    });
}
