import { ChainDecisionTO } from "../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../dataAccess/access/to/ChainlinkTO";
import { GoToTypesChain } from "../../dataAccess/access/types/GoToTypeChain";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions, Mode } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { EditChainDecision } from "./ChainDecisionThunks";

const createChainLinkThunk = (link: ChainlinkTO, from?: ChainlinkTO | ChainDecisionTO, ifGoTO?: boolean): AppThunk => (
    dispatch,
) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        if (from !== undefined) {
            if ((from as ChainlinkTO).dataSetupFk !== undefined) {
                (from as ChainlinkTO).goto = {type: GoToTypesChain.LINK, id: response.object.id};
                dispatch(saveChainLinkThunk(from as ChainlinkTO));
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

const saveChainLinkThunk = (link: ChainlinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const deleteChainLinkThunk = (link: ChainlinkTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.deleteChainLink(link);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const findChainLinkThunk = (id: number): ChainlinkTO => {
    const response: DataAccessResponse<ChainlinkTO> = DataAccess.findChainLink(id);
    if (response.code !== 200) {
        // TODO: call this with "disptach(GlobalActions.handleError)".
        console.warn(response.message);
    }
    return response.object;
};

const setChainLinkToEditThunk = (link: ChainlinkTO): AppThunk => (dispatch, getState) => {
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
