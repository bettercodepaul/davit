import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActorCTO } from "../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ChainConfigurationTO } from "../dataAccess/access/to/ChainConfigurationTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { ChainLinkTO } from "../dataAccess/access/to/ChainlinkTO";
import { ChainStateTO } from "../dataAccess/access/to/ChainStateTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { SequenceConfigurationTO } from "../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../dataAccess/access/to/SequenceStateTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { AppThunk, RootState } from "../store";
import { DavitUtil } from "../utils/DavitUtil";
import { GlobalActions } from "./GlobalSlice";

interface MasterDataState {
    actors: ActorCTO[];
    groups: GroupTO[];
    datas: DataCTO[];
    relations: DataRelationTO[];
    sequences: SequenceTO[];
    sequenceConfigurations: SequenceConfigurationTO[];
    chains: ChainTO[];
    chainLinks: ChainLinkTO[];
    chainDecisions: ChainDecisionTO[];
    sequenceState: SequenceStateTO[];
    chainState: ChainStateTO[];
    chainConfigurations: ChainConfigurationTO[];
}

const getInitialState: MasterDataState = {
    actors: [],
    groups: [],
    datas: [],
    relations: [],
    sequences: [],
    sequenceConfigurations: [],
    chains: [],
    chainLinks: [],
    chainDecisions: [],
    sequenceState: [],
    chainState: [],
    chainConfigurations: [],
};

const MasterDataSlice = createSlice({
    name: "masterData",
    initialState: getInitialState,
    reducers: {
        setActors: (state, action: PayloadAction<ActorCTO[]>) => {
            state.actors = action.payload;
        },
        setGroups: (state, action: PayloadAction<GroupTO[]>) => {
            state.groups = action.payload;
        },
        setDatas: (state, action: PayloadAction<DataCTO[]>) => {
            state.datas = action.payload;
        },
        setRelations: (state, action: PayloadAction<DataRelationTO[]>) => {
            state.relations = action.payload;
        },
        setSequences: (state, action: PayloadAction<SequenceTO[]>) => {
            state.sequences = action.payload;
        },
        setSequenceConfigurations: (state, action: PayloadAction<SequenceConfigurationTO[]>) => {
            state.sequenceConfigurations = action.payload;
        },
        setChains: (state, action: PayloadAction<ChainTO[]>) => {
            state.chains = action.payload;
        },
        setChainLinks: (state, action: PayloadAction<ChainLinkTO[]>) => {
            state.chainLinks = action.payload;
        },
        setChainDecisions: (state, action: PayloadAction<ChainDecisionTO[]>) => {
            state.chainDecisions = action.payload;
        },
        setSequenceStates: (state, action: PayloadAction<SequenceStateTO[]>) => {
            state.sequenceState = action.payload;
        },
        setChainStates: (state, action: PayloadAction<ChainStateTO[]>) => {
            state.chainState = action.payload;
        },
        setChainConfigurations: (state, action: PayloadAction<ChainConfigurationTO[]>) => {
            state.chainConfigurations = action.payload;
        },
    },
});

// =============================================== THUNKS ===============================================

