import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Arrow, ArrowType } from "../components/atomic/svg/DavitPath";
import { ChainCTO } from "../dataAccess/access/cto/ChainCTO";
import { ChainLinkCTO } from "../dataAccess/access/cto/ChainLinkCTO";
import { GeometricalDataCTO } from "../dataAccess/access/cto/GeometraicalDataCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ChainConfigurationTO } from "../dataAccess/access/to/ChainConfigurationTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { InitDataTO } from "../dataAccess/access/to/InitDataTO";
import { SequenceConfigurationTO } from "../dataAccess/access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "../dataAccess/access/to/SequenceStateTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { Terminal } from "../dataAccess/access/types/GoToType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { CalcChain, getRoot, SequenceChainService } from "../services/SequenceChainService";
import { CalcSequence, CalculatedStep, SequenceService } from "../services/SequenceService";
import { AppThunk, RootState } from "../store";
import { ActorData } from "../viewDataTypes/ActorData";
import { ActorDataState } from "../viewDataTypes/ActorDataState";
import { Mode } from "./EditSlice";
import { GlobalActions } from "./GlobalSlice";

export interface Filter {
    type: "ACTOR" | "DATA";
    id: number;
}

export enum ViewLevel {
    sequence = "sequence",
    chain = "chain",
}

interface SequenceModelState {
    selectedSequenceModel: SequenceCTO | null;
    selectedSequenceConfiguration: SequenceConfigurationTO | null;
    calcSequence: CalcSequence | null;
    calcChain: CalcChain | null;
    currentStepIndex: number;
    currentLinkIndex: number;
    errorActions: ActionTO[];
    actions: ActionTO[];
    actorDatas: ActorData[];
    activeFilter: Filter[];
    selectedChain: ChainCTO | null;
    selectedChainConfiguration: ChainConfigurationTO | null;
    viewLevel: ViewLevel;
}

const getInitialState: SequenceModelState = {
    selectedSequenceModel: null,
    selectedSequenceConfiguration: null,
    calcSequence: null,
    calcChain: null,
    currentStepIndex: 0,
    currentLinkIndex: 0,
    errorActions: [],
    actions: [],
    actorDatas: [],
    activeFilter: [],
    selectedChain: null,
    selectedChainConfiguration: null,
    viewLevel: ViewLevel.sequence,
};

