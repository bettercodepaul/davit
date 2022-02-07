import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Arrow, ArrowType } from "../components/atomic/svg/DavitPath";
import { ActorCTO } from "../dataAccess/access/cto/ActorCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { GeometricalDataCTO } from "../dataAccess/access/cto/GeometraicalDataCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { ChainDecisionTO } from "../dataAccess/access/to/ChainDecisionTO";
import { ChainlinkTO } from "../dataAccess/access/to/ChainlinkTO";
import { ChainTO } from "../dataAccess/access/to/ChainTO";
import { ConditionTO } from "../dataAccess/access/to/ConditionTO";
import { DataInstanceTO } from "../dataAccess/access/to/DataInstanceTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { InitDataTO } from "../dataAccess/access/to/InitDataTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { ActionType } from "../dataAccess/access/types/ActionType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { AppThunk, RootState } from "../store";
import { DavitUtil } from "../utils/DavitUtil";
import { GlobalActions } from "./GlobalSlice";
import { masterDataSelectors } from "./MasterDataSlice";
import { SequenceModelActions } from "./SequenceModelSlice";
import { EditActor } from "./thunks/ActorThunks";
import { EditChainDecision } from "./thunks/ChainDecisionThunks";
import { EditChainLink } from "./thunks/ChainLinkThunks";
import { EditChain } from "./thunks/ChainThunks";
import { EditDataSetup } from "./thunks/DataSetupThunks";
import { EditData } from "./thunks/DataThunks";
import { EditDecision } from "./thunks/DecisionThunks";
import { EditGroup } from "./thunks/GroupThunks";
import { EditInitData } from "./thunks/InitDataThunks";
import { EditRelation } from "./thunks/RelationThunks";
import { EditSequence } from "./thunks/SequenceThunks";
import { EditStep } from "./thunks/StepThunks";

export enum Mode {
    TAB = "TAB",
    FILE = "FILE",
    VIEW = "VIEW",
    EDIT = "EDIT",
    EDIT_ACTOR = "EDIT_ACTOR",
    EDIT_GROUP = "EDIT_GROUP",
    EDIT_DATA = "EDIT_DATA",
    EDIT_DATA_INSTANCE = "EDIT_DATA_INSTANCE",
    EDIT_RELATION = "EDIT_RELATION",
    EDIT_DATASETUP = "EDIT_DATASETUP",
    EDIT_DATASETUP_INITDATA = "EDIT_DATASETUP_INIT DATA",
    EDIT_CHAIN = "EDIT_CHAIN",
    EDIT_CHAIN_DECISION = "EDIT_CHAIN_DECISION",
    EDIT_CHAIN_DECISION_CONDITION = "EDIT_CHAIN_DECISION_CONDITION",
    EDIT_CHAIN_LINK = "EDIT_CHAIN_LINK",
    EDIT_SEQUENCE = "EDIT_SEQUENCE",
    EDIT_SEQUENCE_DECISION = "EDIT_SEQUENCE_DECISION",
    EDIT_SEQUENCE_DECISION_CONDITION = "EDIT_SEQUENCE_DECISION_CONDITION",
    EDIT_SEQUENCE_STEP = "EDIT_SEQUENCE_STEP",
    EDIT_SEQUENCE_STEP_ACTION = "EDIT_SEQUENCE_STEP_ACTION",
}

const MODE_LOCAL_STORAGE = "MODE";

export interface StepAction {
    step: SequenceStepCTO;
    actionTO: ActionTO;
}

export interface EmptyObjectToEdit {
}

interface EditState {
    mode: Mode;
    objectToEdit:
        | ActorCTO
        | DataCTO
        | DataRelationTO
        | SequenceTO
        | SequenceStepCTO
        | StepAction
        | DataSetupCTO
        | InitDataTO
        | GroupTO
        | DecisionTO
        | ChainlinkTO
        | ChainDecisionTO
        | ActionTO
        | ConditionTO
        | EmptyObjectToEdit;
    instanceId: number;
}

const getInitialState: EditState = {
    objectToEdit: {} as EmptyObjectToEdit,
    mode: Mode.EDIT,
    instanceId: -1,
};

