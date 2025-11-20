let popupWindowId = null;
let closeTimeoutId = null;

const clearCloseTimeout = () => {
    if (closeTimeoutId !== null) {
        clearTimeout(closeTimeoutId);
        closeTimeoutId = null;
    }
};

const closePopupWindow = async () => {
    if (popupWindowId !== null) {
        try {
            await chrome.windows.remove(popupWindowId);
        } catch (err) {
            // Window already closed or other error - silently ignore
        }
        popupWindowId = null;
        clearCloseTimeout();
    }
};

const startCloseTimeout = () => {
    clearCloseTimeout();
    closeTimeoutId = setTimeout(() => {
        closePopupWindow();
    }, 5000); // 5 seconds
};

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
                    clearCloseTimeout(); // Clear any pending close timeout
                    return;
                }
            } catch (err) {
                // Window is likely closed or invalid
                popupWindowId = null;
                clearCloseTimeout();
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
    },

    openNewWindowAndGetId: async (url) => {
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
                    clearCloseTimeout(); // Clear any pending close timeout
                    return popupWindowId;
                }
            } catch (err) {
                // Window is likely closed or invalid
                popupWindowId = null;
                clearCloseTimeout();
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
        return newWindow.id;
    },

    initializeFocusListener: () => {
        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (popupWindowId !== null) {
                if (windowId === popupWindowId) {
                    // Popup window gained focus - clear any pending close timeout
                    clearCloseTimeout();
                } else if (windowId === chrome.windows.WINDOW_ID_NONE) {
                    // All windows lost focus (user switched apps or minimized)
                    // Start timeout to close popup window
                    startCloseTimeout();
                } else {
                    // Different window gained focus
                    // Start timeout to close popup window
                    startCloseTimeout();
                }
            }
        });
    },

    registerPopupWindow: (windowId) => {
        popupWindowId = windowId;
    }
};

export default browserService;