const SequenceModelSlice = createSlice({
    name: "sequenceModel",
    initialState: getInitialState,
    reducers: {
        setViewLevel: (state, action: PayloadAction<ViewLevel>) => {
            state.viewLevel = action.payload;
        },

        setSelectedSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
            state.selectedSequenceModel = action.payload;
            // TODO: in extra method und nur ausführen wenn sequence und datasetup gestezt sind sonst reset.
            state.selectedChain = null;
            state.calcChain = null;
            state.currentLinkIndex = 0;
            state.currentStepIndex = 0;
            if (action.payload && state.selectedSequenceConfiguration) {
                calcSequenceAndSetState(action.payload, state.selectedSequenceConfiguration, state);
            } else {
                resetState(state);
            }
        },
        recalcSequence: (state) => {
            if (state.selectedSequenceModel && state.selectedSequenceConfiguration) {
                calcSequenceAndSetState(state.selectedSequenceModel, state.selectedSequenceConfiguration, state);
            }
        },
        setCurrentLinkIndex: (state, action: PayloadAction<number>) => {
            state.currentStepIndex = 0;
            // on decrement we first set the step index to 0 and only if it is 0 we decrement the link index
            if (state.calcChain && state.calcChain.calcLinks.length > action.payload && action.payload >= 0) {
                state.currentLinkIndex = action.payload;
            } else if (state.calcChain && action.payload < 0) {
                state.currentLinkIndex = state.calcChain.calcLinks.length - 1;
            } else {
                state.currentLinkIndex = 0;
            }
        },
        setSelectedChain: (state, action: PayloadAction<ChainCTO | null>) => {
            state.selectedChain = action.payload;
            resetState(state);
            state.selectedSequenceModel = null;
            state.selectedSequenceConfiguration = null;
            state.currentLinkIndex = 0;
            state.currentStepIndex = 0;
        },
        setSelectedChainConfiguration: (state, action: PayloadAction<ChainConfigurationTO | null>) => {
            state.selectedChainConfiguration = action.payload;
            state.currentLinkIndex = 0;
            state.currentStepIndex = 0;
        },
        setCalcChain: (state, action: PayloadAction<CalcChain | null>) => {
            state.calcChain = action.payload;
        },
        setSelectedSequenceConfiguration: (state, action: PayloadAction<SequenceConfigurationTO | null>) => {
            state.selectedSequenceConfiguration = action.payload;
            state.selectedChain = null;
            state.calcChain = null;
            state.currentLinkIndex = 0;

            if (action.payload && state.selectedSequenceModel) {
                calcSequenceAndSetState(state.selectedSequenceModel, action.payload, state);
            } else {
                resetState(state);
            }
        },
        addDataFilter: (state, action: PayloadAction<number>) => {
            state.activeFilter = [...state.activeFilter, {type: "DATA", id: action.payload}];
            state.currentStepIndex = 0;
        },
        removeDataFilter: (state, action: PayloadAction<number>) => {
            state.activeFilter = state.activeFilter.filter(
                (filt) => !(filt.type === "DATA" && filt.id === action.payload),
            );
            state.currentStepIndex = 0;
        },
        addActorFilters: (state, action: PayloadAction<number>) => {
            state.activeFilter = [...state.activeFilter, {type: "ACTOR", id: action.payload}];
            state.currentStepIndex = 0;
        },
        removeActorFilter: (state, action: PayloadAction<number>) => {
            state.activeFilter = state.activeFilter.filter(
                (filt) => !(filt.type === "ACTOR" && filt.id === action.payload),
            );
            state.currentStepIndex = 0;
        },
        setCurrentStepIndex: (state, action: PayloadAction<number>) => {
            let filteredSteps: CalculatedStep[] = [];
            if (getCurrentCalcSequence(state)) {
                filteredSteps = filterSteps(
                    getCurrentCalcSequence(state)?.calculatedSteps || [],
                    state.activeFilter,
                    getCurrentSequenceModel(state)?.sequenceStepCTOs || [],
                );
            }
            const newStepIndex = action.payload;
            if (getCurrentCalcSequence(state) && newStepIndex >= 0 && newStepIndex < filteredSteps.length) {
                state.currentStepIndex = action.payload;
            } else if (state.calcChain && newStepIndex === filteredSteps.length) {
                if (state.currentLinkIndex < state.calcChain.calcLinks.length - 1) {
                    state.currentLinkIndex = state.currentLinkIndex + 1;
                    state.currentStepIndex = 0;
                } else {
                    state.currentLinkIndex = 0;
                    state.currentStepIndex = 0;
                }
            } else if (state.calcChain && newStepIndex === -1) {
                const newLinkIndex =
                    state.currentLinkIndex > 0 ? state.currentLinkIndex - 1 : state.calcChain.calcLinks.length - 1;
                const newFilteredSteps = filterSteps(
                    state.calcChain.calcLinks[newLinkIndex].sequence.calculatedSteps || [],
                    state.activeFilter,
                    state.calcChain.calcLinks[newLinkIndex].sequence.sequenceModel?.sequenceStepCTOs || [],
                );
                state.currentStepIndex = newFilteredSteps.length - 1;
                state.currentLinkIndex = newLinkIndex;
            } else {
                state.currentStepIndex = 0;
            }
        },
        setErrorActions: (state, action: PayloadAction<ActionTO[]>) => {
            state.errorActions = action.payload;
        },
        setActions: (state, action: PayloadAction<ActionTO[]>) => {
            state.actions = action.payload;
        },
        setActorDatas: (state, action: PayloadAction<ActorData[]>) => {
            state.actorDatas = action.payload;
        },
        setFilter: (state, action: PayloadAction<Filter[]>) => {
            state.activeFilter = action.payload;
            state.currentStepIndex = 0;
        },
    },
});

