let popupWindowId = null;

const browserService = {
    openNewWindow: async (url) => {
        if (popupWindowId !== null) {
            try {
                const openWindow = await chrome.windows.get(popupWindowId);
                if (openWindow) {
                    const [tab] = await chrome.tabs.query({windowId: popupWindowId});

                    // Update tab URL
                    if (tab?.id) {
                        await chrome.tabs.update(tab.id, {url});
                    }

                    // Bring the window to front
                    await chrome.windows.update(popupWindowId, {focused: true});
                    return;
                }
            } catch (err) {
                // Window is likely closed or invalid
                popupWindowId = null;
            }
        }

        const currentWindow = await chrome.windows.getCurrent();

        // If we get here, no reusable window — create new one
        const newWindow = await chrome.windows.create({
            url: url,
            type: 'popup',
            width: 420,
            height: 540,
            left: currentWindow.left + currentWindow.width - 420,
            top: currentWindow.top + 100
        });

        popupWindowId = newWindow.id;
    }
};

export default browserService;