const EditSlice = createSlice({
    name: "edit",
    initialState: getInitialState,
    reducers: {
        setChainLinkToEdit: (state, action: PayloadAction<ChainlinkTO>) => {
            if (state.mode === Mode.EDIT_CHAIN_LINK) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set chain step to edit in mode: " + state.mode);
            }
        },
        setInstanceId: (state, action: PayloadAction<number>) => {
            state.instanceId = action.payload;
        },
        setChainDecisionToEdit: (state, action: PayloadAction<ChainDecisionTO>) => {
            if (state.mode === Mode.EDIT_CHAIN_DECISION || state.mode === Mode.EDIT_CHAIN_DECISION_CONDITION) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set chain step to edit in mode: " + state.mode);
            }
        },
        setActorToEdit: (state, action: PayloadAction<ActorCTO>) => {
            if (state.mode === Mode.EDIT_ACTOR) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set actor to edit in mode: " + state.mode);
            }
        },
        setDataToEdit: (state, action: PayloadAction<DataCTO>) => {
            if (state.mode === Mode.EDIT_DATA || state.mode === Mode.EDIT_DATA_INSTANCE) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set data to edit in mode: " + state.mode);
            }
        },
        setInstanceToEdit: (state, action: PayloadAction<DataInstanceTO>) => {
            if (state.mode === Mode.EDIT_DATA_INSTANCE) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set data to edit in mode: " + state.mode);
            }
        },
        setRelationToEdit: (state, action: PayloadAction<DataRelationTO>) => {
            if (state.mode === Mode.EDIT_RELATION) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set relation to edit in mode: " + state.mode);
            }
        },
        setSequenceToEdit: (state, action: PayloadAction<SequenceTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set sequence to edit in mode: " + state.mode);
            }
        },
        setStepToEdit: (state, action: PayloadAction<SequenceStepCTO>) => {
            if (state.mode.startsWith(Mode.EDIT_SEQUENCE_STEP)) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set step to edit in mode: " + state.mode);
            }
        },
        setActionToEdit: (state, action: PayloadAction<ActionTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set action to edit in mode: " + state.mode);
            }
        },
        setDataSetupToEdit: (state, action: PayloadAction<DataSetupCTO>) => {
            if (state.mode === Mode.EDIT_DATASETUP) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set dataSetup to edit in mode: " + state.mode);
            }
        },
        setInitDataToEdit: (state, action: PayloadAction<InitDataTO>) => {
            if (state.mode === Mode.EDIT_DATASETUP_INITDATA) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set initData to edit in mode: " + state.mode);
            }
        },
        setGroupToEdit: (state, action: PayloadAction<GroupTO>) => {
            if (state.mode === Mode.EDIT_GROUP) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set group to edit in mode: " + state.mode);
            }
        },
        setDecisionToEdit: (state, action: PayloadAction<DecisionTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set decision to edit in mode: " + state.mode);
            }
        },
        setConditionToEdit: (state, action: PayloadAction<ConditionTO>) => {
            if (state.mode === Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
                state.objectToEdit = action.payload;
            } else {
                console.warn("Try to set decision to edit in mode: " + state.mode);
            }
        },
        clearObjectToEdit: (state) => {
            state.objectToEdit = {} as EmptyObjectToEdit;
        },
        setMode: (state, action: PayloadAction<Mode>) => {
            state.mode = action.payload;
        },
    },
});

export const editActions = EditSlice.actions;

// =============================================== THUNKS ===============================================

// ----------------------------------------------- SET MODE -----------------------------------------------
const setModeWithStorageThunk = (mode: Mode): AppThunk => (dispatch, getstate) => {
    if (mode !== getstate().edit.mode) {
        localStorage.setItem(MODE_LOCAL_STORAGE, mode);
        dispatch(EditSlice.actions.setMode(mode));
    }
};

const setModeToFileThunk = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorageThunk(Mode.FILE));
};

const setModeToTabThunk = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorageThunk(Mode.TAB));
};

