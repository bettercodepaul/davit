import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, RootState } from '../app/store';
import { Arrows } from '../components/metaComponentModel/presentation/MetaComponentModelController';
import { ChainCTO } from '../dataAccess/access/cto/ChainCTO';
import { ComponentCTO } from '../dataAccess/access/cto/ComponentCTO';
import { DataCTO } from '../dataAccess/access/cto/DataCTO';
import { DataSetupCTO } from '../dataAccess/access/cto/DataSetupCTO';
import { SequenceCTO } from '../dataAccess/access/cto/SequenceCTO';
import { SequenceStepCTO } from '../dataAccess/access/cto/SequenceStepCTO';
import { ActionTO } from '../dataAccess/access/to/ActionTO';
import { ChainDecisionTO } from '../dataAccess/access/to/ChainDecisionTO';
import { ChainlinkTO } from '../dataAccess/access/to/ChainlinkTO';
import { ChainTO } from '../dataAccess/access/to/ChainTO';
import { DataInstanceTO } from '../dataAccess/access/to/DataInstanceTO';
import { DataRelationTO } from '../dataAccess/access/to/DataRelationTO';
import { DecisionTO } from '../dataAccess/access/to/DecisionTO';
import { GroupTO } from '../dataAccess/access/to/GroupTO';
import { InitDataTO } from '../dataAccess/access/to/InitDataTO';
import { SequenceStepTO } from '../dataAccess/access/to/SequenceStepTO';
import { SequenceTO } from '../dataAccess/access/to/SequenceTO';
import { GoToTypes } from '../dataAccess/access/types/GoToType';
import { GoToTypesChain } from '../dataAccess/access/types/GoToTypeChain';
import { DataAccess } from '../dataAccess/DataAccess';
import { DataAccessResponse } from '../dataAccess/DataAccessResponse';
import { Carv2Util } from '../utils/Carv2Util';
import { handleError } from './GlobalSlice';
import { MasterDataActions } from './MasterDataSlice';
import { SequenceModelActions } from './SequenceModelSlice';

export enum Mode {
  TAB = "TAB",
  FILE = "FILE",
  VIEW = "VIEW",
  EDIT = "EDIT",
  EDIT_COMPONENT = "EDIT_COMPONENT",
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
    | ChainlinkTO
    | ChainDecisionTO
    | {};
}
const getInitialState: EditState = {
  objectToEdit: {},
  mode: Mode.EDIT,
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
    setChainDecisionToEdit: (state, action: PayloadAction<ChainDecisionTO>) => {
      if (state.mode === Mode.EDIT_CHAIN_DECISION || state.mode === Mode.EDIT_CHAIN_DECISION_CONDITION) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set chain step to edit in mode: " + state.mode);
      }
    },
    setComponentToEdit: (state, action: PayloadAction<ComponentCTO>) => {
      if (state.mode === Mode.EDIT_COMPONENT) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set component to edit in mode: " + state.mode);
      }
    },
    setDataToEdit: (state, action: PayloadAction<DataCTO>) => {
      if (state.mode === Mode.EDIT_DATA) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set data to edit in mode: " + state.mode);
      }
    },
    setInstanceToEdit: (state, action: PayloadAction<DataInstanceTO>) => {
      if (state.mode === Mode.EDIT_DATA_INSTANCE) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set data to edit in mode: " + state.mode);
      }
    },
    setRelationToEdit: (state, action: PayloadAction<DataRelationTO>) => {
      if (state.mode === Mode.EDIT_RELATION) {
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
      if (state.mode === Mode.EDIT_DATASETUP) {
        state.objectToEdit = action.payload;
      } else {
        handleError("Try to set dataSetup to edit in mode: " + state.mode);
      }
    },
    setInitDataToEdit: (state, action: PayloadAction<InitDataTO>) => {
      if (state.mode === Mode.EDIT_DATASETUP_INITDATA) {
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
  dispatch(SequenceModelActions.calcChain());
};

const setModeToEdit = (): AppThunk => (dispatch, getState) => {
  dispatch(EditSlice.actions.clearObjectToEdit());
  if (getState().edit.mode !== Mode.VIEW) {
    dispatch(setModeWithStorage(Mode.EDIT));
  } else {
    const stepIndex: number | null = getState().sequenceModel.currentStepIndex;
    if (stepIndex !== null && stepIndex > 0) {
      const step: SequenceStepCTO | undefined = getState().sequenceModel.selectedSequenceModel?.sequenceStepCTOs.find(
        (step) => step.squenceStepTO.id === stepIndex
      );
      if (step) {
        dispatch(setModeToEditStep(step));
      } else {
        dispatch(setModeWithStorage(Mode.EDIT));
      }
    } else {
      dispatch(setModeWithStorage(Mode.EDIT));
    }
  }
};

const setModeToEditComponent = (component?: ComponentCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
  if (component === undefined) {
    dispatch(EditActions.component.create());
  } else {
    dispatch(EditSlice.actions.setComponentToEdit(component));
  }
};

const setModeToEditCompoenntById = (id: number): AppThunk => (dispatch, getState) => {
  const component: ComponentCTO | undefined = getState().masterData.components.find(
    (component) => component.component.id === id
  );
  if (component) {
    dispatch(setModeWithStorage(Mode.EDIT_COMPONENT));
    dispatch(EditSlice.actions.setComponentToEdit(component));
  }
};
const setModeToEditDataById = (id: number): AppThunk => (dispatch, getState) => {
  const data: DataCTO | undefined = getState().masterData.datas.find((data) => data.data.id === id);
  if (data) {
    dispatch(setModeWithStorage(Mode.EDIT_DATA));
    dispatch(EditSlice.actions.setDataToEdit(data));
  }
};

const editDataInstanceById = (id: number): AppThunk => (dispatch, getState) => {
  // TODO: have to fix this!
  // const instance: DataInstanceTO | undefined = getState().masterData.instances.find((instance) => instance.id === id);
  // if (instance) {
  //   dispatch(setModeWithStorage(Mode.EDIT_DATA_INSTANCE));
  //   dispatch(EditSlice.actions.setInstanceToEdit(instance));
  // }
};

const setModeToEditData = (data?: DataCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA));
  if (data === undefined) {
    dispatch(EditActions.data.create());
  } else {
    dispatch(EditSlice.actions.setDataToEdit(data));
  }
};

