import { DataCTO } from "../../dataAccess/access/cto/DataCTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createDataThunk = (): AppThunk => (dispatch) => {
    const data: DataCTO = new DataCTO();
    const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(setDataToEdit(response.object));
};

const saveDataThunk = (data: DataCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDatasFromBackend());
};

const deleteDataThunk = (data: DataCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataCTO> = DataAccess.deleteDataCTO(data);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDatasFromBackend());
    dispatch(MasterDataActions.loadRelationsFromBackend());
};

const setDataToEdit = (data: DataCTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_DATA || mode === Mode.EDIT_DATA_INSTANCE) {
        dispatch(editActions.setDataToEdit(data));
    } else {
        dispatch(GlobalActions.handleError("Try to set data to edit in mode: " + mode));
    }
};

export const EditData = {
    save: saveDataThunk,
    delete: deleteDataThunk,
    update: setDataToEdit,
    create: createDataThunk,
};
