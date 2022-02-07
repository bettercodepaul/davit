import { SequenceCTO } from "../../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../../dataAccess/access/cto/SequenceStepCTO";
import { DecisionTO } from "../../dataAccess/access/to/DecisionTO";
import { GoToTypes } from "../../dataAccess/access/types/GoToType";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { DavitUtil } from "../../utils/DavitUtil";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { EditDecision } from "./DecisionThunks";

const createSequenceStepThunk = (
    step: SequenceStepCTO,
    from?: SequenceStepCTO | DecisionTO,
    ifGoTO?: Boolean,
): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStepCTO> = DataAccess.saveSequenceStepCTO(step);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as SequenceStepCTO).squenceStepTO !== undefined) {
                (from as SequenceStepCTO).squenceStepTO.goto = {
                    type: GoToTypes.STEP,
                    id: response.object.squenceStepTO.id,
                };
                dispatch(saveSequenceStepThunk(from as SequenceStepCTO));
            }
            if ((from as DecisionTO).elseGoTo !== undefined) {
                if (ifGoTO) {
                    (from as DecisionTO).ifGoTo = {type: GoToTypes.STEP, id: response.object.squenceStepTO.id};
                } else {
                    (from as DecisionTO).elseGoTo = {type: GoToTypes.STEP, id: response.object.squenceStepTO.id};
                }
                dispatch(EditDecision.save(from as DecisionTO));
            }
        }
        dispatch(setStepToEditThunk(response.object));
    }
};

const deleteSequenceStepThunk = (step: SequenceStepCTO, sequenceCTO?: SequenceCTO): AppThunk => (dispatch) => {
    // update forent gotos.
    if (sequenceCTO) {
        const copySequence: SequenceCTO = DavitUtil.deepCopy(sequenceCTO);
        // update steps
        copySequence.sequenceStepCTOs.forEach((item) => {
            if (
                item.squenceStepTO.goto.type === GoToTypes.STEP &&
                item.squenceStepTO.goto.id === step.squenceStepTO.id
            ) {
                item.squenceStepTO.goto = {type: GoToTypes.ERROR};
                dispatch(saveSequenceStepThunk(item));
            }
        });
        // update decision
        copySequence.decisions.forEach((cond) => {
            if (cond.ifGoTo.type === GoToTypes.STEP && cond.ifGoTo.id === step.squenceStepTO.id) {
                cond.ifGoTo = {type: GoToTypes.ERROR};
                dispatch(EditDecision.save(cond));
            }
            if (cond.elseGoTo.type === GoToTypes.STEP && cond.elseGoTo.id === step.squenceStepTO.id) {
                cond.elseGoTo = {type: GoToTypes.ERROR};
                dispatch(EditDecision.save(cond));
            }
        });
    }
    // delete step.
    const response: DataAccessResponse<SequenceStepCTO> = DataAccess.deleteSequenceStepCTO(step);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const saveSequenceStepThunk = (step: SequenceStepCTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStepCTO> = DataAccess.saveSequenceStepCTO(step);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadSequencesFromBackend());
};

const setStepToEditThunk = (step: SequenceStepCTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode.startsWith(Mode.EDIT_SEQUENCE_STEP)) {
        dispatch(editActions.setStepToEdit(step));
    } else {
        dispatch(GlobalActions.handleError("Try to set step to edit in mode: " + mode));
    }
};

export const EditStep = {
    save: saveSequenceStepThunk,
    delete: deleteSequenceStepThunk,
    update: setStepToEditThunk,
    create: createSequenceStepThunk,
};
