import { ActorCTO } from "../../dataAccess/access/cto/ActorCTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createActorThunk = (): AppThunk => (dispatch) => {
    const actor: ActorCTO = new ActorCTO();
    const response: DataAccessResponse<ActorCTO> = DataAccess.saveActorCTO(actor);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadActorsFromBackend());
    dispatch(setActorToEditThunk(response.object));
};

const saveActorThunk = (actor: ActorCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActorCTO> = DataAccess.saveActorCTO(actor);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadActorsFromBackend());
};

const deleteActorThunk = (actor: ActorCTO): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<ActorCTO> = await DataAccess.deleteActorCTO(actor);
    if (response.code !== 200) {
        console.log(response);
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadActorsFromBackend());
};

const setActorToEditThunk = (actor: ActorCTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_ACTOR) {
        dispatch(editActions.setActorToEdit(actor));
    } else {
        dispatch(GlobalActions.handleError("Try to set actor to edit in mode: " + mode));
    }
};

export const EditActor = {
    save: saveActorThunk,
    delete: deleteActorThunk,
    update: setActorToEditThunk,
    create: createActorThunk,
};