function calcSequenceAndSetState(sequenceModel: SequenceCTO, sequenceConfiguration: SequenceConfigurationTO, state: SequenceModelState) {
    const result: CalcSequence = SequenceService.calculateSequence(sequenceModel, sequenceConfiguration);
    state.currentStepIndex = 0;
    state.errorActions = result.calculatedSteps[state.currentStepIndex]?.errors || [];
    state.actorDatas = result.calculatedSteps[state.currentStepIndex]?.actorDatas || [];
    state.calcSequence = result;
}

function resetState(state: SequenceModelState) {
    state.errorActions = [];
    state.actorDatas = [];
    state.calcSequence = null;
    state.activeFilter = [];
}

// =============================================== THUNKS ===============================================

const stepNext = (currentIndex: number): AppThunk => (dispatch) => {
    dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex + 1));
};

const setViewLevelThunk = (viewLevel: ViewLevel): AppThunk => (dispatch, getState) => {
    switch (viewLevel) {
        case ViewLevel.chain:
            if (getState().sequenceModel.selectedChain !== null) {
                dispatch(SequenceModelSlice.actions.setViewLevel(viewLevel));
            }
            break;
        case ViewLevel.sequence:
            // if (getState().sequenceModel.selectedSequenceModel !== null) {
            dispatch(SequenceModelSlice.actions.setViewLevel(viewLevel));
            // }
            break;
    }
};

const stepBack = (currentIndex: number): AppThunk => (dispatch) => {
    dispatch(SequenceModelActions.setCurrentStepIndex(currentIndex - 1));
};

const linkNext = (currentIndex: number): AppThunk => (dispatch) => {
    dispatch(SequenceModelActions.setCurrentLinkIndex(currentIndex + 1));
};

const linkBack = (currentIndex: number): AppThunk => (dispatch, getState) => {
    const stepIndex: number = getState().sequenceModel.currentStepIndex;
    if (stepIndex > 0) {
        dispatch(SequenceModelSlice.actions.setCurrentStepIndex(0));
    } else {
        dispatch(SequenceModelActions.setCurrentLinkIndex(currentIndex - 1));
    }
};

const setSelectedChainThunk = (chain: ChainTO): AppThunk => (dispatch, getState) => {
    const mode: Mode = getState().edit.mode;
    const response: DataAccessResponse<ChainCTO> = DataAccess.getChainCTO(chain);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        const chainCTO: ChainCTO = response.object;
        dispatch(SequenceModelSlice.actions.setSelectedChain(chainCTO));
        const selectedChainConfiguration: ChainConfigurationTO | null = getState().sequenceModel.selectedChainConfiguration;
        if (chainCTO && mode === Mode.VIEW && selectedChainConfiguration !== null && getRoot(chainCTO)) {
            dispatch(SequenceModelSlice.actions.setCalcChain(SequenceChainService.calculateChain(chainCTO, selectedChainConfiguration)));
        }
    }
};

const setSelectedSequenceByIdThunk = (sequenceId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        dispatch(SequenceModelSlice.actions.setSelectedSequence(response.object));
    }
};

const setSelectedSequenceByIdWithStatesThunk = (sequenceId: number, states: SequenceStateTO[]): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
    if (response.code !== 200) {
        dispatch(GlobalActions.handleError(response.message));
    } else {
        // set states
        const sequence: SequenceCTO = response.object;
        sequence.sequenceStates = states;
        dispatch(SequenceModelSlice.actions.setSelectedSequence(sequence));
    }
};

const getSequenceConfigurationFromBackend = (dataSetupId: number): AppThunk => (dispatch) => {
    const response: DataAccessResponse<SequenceConfigurationTO> = DataAccess.findSequenceConfiguration(dataSetupId);
    if (response.code === 200) {
        dispatch(SequenceModelSlice.actions.setSelectedSequenceConfiguration(response.object));
    } else {
        dispatch(GlobalActions.handleError(response.message));
    }
};

const resetAll = (): AppThunk => (dispatch) => {
    dispatch(SequenceModelSlice.actions.setSelectedSequenceConfiguration(null));
    dispatch(SequenceModelSlice.actions.setCurrentStepIndex(-1));
    dispatch(SequenceModelSlice.actions.setSelectedSequence(null));
    dispatch(SequenceModelSlice.actions.setSelectedChain(null));
};

