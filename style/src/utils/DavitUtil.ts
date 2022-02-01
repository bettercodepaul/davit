export const DavitUtil = {
    isNullOrUndefined(object: any): boolean {
        return object === null || object === undefined;
    },

    deepCopy(object: any) {
        return DavitUtil.isNullOrUndefined(object) ? object : JSON.parse(JSON.stringify(object));
    },

    isValidName(name: string): boolean {
        let valid: boolean = false;
        if (!this.isNullOrUndefined(name)) {
            // TODO: define rules for a valid name.
            valid = name !== "";
        }
        return valid;
    },
};