const loadGroupsFromBackend = (): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<GroupTO[]> = await DataAccess.findAllGroups();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setGroups(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadActorsFromBackend = (): AppThunk => async (dispatch) => {
    const response: DataAccessResponse<ActorCTO[]> = await DataAccess.findAllActors();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setActors(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadDatasFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataCTO[]> = DataAccess.findAllDatas();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setDatas(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadRelationsFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<DataRelationTO[]> = DataAccess.findAllDataRelations();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setRelations(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadSequencesFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceTO[]> = DataAccess.findAllSequences();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setSequences(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadSequenceConfigurationsFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceConfigurationTO[]> = DataAccess.findAllSequenceConfigurations();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setSequenceConfigurations(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadChainConfigurationsFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainConfigurationTO[]> = DataAccess.findAllChainConfigurations();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setChainConfigurations(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadChainsFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainTO[]> = DataAccess.findAllChains();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setChains(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadChainLinksFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainLinkTO[]> = DataAccess.findAllChainLinks();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setChainLinks(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadChainDecisionsFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainDecisionTO[]> = DataAccess.findAllChainDecisions();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setChainDecisions(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadChainStatesFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<ChainStateTO[]> = DataAccess.findAllChainStates();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setChainStates(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const loadSequenceStatesFromBackend = (): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceStateTO[]> = DataAccess.findAllSequenceStates();
    if (response.code === 200) {
        dispatch(MasterDataSlice.actions.setSequenceStates(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const findSequenceStepCTO = (id: number): SequenceStepCTO | undefined => {
    let step: SequenceStepCTO | undefined;
    const response: DataAccessResponse<SequenceStepCTO> = DataAccess.findSequenceStepCTO(id);
    if (response.code === 200) {
        step = DavitUtil.deepCopy(response.object);
    }
    return step;
};

const loadAll = (): AppThunk => (dispatch) => {
    dispatch(loadGroupsFromBackend());
    dispatch(loadActorsFromBackend());
    dispatch(loadSequenceConfigurationsFromBackend());
    dispatch(loadRelationsFromBackend());
    dispatch(loadSequencesFromBackend());
    dispatch(loadDatasFromBackend());
    dispatch(loadChainsFromBackend());
    dispatch(loadChainLinksFromBackend());
    dispatch(loadChainDecisionsFromBackend());
    dispatch(loadChainStatesFromBackend());
    dispatch(loadSequenceStatesFromBackend());
    dispatch(loadChainConfigurationsFromBackend());
};

// =============================================== SELECTORS ===============================================

export const MasterDataReducer = MasterDataSlice.reducer;

export const masterDataSelectors = {
    selectActors: (state: RootState): ActorCTO[] => state.masterData.actors,
    selectGroups: (state: RootState): GroupTO[] => state.masterData.groups,
    selectDatas: (state: RootState): DataCTO[] => state.masterData.datas,
    selectRelations: (state: RootState): DataRelationTO[] => state.masterData.relations,
    selectSequences: (state: RootState): SequenceTO[] => state.masterData.sequences,
    selectChains: (state: RootState): ChainTO[] => state.masterData.chains,
    selectChainLinks: (state: RootState): ChainLinkTO[] => state.masterData.chainLinks,
    selectChainDecisions: (state: RootState): ChainDecisionTO[] => state.masterData.chainDecisions,
    selectSequenceConfigurations: (state: RootState): SequenceConfigurationTO[] => state.masterData.sequenceConfigurations,

    selectSequenceTOById: (id: number) => (state: RootState): SequenceTO | undefined => {
        return state.masterData.sequences.find((sequence) => sequence.id === id);
    },

    selectSequenceConfigurationsBySequenceId: (sequenceId: number | undefined) => (state: RootState): SequenceConfigurationTO[] => {
        if (sequenceId !== undefined) {
            return state.masterData.sequenceConfigurations.filter(config => config.sequenceFk === sequenceId);
        } else {
            return state.masterData.sequenceConfigurations;
        }
    },

    selectChainConfigurationsByChainId: (chainId: number | undefined) => (state: RootState): ChainConfigurationTO[] => {
        if (chainId !== undefined) {
            return state.masterData.chainConfigurations.filter(config => config.chainFk === chainId);
        } else {
            return state.masterData.chainConfigurations;
        }
    },

    selectActorById: (id: number) => {
        return (state: RootState): ActorCTO | null => {
            return state.masterData.actors.find((actor) => actor.actor.id === id) || null;
        };
    },

    selectSequenceStateBySequenceId: (sequenceId: number) => {
        return (state: RootState): SequenceStateTO[] => {
            return state.masterData.sequenceState.filter(state => state.sequenceFk === sequenceId);
        };
    },

    selectChainStateByChainId: (chainId: number) => {
        return (state: RootState): ChainStateTO[] => {
            return state.masterData.chainState.filter(state => state.chainFk === chainId);
        };
    },

    selectDataCTOById: (id: number) => {
        return (state: RootState): DataCTO | null => {
            return state.masterData.datas.find((data) => data.data.id === id) || null;
        };
    },

    selectSequenceConfigurationToById: (id: number) => {
        return (state: RootState): SequenceConfigurationTO | null => {
            return state.masterData.sequenceConfigurations.find((config) => config.id === id) || null;
        };
    },

    isFirstChainElement: (id: number) => {
        return (state: RootState): boolean => {
            let isFirst: boolean = true;
            if (state.masterData.chainLinks.some((link) => link.chainFk === id)) {
                isFirst = false;
            }
            if (state.masterData.chainDecisions.some((dec) => dec.chainFk === id)) {
                isFirst = false;
            }
            return isFirst;
        };
    },
};

// =============================================== ACTIONS ===============================================

export const MasterDataActions = {
    loadChainsFromBackend,
    loadChainLinksFromBackend,
    loadChainDecisionsFromBackend,
    loadChainStatesFromBackend,
    loadGroupsFromBackend,
    loadActorsFromBackend,
    loadSequenceConfigurationsFromBackend,
    loadRelationsFromBackend,
    loadSequencesFromBackend,
    loadSequenceStatesFromBackend,
    loadDatasFromBackend,
    loadChainConfigurationsFromBackend,
    loadAll,
    find: {
        findSequenceStepCTO,
    },
};
