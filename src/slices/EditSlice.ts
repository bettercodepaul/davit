import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isNullOrUndefined } from "util";
import { AppThunk, RootState } from "../app/store";
import { ComponentCTO } from "../dataAccess/access/cto/ComponentCTO";
import { DataCTO } from "../dataAccess/access/cto/DataCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { ActionTO } from "../dataAccess/access/to/ActionTO";
import { DataRelationTO } from "../dataAccess/access/to/DataRelationTO";
import { DataInstanceTO } from "../dataAccess/access/to/DataTO";
import { DecisionTO } from "../dataAccess/access/to/DecisionTO";
import { GroupTO } from "../dataAccess/access/to/GroupTO";
import { InitDataTO } from "../dataAccess/access/to/InitDataTO";
import { SequenceStepTO } from "../dataAccess/access/to/SequenceStepTO";
import { SequenceTO } from "../dataAccess/access/to/SequenceTO";
import { GoToTypes } from "../dataAccess/access/types/GoToType";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { Carv2Util } from "../utils/Carv2Util";
import { handleError } from "./GlobalSlice";
import { MasterDataActions } from "./MasterDataSlice";
import { SequenceModelActions } from "./SequenceModelSlice";

export enum Mode {
  TAB = "TAB",
  FILE = "FILE",
  VIEW = "VIEW",
  EDIT = "EDIT",
  EDIT_COMPONENT = "EDIT_COMPONENT",
  EDIT_GROUP = "EDIT_GROUP",
  EDIT_DATA = "EDIT_DATA",
  EDIT_DATA_INSTANCE = "EDIT_DATA_INSTANCE",
  EDIT_DATA_RELATION = "EDIT_DATA_RELATION",
  EDIT_DATA_SETUP = "EDIT_DATA_SETUP",
  EDIT_INIT_DATA = "EDIT_INIT_DATA",
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

interface EditState {
  mode: Mode;
  objectToEdit:
    | ComponentCTO
    | DataCTO
    | DataRelationTO
    | SequenceTO
    | SequenceStepCTO
    | StepAction
    | DataSetupCTO
    | InitDataTO
    | GroupTO
    | DecisionTO
    | {};
  instanceIdToEdit: number | null;
}
const getInitialState: EditState = {
  objectToEdit: {},
  mode: Mode.EDIT,
  instanceIdToEdit: null,
};

const EditSlice = createSlice({
  name: "edit",
  initialState: getInitialState,
  reducers: {
    setInstanceIdToEdit: (state, action: PayloadAction<number | null>) => {
      state.instanceIdToEdit = action.payload;
    },
    setComponentToEdit: (state, action: PayloadAction<ComponentCTO>) => {
      if (state.mode === Mode.EDIT_COMPONENT) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set component to edit in mode: " + state.mode);
      }
    },
    setDataToEdit: (state, action: PayloadAction<DataCTO>) => {
      if (state.mode === Mode.EDIT_DATA || Mode.EDIT_DATA_INSTANCE) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set data to edit in mode: " + state.mode);
      }
    },
    setRelationToEdit: (state, action: PayloadAction<DataRelationTO>) => {
      if (state.mode === Mode.EDIT_DATA_RELATION) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set relation to edit in mode: " + state.mode);
      }
    },
    setSequenceToEdit: (state, action: PayloadAction<SequenceTO>) => {
      if (state.mode === Mode.EDIT_SEQUENCE) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set sequence to edit in mode: " + state.mode);
      }
    },
    setStepToEdit: (state, action: PayloadAction<SequenceStepCTO>) => {
      if (state.mode.startsWith(Mode.EDIT_SEQUENCE_STEP)) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set step to edit in mode: " + state.mode);
      }
    },
    setActionToEdit: (state, action: PayloadAction<ActionTO>) => {
      if (state.mode === Mode.EDIT_SEQUENCE_STEP_ACTION) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set action to edit in mode: " + state.mode);
      }
    },
    setDataSetupToEdit: (state, action: PayloadAction<DataSetupCTO>) => {
      if (state.mode === Mode.EDIT_DATA_SETUP) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set dataSetup to edit in mode: " + state.mode);
      }
    },
    setInitDataToEdit: (state, action: PayloadAction<InitDataTO>) => {
      if (state.mode === Mode.EDIT_INIT_DATA) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set initData to edit in mode: " + state.mode);
      }
    },
    setGroupToEdit: (state, action: PayloadAction<GroupTO>) => {
      if (state.mode === Mode.EDIT_GROUP) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set group to edit in mode: " + state.mode);
      }
    },
    setDecisionToEdit: (state, action: PayloadAction<DecisionTO>) => {
      if (state.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set decision to edit in mode: " + state.mode);
      }
    },
    clearObjectToEdit: (state) => {
      state.objectToEdit = {};
    },
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload;
    },
  },
});

