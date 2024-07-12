import { ChainDecisionTO } from "../../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../../dataAccess/access/to/ChainlinkTO";
import { GoToTypesChain } from "../../dataAccess/access/types/GoToTypeChain";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { EditChainLink } from "./ChainLinkThunks";

const createChainDecisionThunk = (
    decision: ChainDecisionTO,
    from?: ChainDecisionTO | ChainLinkTO,
    ifGoTO?: boolean,
): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChainDecision(decision);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainLinkTO).sequenceConfigurationFk !== undefined) {
                (from as ChainLinkTO).goto = {type: GoToTypesChain.DEC, id: response.object.id};
                dispatch(EditChainLink.save(from as ChainLinkTO));
            }
            if ((from as ChainDecisionTO).elseGoTo !== undefined) {
                if (ifGoTO) {
                    (from as ChainDecisionTO).ifGoTo = {type: GoToTypesChain.DEC, id: response.object.id};
                } else {
                    (from as ChainDecisionTO).elseGoTo = {type: GoToTypesChain.DEC, id: response.object.id};
                }
                dispatch(saveChainDecisionThunk(from as ChainDecisionTO));
            }
        }
        dispatch(setChainDecisionToEditThunk(response.object));
    }
};

const saveChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChainDecision(decision);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const deleteChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.deleteChaindecision(decision);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const findChainDecisionThunk = (id: number): ChainDecisionTO => {
    const response: DataAccessResponse<ChainDecisionTO> = DataAccess.findChainDecision(id);
    if (response.code !== 200) {
        // TODO: This should be called with: "dispatch(GlobalActions.handleError".
        console.warn(response.message);
    }
    return response.object;
};

const setChainDecisionToEditThunk = (decision: ChainDecisionTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_CHAIN_DECISION || mode === Mode.EDIT_CHAIN_DECISION_CONDITION) {
        dispatch(editActions.setChainDecisionToEdit(decision));
    } else {
        dispatch(GlobalActions.handleError("Try to set chain step to edit in mode: " + mode));
    }
};

export const EditChainDecision = {
    create: createChainDecisionThunk,
    save: saveChainDecisionThunk,
    delete: deleteChainDecisionThunk,
    find: findChainDecisionThunk,
    update: setChainDecisionToEditThunk,
};
