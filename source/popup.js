const template = `
<style>
html,body{
    width: 600px;
    height: 520px;
}
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }

  .container {
    width: 600px;
    height: 520px;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid red;
    padding: 5px;
  }

  .centered-text {
    text-align: center;
    font-size: 24px;
  }
</style>

<div class="container">
  <p class="centered-text">No word selected</p>
</div>
`;

let storageItem = browser.storage.sync.get('selectedWord');
storageItem.then((res) => {
    let selectedWord = res.selectedWord
    if (selectedWord === undefined || selectedWord === "") {
        const templateContainer = document.createElement('div');
        templateContainer.innerHTML = template;
        document.getElementById('content').appendChild(templateContainer);
        return
    }

    storageItem = browser.storage.sync.get('selectedDictionaryKey');
    storageItem.then((res) => {
        let selectedDictionary = res.selectedDictionaryKey
        if (selectedDictionary === undefined) {
            selectedDictionary = "english"
        }

        window.location = 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + selectedWord + '?ref=cdext';
    });
});
