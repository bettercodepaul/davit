import { DataSetupCTO } from "../../dataAccess/access/cto/DataSetupCTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createDataSetupThunk = (): AppThunk => (dispatch) => {
    const dataSetup: DataSetupCTO = new DataSetupCTO();
    const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
    dispatch(setDataSetupThunk(response.object));
};

const saveDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

const deleteDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataSetupCTO> = DataAccess.deleteDataSetup(dataSetup);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

const setDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_DATASETUP) {
        dispatch(editActions.setDataSetupToEdit(dataSetup));
    } else {
        dispatch(GlobalActions.handleError("Try to set dataSetup to edit in mode: " + mode));
    }
};

export const EditDataSetup = {
    save: saveDataSetupThunk,
    delete: deleteDataSetupThunk,
    update: setDataSetupThunk,
    create: createDataSetupThunk,
};
