import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { AppThunk, RootState } from "../store";

interface GlobalState {
    errors: string[];
    actorZoom: number;
    dataZoom: number;
}

const getInitialState = (): GlobalState => {
    return {
        errors: [],
        actorZoom: 1,
        dataZoom: 1,
    };
};

const ZOOM_FACTOR: number = 0.1;

export const globalSlice = createSlice({
    name: "global",
    initialState: getInitialState(),
    reducers: {
        handleError: (state, action: PayloadAction<string>) => {
            state.errors.push(action.payload);
        },
        clearErrors: (state) => {
            state.errors = [];
        },
        removeErrorAtIndex: (state, action: PayloadAction<number>) => {
            if (action.payload > -1 && action.payload < state.errors.length) {
                state.errors = state.errors.filter((error, index) => index !== action.payload);
            }
        },
        setActorZoom: (state, action: PayloadAction<number>) => {
            state.actorZoom = action.payload;
        },
        setDataZoom: (state, action: PayloadAction<number>) => {
            state.dataZoom = action.payload;
        },
    },
});

// ---------------------------------------- Thunks ----------------------------------------

const storefileData = (fileData: string): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<void> = await DataAccess.storeFileData(fileData);
    if (response.code === 200) {
        window.location.reload();
    } else {
        dispatch(globalSlice.actions.handleError(response.message));
    }
};

const createNewProject = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<void> = DataAccess.createNewProject();
    if (response.code === 200) {
        window.location.reload();
    } else {
        dispatch(globalSlice.actions.handleError(response.message));
    }
};

const downloadData = (projectName: string): AppThunk => (dispatch) => {
    const response: DataAccessResponse<void> = DataAccess.downloadData(projectName);
    if (response.code !== 200) {
        dispatch(globalSlice.actions.handleError(response.message));
    }
};

const zoomInAndSaveActorZoom = (): AppThunk => (dispatch, getState) => {
    const newZoom: number = getState().global.actorZoom + ZOOM_FACTOR;
    const response: DataAccessResponse<number> = DataAccess.setActorZoom(newZoom);
    if (response.code === 200) {
        dispatch(globalSlice.actions.setActorZoom(newZoom));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

const zoomOutAndSaveActorZoom = (): AppThunk => (dispatch, getState) => {
    const newZoom: number = getState().global.actorZoom - ZOOM_FACTOR;
    const response: DataAccessResponse<number> = DataAccess.setActorZoom(newZoom);
    if (response.code === 200) {
        dispatch(globalSlice.actions.setActorZoom(newZoom));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

const zoomInAndSaveDataZoom = (): AppThunk => (dispatch, getState) => {
    const newZoom: number = getState().global.dataZoom + ZOOM_FACTOR;
    const response: DataAccessResponse<number> = DataAccess.setDataZoom(newZoom);
    if (response.code === 200) {
        dispatch(globalSlice.actions.setDataZoom(newZoom));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

const zoomOutAndSaveDataZoom = (): AppThunk => (dispatch, getState) => {
    const newZoom: number = getState().global.dataZoom - ZOOM_FACTOR;
    const response: DataAccessResponse<number> = DataAccess.setDataZoom(newZoom);
    if (response.code === 200) {
        dispatch(globalSlice.actions.setDataZoom(newZoom));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

const loadActorZoomFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<number> = DataAccess.loadActorZoom();
    if (response.code === 200) {
        dispatch(globalSlice.actions.setActorZoom(response.object));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

const loadDataZoomFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<number> = DataAccess.loadDataZoom();
    if (response.code === 200) {
        dispatch(globalSlice.actions.setDataZoom(response.object));
    } else {
        dispatch(globalSlice.actions.handleError("Could not save zoom!"));
    }
};

// ------------------------------------- Public Actions -------------------------------------

export const GlobalActions = {
    storefileData,
    createNewProject,
    downloadData,
    actorZoomIn: zoomInAndSaveActorZoom,
    actorZoomOut: zoomOutAndSaveActorZoom,
    dataZoomIn: zoomInAndSaveDataZoom,
    dataZoomOut: zoomOutAndSaveDataZoom,
    loadActorZoomFromBackend,
    loadDataZoomFromBackend,
    handleError: globalSlice.actions.handleError
};

// -------------------------------------- Selectors --------------------------------------

export const globalSelectors = {
    selectGlobalErrorState: (state: RootState): string[] => {
        return state.global.errors;
    },

    selectActorZoomFactor: (state: RootState): number => {
        return state.global.actorZoom;
    },
    selectDataZoomFactor: (state: RootState): number => {
        return state.global.dataZoom;
    },
};

export const globalReducer = globalSlice.reducer;
