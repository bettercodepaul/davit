import { DavitUtil } from "../../utils/DavitUtil";

export const CheckHelper = {
    nullCheck(object: any, name: string) {
        if (DavitUtil.isNullOrUndefined(object)) {
            console.warn(`${name} must not be null or undefined`);
            throw new Error(`null.error! ${name} must not be null or undefined`);
        }
    },
};
