import { InitDataTO } from "../../dataAccess/access/to/InitDataTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, EditActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const saveInitDataThunk = (initData: InitDataTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<InitDataTO> = DataAccess.saveInitData(initData);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(EditActions.setMode.editInitData(response.object));
};

const deleteInitDataThunk = (initDataId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<InitDataTO> = DataAccess.deleteInitData(initDataId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

const setInitDataToEditThunk = (initData: InitDataTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_DATASETUP_INITDATA) {
        dispatch(editActions.setInitDataToEdit(initData));
    } else {
        dispatch(GlobalActions.handleError("Try to set initData to edit in mode: " + mode));
    }
};

export const EditInitData = {
    save: saveInitDataThunk,
    delete: deleteInitDataThunk,
    update: setInitDataToEditThunk,
};
