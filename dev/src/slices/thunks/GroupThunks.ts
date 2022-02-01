import { GroupTO } from "../../dataAccess/access/to/GroupTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createGroupThunk = (): AppThunk => (dispatch) => {
    const group: GroupTO = new GroupTO();
    const response: DataAccessResponse<GroupTO> = DataAccess.saveGroup(group);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadGroupsFromBackend());
    dispatch(setGroupToEditThunk(response.object));
};

const saveGroupThunk = (group: GroupTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<GroupTO> = DataAccess.saveGroup(group);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadGroupsFromBackend());
};

const deleteGroupThunk = (group: GroupTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<GroupTO> = DataAccess.deleteGroupTO(group);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadGroupsFromBackend());
    dispatch(MasterDataActions.loadActorsFromBackend());
};

const setGroupToEditThunk = (group: GroupTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_DATA || mode === Mode.EDIT_DATA_INSTANCE) {
        dispatch(editActions.setGroupToEdit(group));
    } else {
        dispatch(GlobalActions.handleError("Try to set data to edit in mode: " + mode));
    }
};

export const EditGroup = {
    save: saveGroupThunk,
    delete: deleteGroupThunk,
    update: setGroupToEditThunk,
    create: createGroupThunk,
};