const setModeToViewThunk = (): AppThunk => (dispatch) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    dispatch(setModeWithStorageThunk(Mode.VIEW));
    dispatch(SequenceModelActions.calcChain());
};

const setModeToEditThunk = (): AppThunk => (dispatch, getState) => {
    dispatch(EditSlice.actions.clearObjectToEdit());
    if (getState().edit.mode !== Mode.VIEW) {
        dispatch(setModeWithStorageThunk(Mode.EDIT));
    } else {
        const stepIndex: number | null = getState().sequenceModel.currentStepIndex;
        if (stepIndex !== null && stepIndex > 0) {
            const step:
                | SequenceStepCTO
                | undefined = getState().sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find(
                (step) => step.squenceStepTO.id === stepIndex,
            );
            if (step) {
                dispatch(setModeToEditStepThunk(step));
            } else {
                dispatch(setModeWithStorageThunk(Mode.EDIT));
            }
        } else {
            dispatch(setModeWithStorageThunk(Mode.EDIT));
        }
    }
};

const setModeToEditActorThunk = (actor?: ActorCTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_ACTOR));
    if (actor === undefined) {
        dispatch(EditActor.create());
    } else {
        dispatch(EditSlice.actions.setActorToEdit(actor));
    }
};

const setModeToEditActorByIdThunk = (id: number): AppThunk => (dispatch, getState) => {
    const actor: ActorCTO | undefined = getState().masterData.actors.find((act) => act.actor.id === id);
    if (actor) {
        dispatch(setModeWithStorageThunk(Mode.EDIT_ACTOR));
        dispatch(EditSlice.actions.setActorToEdit(actor));
    }
};
const setModeToEditDataByIdThunk = (id: number): AppThunk => (dispatch, getState) => {
    const data: DataCTO | undefined = getState().masterData.datas.find((data) => data.data.id === id);
    if (data) {
        dispatch(setModeWithStorageThunk(Mode.EDIT_DATA));
        dispatch(EditSlice.actions.setDataToEdit(data));
    }
};

const editDataInstanceByIdThunk = (id: number): AppThunk => (dispatch, getState) => {
    if ((getState().edit.objectToEdit as DataCTO).data) {
        dispatch(setModeWithStorageThunk(Mode.EDIT_DATA_INSTANCE));
        dispatch(EditSlice.actions.setInstanceId(id));
    } else {
        dispatch(setModeWithStorageThunk(Mode.EDIT));
    }
};

const setModeToEditDataThunk = (data?: DataCTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_DATA));
    if (data === undefined) {
        dispatch(EditData.create());
    } else {
        dispatch(EditSlice.actions.setDataToEdit(data));
    }
};

const setModeToEditDataInstanceThunk = (id?: number): AppThunk => (dispatch, getState) => {
    if ((getState().edit.objectToEdit as DataCTO).data) {
        if (id === undefined) {
            const copyData: DataCTO = DavitUtil.deepCopy(getState().edit.objectToEdit as DataCTO);
            const newInstance: DataInstanceTO = new DataInstanceTO();
            newInstance.id = copyData.data.instances.length;
            copyData.data.instances.push(newInstance);
            dispatch(EditSlice.actions.setDataToEdit(copyData));
            id = newInstance.id;
        }
        dispatch(EditSlice.actions.setInstanceId(id));
        dispatch(setModeWithStorageThunk(Mode.EDIT_DATA_INSTANCE));
    }
};

const setModeToEditRelationThunk = (relation?: DataRelationTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_RELATION));
    if (relation === undefined) {
        dispatch(EditRelation.create());
    } else {
        dispatch(EditSlice.actions.setRelationToEdit(relation));
    }
};

const setModeToEditSequenceThunk = (sequenceId?: number): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_SEQUENCE));
    if (sequenceId) {
        // TODO: change CTO to TO.
        const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setSequenceToEdit(DavitUtil.deepCopy(response.object.sequenceTO)));
            dispatch(SequenceModelActions.setCurrentSequence(sequenceId));
        } else {
            dispatch(GlobalActions.handleError(response.message));
        }
    } else {
        dispatch(EditSequence.create());
    }
};

