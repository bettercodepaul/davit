import { splitSymbol, storageKey } from "../middlewares/StateSync";

export function createStorageListener(store: any) {
    return () => {
        const stringFromStorage: string | null = localStorage.getItem(storageKey);
        if (stringFromStorage) {
            const actionString: string = stringFromStorage.split(splitSymbol)[0];
            const wrappedAction = JSON.parse(actionString);
            delete wrappedAction.source;
            store.dispatch(wrappedAction);
        }
    };
}
