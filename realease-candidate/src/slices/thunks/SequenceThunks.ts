import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { SequenceStepTO } from "../../dataAccess/access/to/SequenceStepTO";
import { SequenceTO } from "../../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { SequenceModelActions } from "../SequenceModelSlice";

const createSequenceThunk = (): AppThunk => (dispatch) => {
    const sequence: SequenceTO = new SequenceTO();
    dispatch(saveSequenceThunk(sequence));
};

const saveSequenceThunk = (sequence: SequenceTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceTO> = DataAccess.saveSequenceTO(sequence);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
    dispatch(setSequenceToEditThunk(response.object));
    dispatch(SequenceModelActions.setCurrentSequence(response.object.id));
};

const deleteSequenceThunk = (sequence: SequenceTO): AppThunk => (dispatch, getState) => {
    const sequenceCTOToDelete: SequenceCTO | null = getSequenceCTOById(sequence.id);

    if (sequenceCTOToDelete !== null) {
        const response: DataAccessResponse<SequenceCTO> = DataAccess.deleteSequenceCTO(sequenceCTOToDelete);

        if (response.code !== 200) {
            dispatch(GlobalActions.handleError(response.message));
        }

        if (getState().sequenceModel.selectedSequenceModel?.sequenceTO?.id === sequence.id) {
            dispatch(SequenceModelActions.resetCurrentSequence);
        }

        dispatch(MasterDataActions.loadSequencesFromBackend());
    }
};

const getSequenceCTOById = (sequenceId: number): SequenceCTO | null => {
    const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
    if (response.code !== 200) {
        return null;
    }
    return response.object;
};

const setRootThunk = (sequenceId: number, rootId: number, isDecision: boolean): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStepTO | DecisionTO> = DataAccess.setRoot(
        sequenceId,
        rootId,
        isDecision,
    );
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const setSequenceToEditThunk = (sequence: SequenceTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_SEQUENCE) {
        dispatch(editActions.setSequenceToEdit(sequence));
    } else {
        dispatch(GlobalActions.handleError("Try to set sequence to edit in mode: " + mode));
    }
};

export const EditSequence = {
    save: saveSequenceThunk,
    delete: deleteSequenceThunk,
    update: setSequenceToEditThunk,
    findCTO: getSequenceCTOById,
    create: createSequenceThunk,
    setRoot: setRootThunk,
};