const handleActorClickEvent = (actorId: number): AppThunk => (dispatch) => {
    const filter: Filter[] = [];
    filter.push({type: "ACTOR", id: actorId});
    dispatch(SequenceModelSlice.actions.setFilter(filter));
};

const handleDataClickEvent = (dataId: number): AppThunk => (dispatch) => {
    const filter: Filter[] = [];
    filter.push({type: "DATA", id: dataId});
    dispatch(SequenceModelSlice.actions.setFilter(filter));
};

const filterSteps = (steps: CalculatedStep[], filter: Filter[], modelSteps: SequenceStepCTO[]): CalculatedStep[] => {
    if (filter.length === 0) {
        return steps;
    }
    return steps.filter((step) =>
        filter.some((currentFilter) => {
            const actions: ActionTO[] =
                modelSteps.find((modelStep) => modelStep.sequenceStepTO.id === step.modelElementFk)?.actions || [];
            switch (currentFilter.type) {
                case "ACTOR":
                    return actions.some((action) => action.receivingActorFk === currentFilter.id);
                case "DATA":
                    return actions.some((action) => action.dataFk === currentFilter.id);
                default:
                    return false;
            }
        }),
    );
};

const getArrowsForStepFk = (stepFk: number, sequenceStepCTOs: SequenceStepCTO[], rootState: RootState): Arrow[] => {
    let arrows: Arrow[] = [];
    let step: SequenceStepCTO | undefined;
    if (stepFk && sequenceStepCTOs) {
        step = sequenceStepCTOs.find((stp) => stp.sequenceStepTO.id === stepFk);
    }
    if (step) {
        arrows = mapActionsToArrows(step.actions, rootState);
    }
    return arrows;
};

const mapActionsToArrows = (actions: ActionTO[], state: RootState): Arrow[] => {
    const arrows: Arrow[] = [];

    actions.forEach((action) => {
        const sourceGeometricalData: GeometricalDataCTO | undefined = state.masterData.actors.find(
            (actor) => actor.actor.id === action.sendingActorFk,
        )?.geometricalData;

        const targetGeometricalData: GeometricalDataCTO | undefined = state.masterData.actors.find(
            (comp) => comp.actor.id === action.receivingActorFk,
        )?.geometricalData;

        const dataLabels: string[] = [];

        if (action.actionType === ActionType.TRIGGER) {
            dataLabels.push(action.triggerText);
        } else {
            const dataLabel: string | undefined = state.masterData.datas.find((data) => data.data.id === action.dataFk)
                ?.data.name;
            if (dataLabel) {
                dataLabels.push(dataLabel);
            }
        }

        const type: ArrowType = action.actionType.includes("SEND") ? ArrowType.SEND : ArrowType.TRIGGER;

        if (sourceGeometricalData && targetGeometricalData) {
            const existingArrow: Arrow | undefined = arrows.find(
                (arrow) =>
                    arrow.sourceGeometricalData.geometricalData.id === sourceGeometricalData.geometricalData.id &&
                    arrow.targetGeometricalData.geometricalData.id === targetGeometricalData.geometricalData.id,
            );

            if (existingArrow) {
                existingArrow.dataLabels.push(...dataLabels);
            } else {
                arrows.push({
                    sourceGeometricalData,
                    targetGeometricalData,
                    dataLabels,
                    type,
                });
            }
        }
    });
    return arrows;
};

// =============================================== SELECTORS ===============================================

