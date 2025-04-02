const browserService = {
    openNewWindow: async (url) => {
        //const currentWindow = await chrome.windows.getCurrent();

        const currentWindow = await chrome.windows.getLastFocused();

        chrome.windows.create({
            url: url, // Path to your HTML file for file selection
            type: 'popup',             // Set the type to popup
            width: 420,                // Set the width (match addon popup size)
            height: 540,                // Set the height (match addon popup size)
            left: currentWindow.left + currentWindow.width - 420,
            top: currentWindow.top + 100
        });
    }
};

export default browserService;