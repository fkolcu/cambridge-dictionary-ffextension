const storageService = {
    async get(storeName) {
        const storedData = await chrome.storage.local.get(storeName);
        return storedData[storeName] ? JSON.parse(storedData[storeName]) : {};
    },

    async set(storeName, key, value) {
        let currentData = await this.get(storeName);
        currentData[key] = value;
        await chrome.storage.local.set({[storeName]: JSON.stringify(currentData)});
    },

    async remove(storeName, key) {
        let currentData = await this.get(storeName);
        delete currentData[key];
        await this.set(storeName, currentData);
    }
};

export default storageService;