export const SequenceModelReducer = SequenceModelSlice.reducer;
export const sequenceModelSelectors = {
    activeFilters: (state: RootState): Filter[] => state.sequenceModel.activeFilter,
    selectSequence: (state: RootState): SequenceCTO | null => getCurrentSequenceModel(state.sequenceModel),
    selectChain: (state: RootState): ChainTO | null => state.sequenceModel.selectedChain?.chain || null,
    selectChainCTO: (state: RootState): ChainCTO | null => state.sequenceModel.selectedChain || null,
    selectCurrentChainLinks: (state: RootState): ChainLinkCTO[] => state.sequenceModel.selectedChain?.links || [],
    selectCurrentChainDecisions: (state: RootState): ChainDecisionTO[] =>
        state.sequenceModel.selectedChain?.decisions || [],
    selectCalcChain: (state: RootState): CalcChain | null => state.sequenceModel.calcChain || null,
    selectCalcSteps: (state: RootState): CalculatedStep[] => {
        if (state.edit.mode === Mode.VIEW) {
            const currentSequence: SequenceCTO | null = getCurrentSequenceModel(state.sequenceModel);
            const calcSequence: CalcSequence | null = getCurrentCalcSequence(state.sequenceModel);
            return filterSteps(
                calcSequence?.calculatedSteps || [],
                state.sequenceModel.activeFilter,
                currentSequence?.sequenceStepCTOs || [],
            );
        } else {
            return [];
        }
    },

    selectViewLevel: (state: RootState): ViewLevel => {
        return state.sequenceModel.viewLevel;
    },

    selectCalcStepIds: (state: RootState): string[] =>
        state.edit.mode === Mode.VIEW ? getCurrentCalcSequence(state.sequenceModel)?.stepIds || [] : [],
    selectTerminalStep: (state: RootState): Terminal | null =>
        state.edit.mode === Mode.VIEW ? getCurrentCalcSequence(state.sequenceModel)?.terminal || null : null,
    selectSequenceConfiguration: (state: RootState): SequenceConfigurationTO | null => {
        if (state.edit.mode === Mode.VIEW) {
            return getCurrentSequenceConfiguration(state.sequenceModel);
        } else {
            return null;
        }
    },
    selectActorData: (state: RootState): ActorData[] => {
        let actorDatas: ActorData[] = [];
        // Get step actor-data's if calculation is present
        if (state.sequenceModel.calcSequence || state.sequenceModel.calcChain) {
            const filteredSteps = getFilteredSteps(state);
            actorDatas.push(...filteredSteps[state.sequenceModel.currentStepIndex]?.actorDatas || []);
        }
        // Get date-setup init data's if NO calculation is present
        if (state.sequenceModel.selectedSequenceConfiguration && !state.sequenceModel.calcSequence && !state.sequenceModel.calcChain) {
            const initDatasFormDataSetup = state.sequenceModel.selectedSequenceConfiguration?.initDatas || [];
            actorDatas.push(...initDatasFormDataSetup.map(mapInitDataToActorData));
        }

        return actorDatas;
    },
    selectErrors: (state: RootState): ActionTO[] => {
        const filteredSteps = getFilteredSteps(state);
        return filteredSteps[state.sequenceModel.currentStepIndex]?.errors || [];
    },

    selectFalseStates: (state: RootState): SequenceStateTO[] => {
        const filteredSteps = getFilteredSteps(state);
        return filteredSteps[state.sequenceModel.currentStepIndex]?.falseStates || [];
    },

    selectTrueStates: (state: RootState): SequenceStateTO[] => {
        const filteredSteps = getFilteredSteps(state);
        return filteredSteps[state.sequenceModel.currentStepIndex]?.trueStates || [];
    },

    selectActions: (state: RootState): ActionTO[] => {
        const filteredSteps = getFilteredSteps(state);
        const stepId: number | undefined = filteredSteps[state.sequenceModel.currentStepIndex]?.modelElementFk;
        return stepId
            ? getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs.find(
            (step) => step.sequenceStepTO.id === stepId,
        )?.actions || []
            : [];
    },
    selectCurrentStepIndex: (state: RootState): number => state.sequenceModel.currentStepIndex,
    selectCurrentStepId: (state: RootState): string => {
        return (
            getCurrentCalcSequence(state.sequenceModel)?.calculatedSteps[state.sequenceModel.currentStepIndex]
                ?.stepId || ""
        );
    },
    selectCurrentLinkIndex: (state: RootState): number => state.sequenceModel.currentLinkIndex,
    selectCurrentLinkId: (state: RootState): string =>
        state.sequenceModel.calcChain?.calcLinks[state.sequenceModel.currentLinkIndex]?.stepId || "",
    selectCurrentArrows: (state: RootState): Arrow[] => {
        const arrows: Arrow[] = [];
        const filteredSteps = getFilteredSteps(state);
        const stepFks: number[] = [];

        const stepFk: number | undefined =
            filteredSteps[state.sequenceModel.currentStepIndex]?.type === "STEP"
                ? filteredSteps[state.sequenceModel.currentStepIndex]?.modelElementFk
                : undefined;
        if (stepFk) {
            stepFks.push(stepFk);
        }
        let allArrows: Arrow[] = [];
        stepFks.forEach((stepFk) => {
            const arr: Arrow[] = getArrowsForStepFk(
                stepFk,
                getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs || [],
                state,
            );
            allArrows = allArrows.concat(arr);
        });
        allArrows.forEach((arrow) => {
            if (arrow) arrows.push(arrow);
        });
        return arrows;
    },
    selectLoopStepStartIndex: (state: RootState): number | null =>
        getCurrentCalcSequence(state.sequenceModel)?.loopStartingStepIndex || null,
};


