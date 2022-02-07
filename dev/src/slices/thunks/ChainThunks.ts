// ----------------------------------------------- CHAIN -----------------------------------------------

import { ChainCTO } from "../../dataAccess/access/cto/ChainCTO";
import { ChainDecisionTO } from "../../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../../dataAccess/access/to/ChainTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";
import { SequenceModelActions } from "../SequenceModelSlice";

const createChainThunk = (): AppThunk => (dispatch) => {
    const chain: ChainTO = new ChainTO();
    const response: DataAccessResponse<ChainTO> = DataAccess.saveChainTO(chain);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(SequenceModelActions.setCurrentChain(response.object));
};

const getChainCTO = (chain: ChainTO): ChainCTO => {
    const response: DataAccessResponse<ChainCTO> = DataAccess.getChainCTO(chain);
    if (response.code !== 200) {
        console.warn(response.message);
    }
    console.info(response.object);
    return response.object;
};

const saveChainThunk = (chain: ChainTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainTO> = DataAccess.saveChainTO(chain);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(SequenceModelActions.setCurrentChain(response.object));
};

const deleteChainThunk = (chain: ChainTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainTO> = DataAccess.deleteChain(chain);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
    dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const setChainRootThunk = (chainId: number, rootId: number, isDecision: boolean): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainlinkTO | ChainDecisionTO> = DataAccess.setChainRoot(
        chainId,
        rootId,
        isDecision,
    );
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainsFromBackend());
    dispatch(MasterDataActions.loadChainLinksFromBackend());
    dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

export const EditChain = {
    create: createChainThunk,
    save: saveChainThunk,
    delete: deleteChainThunk,
    setRoot: setChainRootThunk,
    getCTO: getChainCTO,
};
