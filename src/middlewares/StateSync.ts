export const storageKey: string = "redux-local-tab-sync";
export const splitSymbol: string = "__";

export function storageMiddleware() {
    return (next: any) => (action: any) => {
        if (!action.source) {
            const wrappedAction = Object.assign({source: "another tab"}, action);
            localStorage.setItem(storageKey, JSON.stringify(wrappedAction) + splitSymbol + new Date());
        }

        next(action);
    };
}