// =============================================== THUNKS ===============================================

// ----------------------------------------------- SET MODE -----------------------------------------------
const setModeWithStorage = (mode: Mode): AppThunk => (dispatch) => {
  localStorage.setItem(MODE_LOCAL_STORAGE, mode);
  dispatch(EditSlice.actions.setMode(mode));
};

const setModeToFile = (): AppThunk => (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.FILE));
};

const setModeToTab = (): AppThunk => (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.TAB));
};

const setModeToView = (): AppThunk => (dispatch) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.VIEW));
};

const setModeToEdit = (): AppThunk => (dispatch) => {
  // TODO: dosn't fells right to do this here!
  dispatch(SequenceModelActions.resetCurrentSequence);
  dispatch(EditSlice.actions.clearObjectToEdit());
  dispatch(setModeWithStorage(Mode.EDIT));
};

const setModeToEditComponent = (component?: ComponentCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
  if (component === undefined) {
    dispatch(EditActions.component.create());
  } else {
    dispatch(EditSlice.actions.setComponentToEdit(component));
  }
};

const setModeToEditData = (data?: DataCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
  if (data === undefined) {
    dispatch(EditActions.data.create());
  } else {
    dispatch(EditSlice.actions.setDataToEdit(data));
  }
};

const setModeToEditDataInstance = (data: DataCTO, id?: number): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_INSTANCE));
  if (id === undefined) {
    dispatch(EditActions.data.createInstance(data));
  } else {
    dispatch(EditSlice.actions.setInstanceIdToEdit(id));
  }
};

const setModeToEditRelation = (relation?: DataRelationTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_RELATION));
  if (relation === undefined) {
    dispatch(EditActions.relation.create());
  } else {
    dispatch(EditSlice.actions.setRelationToEdit(relation));
  }
};

const setModeToEditSequence = (sequenceId?: number): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE));
  if (sequenceId) {
    // TODO: change CTO to TO.
    let response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setSequenceToEdit(Carv2Util.deepCopy(response.object.sequenceTO)));
      dispatch(SequenceModelActions.setCurrentSequence(sequenceId));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditActions.sequence.create());
  }
};

const setModeToEditStep = (
  stepCTO: SequenceStepCTO,
  from?: SequenceStepCTO | DecisionTO,
  ifGoTo?: Boolean
): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP));
  dispatch(EditActions.step.create(stepCTO, from, ifGoTo));
};

const setModeToEditAction = (action: ActionTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_STEP_ACTION));
  dispatch(EditSlice.actions.setActionToEdit(action));
};

const setModeToEditGroup = (group?: GroupTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_GROUP));
  if (group === undefined) {
    dispatch(EditActions.group.create());
  } else {
    dispatch(EditSlice.actions.setGroupToEdit(group));
  }
};

const setModeToEditInitData = (initData: InitDataTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_INIT_DATA));
  if (initData.id !== -1) {
    let response: DataAccessResponse<InitDataTO> = DataAccess.findInitData(initData.id);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setInitDataToEdit(Carv2Util.deepCopy(response.object)));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditActions.initData.save(initData));
  }
};

const setModeToEditDataSetup = (id?: number): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_SETUP));
  if (id) {
    let response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(id);
    if (response.code === 200) {
      dispatch(EditSlice.actions.setDataSetupToEdit(Carv2Util.deepCopy(response.object)));
    } else {
      handleError(response.message);
    }
  } else {
    dispatch(EditActions.dataSetup.create());
  }
};

const setModeToEditDecision = (
  decision: DecisionTO,
  from?: SequenceStepCTO | DecisionTO,
  ifGoTo?: Boolean
): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_DECISION));
  dispatch(EditActions.decision.create(decision, from, ifGoTo));
};

