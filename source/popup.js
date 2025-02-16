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
     font-family: Arial, sans-serif;
      background-color: #f7f9fc;
  }

  .container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .centered-text {
    text-align: center;
    font-size: 24px;
  }
  
  h2 {
      font-size: 18px;
      color: #333;
      margin-bottom: 20px;
    }

    input[type="text"] {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      margin-bottom: 20px;
      transition: border-color 0.3s ease;
      text-align: center;
    }
    
     input[type="text"]:focus {
      border-color: #007bff;
      outline: none;
    }

    button {
    text-align: center;
     background-color: #007bff;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.3s ease, transform 0.2s;
    }

    button:hover {
       background-color: #0056b3;
      transform: translateY(-2px);
    }
    
     button:active {
      transform: translateY(0);
    }

    .secondary-text {
      font-size: 14px;
      color: #666;
      margin-top: 15px;
    }
</style>

<div class="container">
    <h2>Look up a word manually:</h2>
    <input type="text" id="lookUpText" placeholder="Enter a word">
    <button id="lookUpButton">Look up</button>
    <p class="secondary-text">Or choose a word on a website</p>
</div>
`;

const loadingTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Loading...</title>
    <style>
        html,body{
         width: 600px;
         height: 520px;
        }
        
        body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #fff;
            color: #000;
            font-family: Arial, sans-serif;
        }

        /* Centered Container */
        .loading-container {
            text-align: center;
        }
        
        /* Spinner */
        .spinner {
            width: 64px;
            height: 64px;
            border: 6px solid #3b82f6;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        /* Loading Text */
        .loading-text {
            margin-top: 16px;
            font-size: 18px;
            font-weight: bold;
        }
        
        /* Spinner Animation */
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <!-- Spinner -->
        <div class="spinner"></div>

        <!-- Loading Text -->
        <p class="loading-text">Please wait, loading...</p>
    </div>
</body>
</html>
`;

let storageItem = browser.storage.sync.get('selectedWord');
storageItem.then((res) => {
    let selectedWord = res.selectedWord
    if (selectedWord === undefined || selectedWord === "") {
        const templateContainer = document.createElement('div');
        templateContainer.innerHTML = template;
        document.getElementById('content').appendChild(templateContainer);
        document.querySelector('#lookUpButton').addEventListener('click', function (e){
            const lookUpText = (document.querySelector('#lookUpText').value ?? '').trim();
            if (lookUpText === ""){
                return;
            }

            storageItem = browser.storage.sync.get('selectedDictionaryKey');
            storageItem.then((res) => {
                let selectedDictionary = res.selectedDictionaryKey
                if (selectedDictionary === undefined) {
                    selectedDictionary = "english"
                }

                window.location = 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + lookUpText + '?q=' + lookUpText + '#ref=cdext';
            });
        });
        return
    }

    const templateContainer = document.createElement('div');
    templateContainer.innerHTML = loadingTemplate;
    document.getElementById('content').appendChild(templateContainer);

    storageItem = browser.storage.sync.get('selectedDictionaryKey');
    storageItem.then((res) => {
        let selectedDictionary = res.selectedDictionaryKey
        if (selectedDictionary === undefined) {
            selectedDictionary = "english"
        }

        window.location = 'https://dictionary.cambridge.org/dictionary/' + selectedDictionary + '/' + selectedWord + '?q=' + selectedWord + '#ref=cdext';
    });
});
