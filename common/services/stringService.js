const stringService = {
    safeString: (string) => {
        if (!string) {
            return "";
        }

        return encodeURI(string.trim().toLowerCase());
    }
};

export default stringService;