const setModeToEditDataInstance = (data: DataCTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_DATA_INSTANCE));
  dispatch(EditSlice.actions.setDataToEdit(data));
};

const setModeToEditRelation = (relation?: DataRelationTO): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_RELATION));
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

const setModeToEditChain = (chain?: ChainTO): AppThunk => (dispatch) => {
  if (!chain) {
    dispatch(EditActions.chain.create());
  } else {
    dispatch(SequenceModelActions.setCurrentChain(chain));
  }
  dispatch(setModeWithStorage(Mode.EDIT_CHAIN));
};

const setModeToEditChainlink = (
  chainlink: ChainlinkTO,
  from?: ChainlinkTO | ChainDecisionTO,
  ifGoTo?: boolean
): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_CHAIN_LINK));
  dispatch(EditActions.chainLink.create(chainlink, from, ifGoTo));
};

const setModeEditChainDecision = (
  chainDecision: ChainDecisionTO,
  from?: ChainDecisionTO | ChainlinkTO,
  ifGoTO?: boolean
): AppThunk => (dispatch) => {
  dispatch(setModeWithStorage(Mode.EDIT_CHAIN_DECISION));
  dispatch(EditActions.chainDecision.create(chainDecision, from, ifGoTO));
};

const setModeToEditChainCondition = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
  if (decision !== null && decision !==  undefined) {
    dispatch(setModeWithStorage(Mode.EDIT_CHAIN_DECISION_CONDITION));
  } else {
    handleError("Edit Condition: 'Decision is null or undefined'.");
  }
};