const setModeToEditCondition = (decision: DecisionTO): AppThunk => (dispatch) => {
  if (!isNullOrUndefined(decision)) {
    dispatch(setModeWithStorage(Mode.EDIT_SEQUENCE_DECISION_CONDITION));
    // dispatch(EditSlice.actions.setDecisionToEdit(decision));
  } else {
    handleError("Edit Condition: 'Decision is null or undefined'.");
  }
};

// ----------------------------------------------- COMPONENT -----------------------------------------------

const createComponentThunk = (): AppThunk => (dispatch) => {
  let component: ComponentCTO = new ComponentCTO();
  // component.component.name = "neu";
  const response: DataAccessResponse<ComponentCTO> = DataAccess.saveComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
  dispatch(EditActions.component.update(response.object));
};

const saveComponentThunk = (component: ComponentCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = DataAccess.saveComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

const deleteComponentThunk = (component: ComponentCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ComponentCTO> = await DataAccess.deleteComponentCTO(component);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

// ----------------------------------------------- GROUP -----------------------------------------------

const createGroupThunk = (): AppThunk => (dispatch) => {
  let group: GroupTO = new GroupTO();
  const response: DataAccessResponse<GroupTO> = DataAccess.saveGroup(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
  dispatch(EditActions.group.update(response.object));
};

const saveGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.saveGroup(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
};

const deleteGroupThunk = (group: GroupTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<GroupTO> = await DataAccess.deleteGroupTO(group);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadGroupsFromBackend());
  dispatch(MasterDataActions.loadComponentsFromBackend());
};

// ----------------------------------------------- DATA -----------------------------------------------

const createDataThunk = (): AppThunk => (dispatch) => {
  let data: DataCTO = new DataCTO();
  const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(EditActions.data.update(response.object));
};

const createDataInstanceThunk = (data: DataCTO): AppThunk => (dispatch) => {
  let dataInstance: DataInstanceTO = new DataInstanceTO();
  dataInstance.dataFk = data.data.id;
  dataInstance.id = data.data.inst.length;
  data.data.inst.push(dataInstance);
  const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(EditSlice.actions.setInstanceIdToEdit(dataInstance.id));
  dispatch(EditActions.data.update(response.object));
};

const saveDataThunk = (data: DataCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
};

const deleteDataThunk = (data: DataCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataCTO> = await DataAccess.deleteDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDatasFromBackend());
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

// ----------------------------------------------- RELATION -----------------------------------------------

const createRelationThunk = (): AppThunk => (dispatch) => {
  let relation: DataRelationTO = new DataRelationTO();
  const response: DataAccessResponse<DataRelationTO> = DataAccess.saveDataRelationCTO(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
  dispatch(EditActions.relation.update(response.object));
};

const saveRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO> = await DataAccess.saveDataRelationCTO(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

const deleteRelationThunk = (relation: DataRelationTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataRelationTO> = await DataAccess.deleteDataRelation(relation);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadRelationsFromBackend());
};

// ----------------------------------------------- DATA SETUP -----------------------------------------------

const createDataSetupThunk = (): AppThunk => (dispatch) => {
  let dataSetup: DataSetupCTO = new DataSetupCTO();
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
  dispatch(EditActions.dataSetup.update(response.object));
};

const saveDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

const deleteDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.deleteDataSetup(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

// ----------------------------------------------- Init Data -----------------------------------------------

const saveInitDataThunk = (initData: InitDataTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<InitDataTO> = DataAccess.saveInitData(initData);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(EditActions.setMode.editInitData(response.object));
};

const deleteInitDataThunk = (initDataId: number): AppThunk => (dispatch) => {
  const response: DataAccessResponse<InitDataTO> = DataAccess.deleteInitData(initDataId);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadDataSetupsFromBackend());
};

// ----------------------------------------------- SEQUENCE -----------------------------------------------

const createSequenceThunk = (): AppThunk => (dispatch) => {
  let sequence: SequenceTO = new SequenceTO();
  const response: DataAccessResponse<SequenceTO> = DataAccess.saveSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
  dispatch(EditActions.sequence.update(response.object));
  dispatch(SequenceModelActions.setCurrentSequence(response.object.id));
};

const saveSequenceThunk = (sequence: SequenceTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceTO> = DataAccess.saveSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
  dispatch(EditSlice.actions.setSequenceToEdit(response.object));
  dispatch(SequenceModelActions.setCurrentSequence(response.object.id));
};

const deleteSequenceThunk = (sequence: SequenceTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceTO> = await DataAccess.deleteSequenceTO(sequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const getSequenceCTOById = (sequenceId: number): SequenceCTO | null => {
  const response: DataAccessResponse<SequenceCTO> = DataAccess.findSequenceCTO(sequenceId);
  if (response.code !== 200) {
    return null;
  }
  return response.object;
};

const setRootThunk = (sequenceId: number, rootId: number, isDecision: boolean): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceStepTO | DecisionTO> = DataAccess.setRoot(sequenceId, rootId, isDecision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

// ----------------------------------------------- SEQUENCE STEP -----------------------------------------------
const createSequenceStepThunk = (
  step: SequenceStepCTO,
  from?: SequenceStepCTO | DecisionTO,
  ifGoTO?: Boolean
): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = DataAccess.saveSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  } else {
    if (from !== undefined) {
      if ((from as SequenceStepCTO).squenceStepTO !== undefined) {
        (from as SequenceStepCTO).squenceStepTO.goto = { type: GoToTypes.STEP, id: response.object.squenceStepTO.id };
        dispatch(EditActions.step.save(from as SequenceStepCTO));
      }
      if ((from as DecisionTO).elseGoTo !== undefined) {
        if (ifGoTO) {
          (from as DecisionTO).ifGoTo = { type: GoToTypes.STEP, id: response.object.squenceStepTO.id };
        } else {
          (from as DecisionTO).elseGoTo = { type: GoToTypes.STEP, id: response.object.squenceStepTO.id };
        }
        dispatch(EditActions.decision.save(from as DecisionTO));
      }
    }
    dispatch(EditActions.step.update(response.object));
  }
};

const deleteSequenceStepThunk = (step: SequenceStepCTO, sequenceCTO?: SequenceCTO): AppThunk => (dispatch) => {
  // update forent gotos.
  if (sequenceCTO) {
    const copySequence: SequenceCTO = Carv2Util.deepCopy(sequenceCTO);
    // update steps
    copySequence.sequenceStepCTOs.forEach((item) => {
      if (item.squenceStepTO.goto.type === GoToTypes.STEP && item.squenceStepTO.goto.id === step.squenceStepTO.id) {
        item.squenceStepTO.goto = { type: GoToTypes.ERROR };
        dispatch(EditActions.step.save(item));
      }
    });
    // update decision
    copySequence.decisions.forEach((cond) => {
      if (cond.ifGoTo.type === GoToTypes.STEP && cond.ifGoTo.id === step.squenceStepTO.id) {
        cond.ifGoTo = { type: GoToTypes.ERROR };
        dispatch(EditActions.decision.save(cond));
      }
      if (cond.elseGoTo.type === GoToTypes.STEP && cond.elseGoTo.id === step.squenceStepTO.id) {
        cond.elseGoTo = { type: GoToTypes.ERROR };
        dispatch(EditActions.decision.save(cond));
      }
    });
  }
  // delete step.
  const response: DataAccessResponse<SequenceStepCTO> = DataAccess.deleteSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const saveSequenceStepThunk = (step: SequenceStepCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = DataAccess.saveSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
};

const findStepCTOThunk = (stepId: number): SequenceStepCTO => {
  const response: DataAccessResponse<SequenceStepCTO> = DataAccess.findSequenceStepCTO(stepId);
  return response.object;
};

// ----------------------------------------------- ACTION -----------------------------------------------

const createActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(EditActions.setMode.editAction(response.object));
};

const saveActionThunk = (action: ActionTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ActionTO> = DataAccess.saveActionTO(action);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
};

const deleteActionThunk = (action: ActionTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ActionTO> = await DataAccess.deleteActionCTO(action);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

// ----------------------------------------------- DECISION -----------------------------------------------

const createDecisionThunk = (decision: DecisionTO, from?: SequenceStepCTO | DecisionTO, ifGoTo?: Boolean): AppThunk => (
  dispatch
) => {
  const response: DataAccessResponse<DecisionTO> = DataAccess.saveDecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  } else {
    if (from) {
      if ((from as SequenceStepCTO).squenceStepTO !== undefined) {
        (from as SequenceStepCTO).squenceStepTO.goto = { type: GoToTypes.COND, id: response.object.id };
        dispatch(EditActions.step.save(from as SequenceStepCTO));
      }
      if ((from as DecisionTO).elseGoTo !== undefined) {
        if (ifGoTo) {
          (from as DecisionTO).ifGoTo = { type: GoToTypes.COND, id: response.object.id };
        } else {
          (from as DecisionTO).elseGoTo = { type: GoToTypes.COND, id: response.object.id };
        }
        dispatch(EditActions.decision.save(from as DecisionTO));
      }
    }
    dispatch(EditActions.decision.update(response.object));
  }
};

const saveDecisionThunk = (decision: DecisionTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DecisionTO> = DataAccess.saveDecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
};

const deleteDecisionThunk = (decision: DecisionTO, sequenceCTO?: SequenceCTO): AppThunk => (dispatch) => {
  // update forent gotos.
  if (sequenceCTO) {
    const copySequence: SequenceCTO = Carv2Util.deepCopy(sequenceCTO);
    // update steps
    copySequence.sequenceStepCTOs.forEach((step) => {
      if (step.squenceStepTO.goto.type === GoToTypes.COND && step.squenceStepTO.goto.id === decision.id) {
        step.squenceStepTO.goto = { type: GoToTypes.ERROR };
        dispatch(EditActions.step.save(step));
      }
    });
    // update decisions
    copySequence.decisions.forEach((cond) => {
      if (cond.ifGoTo.type === GoToTypes.COND && cond.ifGoTo.id === decision.id) {
        cond.ifGoTo = { type: GoToTypes.ERROR };
        dispatch(EditActions.decision.save(cond));
      }
      if (cond.elseGoTo.type === GoToTypes.COND && cond.elseGoTo.id === decision.id) {
        cond.elseGoTo = { type: GoToTypes.ERROR };
        dispatch(EditActions.decision.save(cond));
      }
    });
  }
  // delete decision.
  const response: DataAccessResponse<DecisionTO> = DataAccess.deleteDecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadSequencesFromBackend());
};

const findDecisionTOThunk = (decisionId: number): DecisionTO => {
  const response: DataAccessResponse<DecisionTO> = DataAccess.findDecision(decisionId);
  if (response.code !== 200) {
    handleError(response.message);
  }
  return response.object;
};

// =============================================== SELECTORS ===============================================
export const EditReducer = EditSlice.reducer;
/**
 * To make it easy to select the right obejct to edit we have selectors that ensure that the right object to edit is returned for the mode
 * Since the object to edit is a sumtype we ensure the right type by checking for a unqiue field
 */
export const editSelectors = {
  mode: (state: RootState): Mode => state.edit.mode,
  componentToEdit: (state: RootState): ComponentCTO | null => {
    return state.edit.mode === Mode.EDIT_COMPONENT && (state.edit.objectToEdit as ComponentCTO).component
      ? (state.edit.objectToEdit as ComponentCTO)
      : null;
  },
  dataToEdit: (state: RootState): DataCTO | null => {
    return state.edit.mode === Mode.EDIT_DATA || (Mode.EDIT_DATA_INSTANCE && (state.edit.objectToEdit as DataCTO).data)
      ? (state.edit.objectToEdit as DataCTO)
      : null;
  },
  groupToEdit: (state: RootState): GroupTO | null => {
    return state.edit.mode === Mode.EDIT_GROUP && (state.edit.objectToEdit as GroupTO).color
      ? (state.edit.objectToEdit as GroupTO)
      : null;
  },
  relationToEdit: (state: RootState): DataRelationTO | null => {
    return state.edit.mode === Mode.EDIT_DATA_RELATION && (state.edit.objectToEdit as DataRelationTO).direction1
      ? (state.edit.objectToEdit as DataRelationTO)
      : null;
  },
  sequenceToEdit: (state: RootState): SequenceTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceTO)
      ? (state.edit.objectToEdit as SequenceTO)
      : null;
  },
  dataSetupToEdit: (state: RootState): DataSetupCTO | null => {
    return state.edit.mode === Mode.EDIT_DATA_SETUP && (state.edit.objectToEdit as DataSetupCTO).dataSetup
      ? (state.edit.objectToEdit as DataSetupCTO)
      : null;
  },
  initDataToEdit: (state: RootState): InitDataTO | null => {
    return state.edit.mode === Mode.EDIT_INIT_DATA && (state.edit.objectToEdit as InitDataTO).dataSetupFk
      ? (state.edit.objectToEdit as InitDataTO)
      : null;
  },
  stepToEdit: (state: RootState): SequenceStepCTO | null => {
    switch (state.edit.mode) {
      case Mode.EDIT_SEQUENCE_STEP:
        return (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO
          ? (state.edit.objectToEdit as SequenceStepCTO)
          : null;
      case Mode.EDIT_SEQUENCE_STEP_ACTION:
        return (state.edit.objectToEdit as StepAction).step ? (state.edit.objectToEdit as StepAction).step : null;
      default:
        return null;
    }
  },
  actionToEdit: (state: RootState): ActionTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE_STEP_ACTION && (state.edit.objectToEdit as ActionTO).actionType
      ? (state.edit.objectToEdit as ActionTO)
      : null;
  },
  decisionToEdit: (state: RootState): DecisionTO | null => {
    return (state.edit.mode === Mode.EDIT_SEQUENCE_DECISION || Mode.EDIT_SEQUENCE_DECISION_CONDITION) &&
      (state.edit.objectToEdit as DecisionTO).elseGoTo
      ? (state.edit.objectToEdit as DecisionTO)
      : null;
  },
  instanceIndexToEdit: (state: RootState): number | null => {
    return state.edit.instanceIdToEdit;
  },
};

// =============================================== ACTIONS ===============================================

export const EditActions = {
  setMode: {
    editComponent: setModeToEditComponent,
    editData: setModeToEditData,
    editDataInstance: setModeToEditDataInstance,
    editGroup: setModeToEditGroup,
    editRelation: setModeToEditRelation,
    editSequence: setModeToEditSequence,
    editDataSetup: setModeToEditDataSetup,
    editInitData: setModeToEditInitData,
    editStep: setModeToEditStep,
    editDecision: setModeToEditDecision,
    editCondition: setModeToEditCondition,
    editAction: setModeToEditAction,
    edit: setModeToEdit,
    view: setModeToView,
    file: setModeToFile,
    tab: setModeToTab,
  },
  component: {
    save: saveComponentThunk,
    delete: deleteComponentThunk,
    update: EditSlice.actions.setComponentToEdit,
    create: createComponentThunk,
  },
  data: {
    save: saveDataThunk,
    delete: deleteDataThunk,
    update: EditSlice.actions.setDataToEdit,
    create: createDataThunk,
    createInstance: createDataInstanceThunk,
  },
  group: {
    save: saveGroupThunk,
    delete: deleteGroupThunk,
    update: EditSlice.actions.setGroupToEdit,
    create: createGroupThunk,
  },
  relation: {
    save: saveRelationThunk,
    delete: deleteRelationThunk,
    create: createRelationThunk,
    update: EditSlice.actions.setRelationToEdit,
  },
  sequence: {
    save: saveSequenceThunk,
    delete: deleteSequenceThunk,
    update: EditSlice.actions.setSequenceToEdit,
    findCTO: getSequenceCTOById,
    create: createSequenceThunk,
    setRoot: setRootThunk,
  },
  dataSetup: {
    save: saveDataSetupThunk,
    delete: deleteDataSetupThunk,
    update: EditSlice.actions.setDataSetupToEdit,
    create: createDataSetupThunk,
  },
  initData: {
    save: saveInitDataThunk,
    delete: deleteInitDataThunk,
    update: EditSlice.actions.setInitDataToEdit,
  },
  step: {
    save: saveSequenceStepThunk,
    delete: deleteSequenceStepThunk,
    update: EditSlice.actions.setStepToEdit,
    create: createSequenceStepThunk,
    find: findStepCTOThunk,
  },
  action: {
    delete: deleteActionThunk,
    update: EditSlice.actions.setActionToEdit,
    save: saveActionThunk,
    create: createActionThunk,
  },
  decision: {
    create: createDecisionThunk,
    update: EditSlice.actions.setDecisionToEdit,
    save: saveDecisionThunk,
    delete: deleteDecisionThunk,
    find: findDecisionTOThunk,
  },
};