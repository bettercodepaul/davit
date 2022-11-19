import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { storageMiddleware } from "./middlewares/StateSync";
import { EditReducer } from "./slices/EditSlice";
import { globalReducer } from "./slices/GlobalSlice";
import { MasterDataReducer } from "./slices/MasterDataSlice";
import { SequenceModelReducer } from "./slices/SequenceModelSlice";
import { createStorageListener } from "./utils/StorageListener";

export const store = configureStore({
    reducer: {
        global: globalReducer,
        masterData: MasterDataReducer,
        edit: EditReducer,
        sequenceModel: SequenceModelReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(storageMiddleware),
});

window.addEventListener("storage", createStorageListener(store));

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = ()=>useDispatch<AppDispatch>();