import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const saveChainStateThunk = (chainState: ChainStateTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.saveChainState(chainState);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainStatesFromBackend());
};

const deleteChainStateThunk = (chainStateId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO> = DataAccess.deleteChainState(chainStateId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainStatesFromBackend());
};

export const EditChainState = {
    save: saveChainStateThunk,
    delete: deleteChainStateThunk,
};