const setModeToEditStep = (
  stepCTO: SequenceStepCTO,
  from?: SequenceStepCTO | DecisionTO,
  ifGoTo?: boolean
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
  dispatch(setModeWithStorage(Mode.EDIT_DATASETUP_INITDATA));
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
  dispatch(setModeWithStorage(Mode.EDIT_DATASETUP));
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
  if (decision !== null && decision !==  undefined) {
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
  const data: DataCTO = new DataCTO();
  const response: DataAccessResponse<DataCTO> = DataAccess.saveDataCTO(data);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  // create default instance.
  dispatch(MasterDataActions.loadDatasFromBackend());
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

const deleteDataThunk = (data: DataCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataCTO> = DataAccess.deleteDataCTO(data);
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

// ----------------------------------------------- CHAIN -----------------------------------------------

const createChainThunk = (): AppThunk => (dispatch) => {
  let chain: ChainTO = new ChainTO();
  const response: DataAccessResponse<ChainTO> = DataAccess.saveChainTO(chain);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
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
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainsFromBackend());
  dispatch(SequenceModelActions.setCurrentChain(response.object));
};

const deleteChainThunk = (chain: ChainTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceTO> = DataAccess.deleteChain(chain);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainsFromBackend());
  dispatch(MasterDataActions.loadChainDecisionsFromBackend());
  dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const createChainLinkThunk = (link: ChainlinkTO, from?: ChainlinkTO | ChainDecisionTO, ifGoTO?: boolean): AppThunk => (
  dispatch
) => {
  const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(link);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  } else {
    if (from !== undefined) {
      if ((from as ChainlinkTO).dataSetupFk !== undefined) {
        (from as ChainlinkTO).goto = { type: GoToTypesChain.LINK, id: response.object.id };
        dispatch(EditActions.chainLink.save(from as ChainlinkTO));
      }
      if ((from as ChainDecisionTO).ifGoTo !== undefined) {
        if (ifGoTO) {
          (from as ChainDecisionTO).ifGoTo = { type: GoToTypesChain.LINK, id: response.object.id };
        } else {
          (from as ChainDecisionTO).elseGoTo = { type: GoToTypesChain.LINK, id: response.object.id };
        }
        dispatch(EditActions.chainDecision.save(from as ChainDecisionTO));
      }
    }
    dispatch(EditSlice.actions.setChainLinkToEdit(response.object));
  }
};

const saveChainLinkThunk = (step: ChainlinkTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainlinkTO> = DataAccess.saveChainlink(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const deleteChainLinkThunk = (step: ChainlinkTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainlinkTO> = DataAccess.deleteChainLink(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainLinksFromBackend());
};

const createChainDecisionThunk = (
  decision: ChainDecisionTO,
  from?: ChainDecisionTO | ChainlinkTO,
  ifGoTO?: boolean
): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  } else {
    if (from !== undefined) {
      if ((from as ChainlinkTO).dataSetupFk !== undefined) {
        (from as ChainlinkTO).goto = { type: GoToTypesChain.DEC, id: response.object.id };
        dispatch(EditActions.chainLink.save(from as ChainlinkTO));
      }
      if ((from as ChainDecisionTO).elseGoTo !== undefined) {
        if (ifGoTO) {
          (from as ChainDecisionTO).ifGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
        } else {
          (from as ChainDecisionTO).elseGoTo = { type: GoToTypesChain.DEC, id: response.object.id };
        }
        dispatch(EditActions.chainDecision.save(from as ChainDecisionTO));
      }
    }
    console.info("save");
    dispatch(EditSlice.actions.setChainDecisionToEdit(response.object));
  }
};

const saveChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainDecisionTO> = DataAccess.saveChaindecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const deleteChainDecisionThunk = (decision: ChainDecisionTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainDecisionTO> = DataAccess.deleteChaindecision(decision);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const setChainRootThunk = (chainId: number, rootId: number, isDecision: boolean): AppThunk => (dispatch) => {
  const response: DataAccessResponse<ChainlinkTO | ChainDecisionTO> = DataAccess.setChainRoot(
    chainId,
    rootId,
    isDecision
  );
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(MasterDataActions.loadChainsFromBackend());
  dispatch(MasterDataActions.loadChainLinksFromBackend());
  dispatch(MasterDataActions.loadChainDecisionsFromBackend());
};

const findChainDecisionThunk = (id: number): ChainDecisionTO => {
  const response: DataAccessResponse<ChainDecisionTO> = DataAccess.findChainDecision(id);
  if (response.code !== 200) {
    handleError(response.message);
  }
  return response.object;
};

const findChainLinkThunk = (id: number): ChainlinkTO => {
  const response: DataAccessResponse<ChainlinkTO> = DataAccess.findChainLink(id);
  if (response.code !== 200) {
    handleError(response.message);
  }
  return response.object;
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
  dispatch(MasterDataActions.loadSequencesFromBackend());
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
        (from as SequenceStepCTO).squenceStepTO.goto = { type: GoToTypes.DEC, id: response.object.id };
        dispatch(EditActions.step.save(from as SequenceStepCTO));
      }
      if ((from as DecisionTO).elseGoTo !== undefined) {
        if (ifGoTo) {
          (from as DecisionTO).ifGoTo = { type: GoToTypes.DEC, id: response.object.id };
        } else {
          (from as DecisionTO).elseGoTo = { type: GoToTypes.DEC, id: response.object.id };
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
      if (step.squenceStepTO.goto.type === GoToTypes.DEC && step.squenceStepTO.goto.id === decision.id) {
        step.squenceStepTO.goto = { type: GoToTypes.ERROR };
        dispatch(EditActions.step.save(step));
      }
    });
    // update decisions
    copySequence.decisions.forEach((cond) => {
      if (cond.ifGoTo.type === GoToTypes.DEC && cond.ifGoTo.id === decision.id) {
        cond.ifGoTo = { type: GoToTypes.ERROR };
        dispatch(EditActions.decision.save(cond));
      }
      if (cond.elseGoTo.type === GoToTypes.DEC && cond.elseGoTo.id === decision.id) {
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
  chainLinkToEdit: (state: RootState): ChainlinkTO | null => {
    return state.edit.mode === Mode.EDIT_CHAIN_LINK && (state.edit.objectToEdit as ChainlinkTO).dataSetupFk
      ? (state.edit.objectToEdit as ChainlinkTO)
      : null;
  },
  chainDecisionToEdit: (state: RootState): ChainDecisionTO | null => {
    return state.edit.mode === Mode.EDIT_CHAIN_DECISION ||
      (state.edit.mode === Mode.EDIT_CHAIN_DECISION_CONDITION && (state.edit.objectToEdit as ChainDecisionTO).elseGoTo)
      ? (state.edit.objectToEdit as ChainDecisionTO)
      : null;
  },
  dataToEdit: (state: RootState): DataCTO | null => {
    return state.edit.mode === Mode.EDIT_DATA || (Mode.EDIT_DATA_INSTANCE && (state.edit.objectToEdit as DataCTO).data)
      ? (state.edit.objectToEdit as DataCTO)
      : null;
  },
  instanceToEdit: (state: RootState): DataInstanceTO | null => {
    return state.edit.mode === Mode.EDIT_DATA_INSTANCE ? (state.edit.objectToEdit as DataInstanceTO) : null;
  },
  groupToEdit: (state: RootState): GroupTO | null => {
    return state.edit.mode === Mode.EDIT_GROUP && (state.edit.objectToEdit as GroupTO).color
      ? (state.edit.objectToEdit as GroupTO)
      : null;
  },
  relationToEdit: (state: RootState): DataRelationTO | null => {
    return state.edit.mode === Mode.EDIT_RELATION && (state.edit.objectToEdit as DataRelationTO).direction1
      ? (state.edit.objectToEdit as DataRelationTO)
      : null;
  },
  sequenceToEdit: (state: RootState): SequenceTO | null => {
    return state.edit.mode === Mode.EDIT_SEQUENCE && (state.edit.objectToEdit as SequenceTO)
      ? (state.edit.objectToEdit as SequenceTO)
      : null;
  },
  editArrow: (state: RootState): Arrows | null => {
    if (state.edit.mode === Mode.EDIT_SEQUENCE_STEP && (state.edit.objectToEdit as SequenceStepCTO).actions) {
      const sourceComp: ComponentCTO | undefined = state.masterData.components.find(
        (comp) => comp.component.id === (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO.sourceComponentFk
      );
      const targetComp: ComponentCTO | undefined = state.masterData.components.find(
        (comp) => comp.component.id === (state.edit.objectToEdit as SequenceStepCTO).squenceStepTO.targetComponentFk
      );
      if (sourceComp && targetComp) {
        return { sourceGeometricalData: sourceComp.geometricalData, targetGeometricalData: targetComp.geometricalData };
      } else {
        return null;
      }
    } else {
      return null;
    }
  },
  dataSetupToEdit: (state: RootState): DataSetupCTO | null => {
    return state.edit.mode === Mode.EDIT_DATASETUP && (state.edit.objectToEdit as DataSetupCTO).dataSetup
      ? (state.edit.objectToEdit as DataSetupCTO)
      : null;
  },
  initDataToEdit: (state: RootState): InitDataTO | null => {
    return state.edit.mode === Mode.EDIT_DATASETUP_INITDATA && (state.edit.objectToEdit as InitDataTO).dataSetupFk
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
};

// =============================================== ACTIONS ===============================================

export const EditActions = {
  setMode: {
    editComponent: setModeToEditComponent,
    editComponentById: setModeToEditCompoenntById,
    editData: setModeToEditData,
    editDataById: setModeToEditDataById,
    editDataInstance: setModeToEditDataInstance,
    editInstaceById: editDataInstanceById,
    editGroup: setModeToEditGroup,
    editRelation: setModeToEditRelation,
    editSequence: setModeToEditSequence,
    editDataSetup: setModeToEditDataSetup,
    editInitData: setModeToEditInitData,
    editStep: setModeToEditStep,
    editDecision: setModeToEditDecision,
    editCondition: setModeToEditCondition,
    editAction: setModeToEditAction,
    editChain: setModeToEditChain,
    editChainLink: setModeToEditChainlink,
    editChainDecision: setModeEditChainDecision,
    editChainCondition: setModeToEditChainCondition,
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
  chain: {
    create: createChainThunk,
    save: saveChainThunk,
    delete: deleteChainThunk,
    setRoot: setChainRootThunk,
    getCTO: getChainCTO,
  },
  chainLink: {
    create: createChainLinkThunk,
    save: saveChainLinkThunk,
    delete: deleteChainLinkThunk,
    find: findChainLinkThunk,
  },
  chainDecision: {
    create: createChainDecisionThunk,
    save: saveChainDecisionThunk,
    delete: deleteChainDecisionThunk,
    find: findChainDecisionThunk,
  },
};
