import { ChainConfigurationTO } from "../../dataAccess/access/to/ChainConfigurationTO";
import { ChainStateTO } from "../../dataAccess/access/to/ChainStateTO";
import { DataAccess } from "../../dataAccess/DataAccess";
import { DataAccessResponse } from "../../dataAccess/DataAccessResponse";
import { AppThunk } from "../../store";
import { editActions } from "../EditSlice";
import { GlobalActions } from "../GlobalSlice";
import { MasterDataActions } from "../MasterDataSlice";

const createChainConfigurationThunk = (chainId: number): AppThunk => (dispatch) => {

    const chainConfiguration: ChainConfigurationTO = new ChainConfigurationTO();
    chainConfiguration.chainFk = chainId;

    const response: DataAccessResponse<ChainStateTO[]> = DataAccess.findAllChainStatesByChainFk(chainId);

    if (response.code === 200) {
        chainConfiguration.stateValues = response.object.map(state => {
            return {chainStateFk: state.id, value: state.isState};
        });
    }

    dispatch(setChainConfigurationThunk(chainConfiguration));
};

const setChainConfigurationThunk = (chainConfiguration: ChainConfigurationTO): AppThunk => (dispatch) => {
    dispatch(editActions.setChainConfiguration(chainConfiguration));
};

const deleteChainConfigurationThunk = (chainConfiguration: ChainConfigurationTO): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainConfigurationTO> = DataAccess.deleteChainConfiguration(chainConfiguration);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    }
    dispatch(MasterDataActions.loadChainConfigurationsFromBackend());
};

export const EditChainConfiguration = {
    update: setChainConfigurationThunk,
    create: createChainConfigurationThunk,
    delete: deleteChainConfigurationThunk,
};