const setModeToEditChainThunk = (chain?: ChainTO): AppThunk => (dispatch) => {
    if (!chain) {
        dispatch(EditChain.create());
    } else {
        dispatch(SequenceModelActions.setCurrentChain(chain));
    }
    dispatch(setModeWithStorageThunk(Mode.EDIT_CHAIN));
};

const setModeToEditChainLinkThunk = (
    chainLink: ChainlinkTO,
    from?: ChainlinkTO | ChainDecisionTO,
    ifGoTo?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_CHAIN_LINK));
    dispatch(EditChainLink.create(chainLink, from, ifGoTo));
};

const setModeEditChainDecisionThunk = (
    chainDecision: ChainDecisionTO,
    from?: ChainDecisionTO | ChainlinkTO,
    ifGoTO?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_CHAIN_DECISION));
    dispatch(EditChainDecision.create(chainDecision, from, ifGoTO));
};

const setModeToEditChainConditionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
    if (decision !== null && decision !== undefined) {
        dispatch(setModeWithStorageThunk(Mode.EDIT_CHAIN_DECISION_CONDITION));
    } else {
        dispatch(GlobalActions.handleError("Edit Condition: 'Decision is null or undefined'."));
    }
};

const setModeToEditStepThunk = (
    stepCTO: SequenceStepCTO,
    from?: SequenceStepCTO | DecisionTO,
    ifGoTo?: boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_SEQUENCE_STEP));
    dispatch(EditStep.create(stepCTO, from, ifGoTo));
};

const setModeToEditActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_SEQUENCE_STEP_ACTION));
    dispatch(EditSlice.actions.setActionToEdit(action));
};

const setModeToEditGroupThunk = (group?: GroupTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_GROUP));
    if (group === undefined) {
        dispatch(EditGroup.create());
    } else {
        dispatch(EditSlice.actions.setGroupToEdit(group));
    }
};

const setModeToEditInitDataThunk = (initData: InitDataTO): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_DATASETUP_INITDATA));
    if (initData.id !== -1) {
        const response: DataAccessResponse<InitDataTO> = DataAccess.findInitData(initData.id);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setInitDataToEdit(DavitUtil.deepCopy(response.object)));
        } else {
            dispatch(GlobalActions.handleError(response.message));
        }
    } else {
        dispatch(EditInitData.save(initData));
    }
};

const setModeToEditDataSetupThunk = (id?: number): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_DATASETUP));
    if (id) {
        const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(id);
        if (response.code === 200) {
            dispatch(EditSlice.actions.setDataSetupToEdit(DavitUtil.deepCopy(response.object)));
        } else {
            dispatch(GlobalActions.handleError(response.message));
        }
    } else {
        dispatch(EditDataSetup.create());
    }
};

const setModeToEditDecisionThunk = (
    decision: DecisionTO,
    from?: SequenceStepCTO | DecisionTO,
    ifGoTo?: Boolean,
): AppThunk => (dispatch) => {
    dispatch(setModeWithStorageThunk(Mode.EDIT_SEQUENCE_DECISION));
    dispatch(EditDecision.create(decision, from, ifGoTo));
};

const setModeToEditConditionThunk = (decision: DecisionTO, condition?: ConditionTO): AppThunk => (dispatch) => {
    if (!DavitUtil.isNullOrUndefined(decision)) {
        dispatch(setModeWithStorageThunk(Mode.EDIT_SEQUENCE_DECISION_CONDITION));
        if (condition) {
            dispatch(editActions.setConditionToEdit(condition));
        } else {
            const copyDecision: DecisionTO = DavitUtil.deepCopy(decision);
            // create new condition
            let newCondition: ConditionTO | undefined = new ConditionTO();
            newCondition.decisionFk = decision.id;
            copyDecision.conditions.push(newCondition);
            // save decision
            dispatch(EditDecision.save(copyDecision));
            // get new decision with new id.
            const updatedDecision: DecisionTO = EditDecision.find(copyDecision.id);

            // get new condition with new id.
            newCondition = updatedDecision.conditions.find(
                (condition) => condition.actorFk === -1 && condition.dataFk === -1,
            );

            if (newCondition) {
                dispatch(editActions.setConditionToEdit(newCondition));
            }
        }
    } else {
        dispatch(GlobalActions.handleError("Edit Condition: 'Decision is null or undefined'."));
    }
};

