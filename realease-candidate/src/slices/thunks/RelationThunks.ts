import { DataRelationTO } from "../../dataAccess/access/to/DataRelationTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createRelationThunk = (): AppThunk => (dispatch) => {
    const relation: DataRelationTO = new DataRelationTO();
    const response: DataAccessResponse<DataRelationTO> = DataAccess.saveDataRelationCTO(relation);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadRelationsFromBackend());
    dispatch(setRelationToEditThunk(response.object));
};

const saveRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<DataRelationTO> = await DataAccess.saveDataRelationCTO(relation);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadRelationsFromBackend());
};

const deleteRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<DataRelationTO> = await DataAccess.deleteDataRelation(relation);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadRelationsFromBackend());
};

const setRelationToEditThunk = (relation: DataRelationTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_RELATION) {
        dispatch(editActions.setRelationToEdit(relation));
    } else {
        dispatch(GlobalActions.handleError("Try to set relation to edit in mode: " + mode));
    }
};

export const EditRelation = {
    save: saveRelationThunk,
    delete: deleteRelationThunk,
    create: createRelationThunk,
    update: setRelationToEditThunk,
};
