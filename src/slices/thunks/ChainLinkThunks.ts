import { ChainDecisionTO } from "../../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../../dataAccess/access/to/ChainLinkTO";
import { GoToTypesChain } from "../../dataAccess/access/types/GoToTypeChain";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { EditChainDecision } from "./ChainDecisionThunks";

const createChainLinkThunk = (link: ChainLinkTO, from?: ChainLinkTO | ChainDecisionTO, ifGoTO?: boolean): AppThunk => (
    dispatch,
) => {
    const response: DataAccessResponse<ChainLinkTO> = DataAccess.saveChainlink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainLinkTO).sequenceConfigurationFk !== undefined) {
                (from as ChainLinkTO).goto = {type: GoToTypesChain.LINK, id: response.object.id};
                dispatch(saveChainLinkThunk(from as ChainLinkTO));
            }
            if ((from as ChainDecisionTO).ifGoTo !== undefined) {
                if (ifGoTO) {
                    (from as ChainDecisionTO).ifGoTo = {type: GoToTypesChain.LINK, id: response.object.id};
                } else {
                    (from as ChainDecisionTO).elseGoTo = {type: GoToTypesChain.LINK, id: response.object.id};
                }
                dispatch(EditChainDecision.save(from as ChainDecisionTO));
            }
        }
        dispatch(setChainLinkToEditThunk(response.object));
    }
};

const saveChainLinkThunk = (link: ChainLinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainLinkTO> = DataAccess.saveChainlink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const deleteChainLinkThunk = (link: ChainLinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainLinkTO> = DataAccess.deleteChainLink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const findChainLinkThunk = (id: number): ChainLinkTO => {
    const response: DataAccessResponse<ChainLinkTO> = DataAccess.findChainLink(id);
    if (response.code !== 200) {
        // TODO: call this with "disptach(GlobalActions.handleError)".
        console.warn(response.message);
    }
    return response.object;
};

const setChainLinkToEditThunk = (link: ChainLinkTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;

    if (mode === Mode.EDIT_CHAIN_LINK) {
        dispatch(editActions.setChainLinkToEdit(link));
    } else {
        console.warn("Try to set chain step to edit in mode: " + mode);
    }
};

export const EditChainLink = {
    create: createChainLinkThunk,
    save: saveChainLinkThunk,
    delete: deleteChainLinkThunk,
    find: findChainLinkThunk,
};