// TODO: this method is copied from sequencemodelslice! remove one and mage the other reachable in both slices
const getArrowsForStepFk = (sequenceStepCTO: SequenceStepCTO, rootState: RootState): Arrow[] => {
    let arrows: Arrow[];
    arrows = mapActionsToArrows(sequenceStepCTO.actions, rootState);
    return arrows;
};

// TODO: this method is copied from sequencemodelslice! remove one and make the other reachable in both slices
const mapActionsToArrows = (actions: ActionTO[], state: RootState): Arrow[] => {
    const arrows: Arrow[] = [];

    actions.forEach((action) => {
        const sourceGeometricalData: GeometricalDataCTO | undefined = state.masterData.actors.find(
            (comp) => comp.actor.id === action.sendingActorFk,
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
export const EditReducer = EditSlice.reducer;
/**
 * To make it easy to select the right obejct to edit we have selectors that ensure that the right object to edit is returned for the mode
 * Since the object to edit is a sumtype we ensure the right type by checking for a unqiue field
 */
export const editSelectors = {
    selectMode: (state: RootState): Mode => state.edit.mode,
    selectActorToEdit: (state: RootState): ActorCTO | null => {
        return state.edit.mode === Mode.EDIT_ACTOR && (state.edit.objectToEdit as ActorCTO).actor
            ? (state.edit.objectToEdit as ActorCTO)
            : null;
    },
    selectChainLinkToEdit: (state: RootState): ChainlinkTO | null => {
        return state.edit.mode === Mode.EDIT_CHAIN_LINK && (state.edit.objectToEdit as ChainlinkTO).dataSetupFk
            ? (state.edit.objectToEdit as ChainlinkTO)
            : null;
    },
    selectChainDecisionToEdit: (state: RootState): ChainDecisionTO | null => {
        return state.edit.mode === Mode.EDIT_CHAIN_DECISION ||
        (state.edit.mode === Mode.EDIT_CHAIN_DECISION_CONDITION &&
            (state.edit.objectToEdit as ChainDecisionTO).elseGoTo)
            ? (state.edit.objectToEdit as ChainDecisionTO)
            : null;
    },
    selectDataToEdit: (state: RootState): DataCTO | null => {
        return state.edit.mode === Mode.EDIT_DATA ||
        (Mode.EDIT_DATA_INSTANCE && (state.edit.objectToEdit as DataCTO).data)
            ? (state.edit.objectToEdit as DataCTO)
            : null;
    },
    selectGroupToEdit: (state: RootState): GroupTO | null => {
        return state.edit.mode === Mode.EDIT_GROUP && (state.edit.objectToEdit as GroupTO).color
            ? (state.edit.objectToEdit as GroupTO)
            : null;
    },
    selectRelationToEdit: (state: RootState): DataRelationTO | null => {
        return state.edit.mode === Mode.EDIT_RELATION && (state.edit.objectToEdit as DataRelationTO).direction1
            ? (state.edit.objectToEdit as DataRelationTO)
            : null;
    },
    selectSequenceToEdit: (state: RootState): SequenceTO | null => {
        return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceTO)
            ? (state.edit.objectToEdit as SequenceTO)
            : null;
    },
    selectEditActionArrow: (state: RootState): Arrow | null => {
        if (
            state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION &&
            (state.edit.objectToEdit as ActionTO).receivingActorFk
        ) {
            const actionToEdit: ActionTO = state.edit.objectToEdit as ActionTO;

            const sourceComp: ActorCTO | undefined = state.masterData.actors.find(
                (comp) => comp.actor.id === actionToEdit.sendingActorFk,
            );

            const targetComp: ActorCTO | undefined = state.masterData.actors.find(
                (comp) => comp.actor.id === actionToEdit.receivingActorFk,
            );

            const dataLabel: string =
                actionToEdit.actionType === ActionType.TRIGGER
                    ? actionToEdit.triggerText
                    : masterDataSelectors.selectDataCTOById(actionToEdit.dataFk)(state)?.data.name ||
                    "Could not find data";

            const type: ArrowType = actionToEdit.actionType.includes("SEND") ? ArrowType.SEND : ArrowType.TRIGGER;

            if (sourceComp && targetComp) {
                return {
                    sourceGeometricalData: sourceComp.geometricalData,
                    targetGeometricalData: targetComp.geometricalData,
                    dataLabels: [dataLabel],
                    type: type,
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
    selectEditStepArrows: (state: RootState): Arrow[] => {
        let arrows: Arrow[] = [];

        if (state.edit.mode === Mode.EDIT_SEQUENCE_STEP && (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO) {
            arrows = getArrowsForStepFk(state.edit.objectToEdit as SequenceStepCTO, state);
        }
        return arrows;
    },
    selectDataSetupToEdit: (state: RootState): DataSetupCTO | null => {
        return state.edit.mode === Mode.EDIT_DATASETUP && (state.edit.objectToEdit as DataSetupCTO).dataSetup
            ? (state.edit.objectToEdit as DataSetupCTO)
            : null;
    },
    selectInitDataToEdit: (state: RootState): InitDataTO | null => {
        return state.edit.mode === Mode.EDIT_DATASETUP_INITDATA && (state.edit.objectToEdit as InitDataTO).dataSetupFk
            ? (state.edit.objectToEdit as InitDataTO)
            : null;
    },
    selectStepToEdit: (state: RootState): SequenceStepCTO | null => {
        switch (state.edit.mode) {
            case Mode.EDIT_SEQUENCE_STEP:
                return (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO
                    ? (state.edit.objectToEdit as SequenceStepCTO)
                    : null;
            case Mode.EDIT_SEQUENCE_STEP_ACTION:
                return (state.edit.objectToEdit as StepAction).step
                    ? (state.edit.objectToEdit as StepAction).step
                    : null;
            default:
                return null;
        }
    },
    selectActionToEdit: (state: RootState): ActionTO | null => {
        return state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION && (state.edit.objectToEdit as ActionTO).actionType
            ? (state.edit.objectToEdit as ActionTO)
            : null;
    },
    selectDecisionToEdit: (state: RootState): DecisionTO | null => {
        return (state.edit.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) &&
        (state.edit.objectToEdit as DecisionTO).conditions
            ? (state.edit.objectToEdit as DecisionTO)
            : null;
    },
    selectConditionToEdit: (state: RootState): ConditionTO | null => {
        return state.edit.mode === Mode.EDIT_SEQUENCE_DECISION_CONDITION &&
        (state.edit.objectToEdit as ConditionTO).decisionFk
            ? (state.edit.objectToEdit as ConditionTO)
            : null;
    },
    selectInstanceIdToEdit: (state: RootState): number => {
        return state.edit.instanceId;
    },
};

// =============================================== ACTIONS ===============================================

export const EditActions = {
    setMode: {
        editActor: setModeToEditActorThunk,
        editActorById: setModeToEditActorByIdThunk,
        editData: setModeToEditDataThunk,
        editDataById: setModeToEditDataByIdThunk,
        editDataInstance: setModeToEditDataInstanceThunk,
        editInstanceById: editDataInstanceByIdThunk,
        editGroup: setModeToEditGroupThunk,
        editRelation: setModeToEditRelationThunk,
        editSequence: setModeToEditSequenceThunk,
        editDataSetup: setModeToEditDataSetupThunk,
        editInitData: setModeToEditInitDataThunk,
        editStep: setModeToEditStepThunk,
        editDecision: setModeToEditDecisionThunk,
        editCondition: setModeToEditConditionThunk,
        editAction: setModeToEditActionThunk,
        editChain: setModeToEditChainThunk,
        editChainLink: setModeToEditChainLinkThunk,
        editChainDecision: setModeEditChainDecisionThunk,
        editChainCondition: setModeToEditChainConditionThunk,
        edit: setModeToEditThunk,
        view: setModeToViewThunk,
        file: setModeToFileThunk,
        tab: setModeToTabThunk,
    },
};
