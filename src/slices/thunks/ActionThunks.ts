import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../../dataAccess/access/to/ActionTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, EditActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { EditStep } from "./StepThunks";

const createActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(EditActions.setMode.editAction(response.object));
};

const saveActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const deleteActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    const actionIndex: number = action.index;

    const response: DataAccessResponse<ActionTO> = DataAccess.deleteActionTO(action);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }

    const stepToUpdateActionIndexes: SequenceStepCTO | undefined = MasterDataActions.find.findSequenceStepCTO(
        action.sequenceStepFk,
    );

    if (stepToUpdateActionIndexes) {
        stepToUpdateActionIndexes.actions.map((action) => {
            if (action.index > actionIndex) {
                action.index = action.index - 1;
            }
            return action;
        });

        dispatch(EditStep.save(stepToUpdateActionIndexes));
    }

    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const setActionToEditThunk = (action: ActionTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    if (mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
        dispatch(editActions.setActionToEdit(action));
    } else {
        dispatch(GlobalActions.handleError("Try to set action to edit in mode: " + mode));
    }
};

export const EditAction = {
    delete: deleteActionThunk,
    update: setActionToEditThunk,
    save: saveActionThunk,
    create: createActionThunk,
};