function getFilteredSteps(state: RootState): CalculatedStep[] {
    return state.edit.mode === Mode.VIEW
        ? filterSteps(
            getCurrentCalcSequence(state.sequenceModel)?.calculatedSteps || [],
            state.sequenceModel.activeFilter,
            getCurrentSequenceModel(state.sequenceModel)?.sequenceStepCTOs || [],
        )
        : [];
}

function getCurrentCalcSequence(state: SequenceModelState): CalcSequence | null {
    return state.selectedChain
        ? state.calcChain?.calcLinks[state.currentLinkIndex].sequence || null
        : state.calcSequence;
}

function getCurrentSequenceModel(state: SequenceModelState): SequenceCTO | null {
    return state.selectedChain
        ? state.calcChain?.calcLinks[state.currentLinkIndex].sequence.sequenceModel || null
        : state.selectedSequenceModel;
}

function getCurrentSequenceConfiguration(state: SequenceModelState): SequenceConfigurationTO | null {
    return state.selectedChain
        ? state.calcChain?.calcLinks[state.currentLinkIndex].sequenceConfiguration || null
        : state.selectedSequenceConfiguration;
}

const mapInitDataToActorData = (initData: InitDataTO): ActorData => {
    return {
        state: ActorDataState.PERSISTENT,
        actorFk: initData.actorFk,
        dataFk: initData.dataFk,
        instanceFk: initData.instanceFk,
    };
};
// =============================================== ACTIONS ===============================================

export const SequenceModelActions = {
    setCurrentSequence: SequenceModelSlice.actions.setSelectedSequence,
    setCurrentSequenceById: setSelectedSequenceByIdThunk,
    setCurrentSequenceByIdWithStates: setSelectedSequenceByIdWithStatesThunk,
    setCurrentSequenceConfigurationById: getSequenceConfigurationFromBackend,
    setCurrentSequenceConfiguration: SequenceModelSlice.actions.setSelectedSequenceConfiguration,
    resetCurrentSequenceConfiguration: SequenceModelSlice.actions.setSelectedSequenceConfiguration(null),
    resetCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex(-1),
    resetCurrentSequence: SequenceModelSlice.actions.setSelectedSequence(null),
    resetCurrentChain: SequenceModelSlice.actions.setSelectedChain(null),
    resetAll: resetAll(),
    setCurrentStepIndex: SequenceModelSlice.actions.setCurrentStepIndex,
    setCurrentLinkIndex: SequenceModelSlice.actions.setCurrentLinkIndex,
    handleActorClickEvent: handleActorClickEvent,
    handleDataClickEvent,
    stepNext,
    stepBack,
    linkBack,
    linkNext,
    setCurrentChain: setSelectedChainThunk,
    setCurrentChainConfiguration: SequenceModelSlice.actions.setSelectedChainConfiguration,
    addDataFilters: SequenceModelSlice.actions.addDataFilter,
    removeDataFilters: SequenceModelSlice.actions.removeDataFilter,
    addActorFilters: SequenceModelSlice.actions.addActorFilters,
    removeActorFilter: SequenceModelSlice.actions.removeActorFilter,
    setViewLevel: setViewLevelThunk,
};
