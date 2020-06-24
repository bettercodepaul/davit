import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import { ActionCTO } from "../dataAccess/access/cto/ActionCTO";
import { ComponentDataCTO } from "../dataAccess/access/cto/ComponentDataCTO";
import { DataSetupCTO } from "../dataAccess/access/cto/DataSetupCTO";
import { SequenceCTO } from "../dataAccess/access/cto/SequenceCTO";
import { SequenceStepCTO } from "../dataAccess/access/cto/SequenceStepCTO";
import { DataSetupTO } from "../dataAccess/access/to/DataSetupTO";
import { InitDataTO } from "../dataAccess/access/to/InitDataTO";
import { DataAccess } from "../dataAccess/DataAccess";
import { DataAccessResponse } from "../dataAccess/DataAccessResponse";
import { Carv2Util } from "../utils/Carv2Util";
import { handleError } from "./GlobalSlice";

interface SequenceState {
  currentSequence: SequenceCTO | null;
  currentStepIndex: number | null;
  //TODO change from CTO to TO.
  sequences: SequenceCTO[];
  dataSetups: DataSetupTO[];
  initDatas: InitDataTO[];
  currentComponentDatas: ComponentDataCTO[];
  currentActionToEdit: ActionCTO | null;
  currentDataSetupToEdit: DataSetupCTO | null;
}
const getInitialState: SequenceState = {
  currentSequence: null,
  currentStepIndex: null,
  sequences: [],
  dataSetups: [],
  initDatas: [],
  currentComponentDatas: [],
  currentActionToEdit: null,
  currentDataSetupToEdit: null,
};

export const SequenceSlice = createSlice({
  name: "sequence",
  initialState: getInitialState,
  reducers: {
    setCurrentSequence: (state, action: PayloadAction<SequenceCTO | null>) => {
      const copyPayload: SequenceCTO = Carv2Util.deepCopy(action.payload);
      if (action.payload !== null) {
        copyPayload.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
      }
      state.currentSequence = copyPayload;
      // if sequence is new save in backend, to get a id.
    },
    setCurrentActionToEdit: (state, action: PayloadAction<ActionCTO | null>) => {
      console.info("setCurrentActionToEdit: ", action.payload);
      state.currentActionToEdit = action.payload;
    },
    setCurrentComponentDatas: (state, action: PayloadAction<ComponentDataCTO[]>) => {
      state.currentComponentDatas = action.payload;
    },
    setCurrentStepIndex: (state, action: PayloadAction<number | null>) => {
      if (state.currentSequence !== null) {
        if (action.payload === null) {
          const step: SequenceStepCTO = new SequenceStepCTO();
          const newIndex = getLastIndex(state.currentSequence) + 1;
          step.squenceStepTO.index = newIndex;
          step.squenceStepTO.sequenceFk = state.currentSequence.sequenceTO.id;
          state.currentSequence.sequenceStepCTOs.splice(newIndex, 0, step);
          udpateIndices(state.currentSequence);
          state.currentStepIndex = newIndex;
        } else {
          state.currentStepIndex = action.payload;
        }
      } else {
        state.currentStepIndex = action.payload;
      }
    },
    resetCurrentSequence: (state) => {
      state.currentSequence = null;
    },
    resetCurrentStepIndex: (state) => {
      state.currentStepIndex = null;
    },
    setSequences: (state, action: PayloadAction<SequenceCTO[]>) => {
      state.sequences = action.payload;
      if (state.currentSequence !== null) {
        state.currentSequence =
          action.payload.find((sequence) => sequence.sequenceTO.id === state.currentSequence!.sequenceTO.id) || null;
      }
    },
    updateCurrentSequenceStep: (state, action: PayloadAction<SequenceStepCTO>) => {
      if (state.currentStepIndex !== null && state.currentSequence !== null) {
        const stepArrayIndex: number = findStepInSequence(action.payload.squenceStepTO.id, state.currentSequence);
        if (stepArrayIndex !== -1) {
          if (action.payload.squenceStepTO.index !== state.currentStepIndex) {
            // handle index update
            state.currentSequence.sequenceStepCTOs.splice(stepArrayIndex, 1);
            state.currentSequence.sequenceStepCTOs.splice(action.payload.squenceStepTO.index - 1, 0, action.payload);
            state.currentSequence.sequenceStepCTOs.forEach(
              (stepCTO, index) => (stepCTO.squenceStepTO.index = index + 1)
            );
            state.currentStepIndex = action.payload.squenceStepTO.index;
          } else {
            state.currentSequence.sequenceStepCTOs[stepArrayIndex] = action.payload;
          }
          // TODO check what happens when more than one steps have id -1
        }
        // state.currentSequence = updateComponentDataStates(state.currentSequence);
      }
    },
    setNextStepToCurrentStep: (state) => {
      if (state.currentSequence !== null) {
        if (state.currentStepIndex === null) {
          state.currentStepIndex = 1;
          return;
        }
        if (state.currentStepIndex < state.currentSequence.sequenceStepCTOs.length) {
          const index: number = state.currentStepIndex;
          state.currentStepIndex = index + 1;
          return;
        }
        if (state.currentStepIndex === state.currentSequence.sequenceStepCTOs.length) {
          state.currentStepIndex = null;
          return;
        }
      }
    },
    setPreviousStepToCurrentStep: (state) => {
      if (state.currentSequence !== null) {
        if (state.currentStepIndex === null) {
          state.currentStepIndex = state.currentSequence.sequenceStepCTOs.length;
          return;
        }
        if (state.currentStepIndex <= state.currentSequence.sequenceStepCTOs.length) {
          const index: number = state.currentStepIndex;
          state.currentStepIndex = index - 1;
        }
        if (state.currentStepIndex < 1) {
          state.currentStepIndex = null;
        }
      }
    },
    setDataSetups: (state, action: PayloadAction<DataSetupTO[]>) => {
      state.dataSetups = action.payload;
    },
    setCurrentDataSetup: (state, action: PayloadAction<DataSetupCTO | null>) => {
      state.currentDataSetupToEdit = action.payload;
    },
    setInitDatas: (state, action: PayloadAction<InitDataTO[]>) => {
      state.initDatas = action.payload;
    },
  },
});

// const determineComponentDatas = (prevComponentDatas: ComponentDataCTO[], curComponentDatas: ComponentDataCTO[]) => {
//   const curComponentDatasNotDeleted = curComponentDatas.filter(
//     (componentData) => componentData.componentDataTO.componentDataState !== ComponentDataState.DELETED
//   );

//   const prevComponentDatasNotDeleted = prevComponentDatas.filter(
//     (pcd) => pcd.componentDataTO.componentDataState !== ComponentDataState.DELETED
//   );

//   // const deletedComponentDatas: ComponentDataCTO[] = prevComponentDatas
//   const deletedComponentDatas: ComponentDataCTO[] = prevComponentDatasNotDeleted
//     .filter(
//       (prevCompData) =>
//         !curComponentDatasNotDeleted.some((curCompData) => compareComponentDatas(prevCompData, curCompData))
//     )
//     .map((deletedCompData) => {
//       let newCompData: ComponentDataCTO = Carv2Util.deepCopy(deletedCompData);
//       newCompData.componentDataTO.id = -1;
//       newCompData.componentDataTO.componentDataState = ComponentDataState.DELETED;
//       return newCompData;
//     });

//   const updatedCurComponentDatas = curComponentDatasNotDeleted.map((componentData) => {
//     let updatedCompData: ComponentDataCTO = Carv2Util.deepCopy(componentData);
//     if (
//       prevComponentDatas.some(
//         (prevCompData) =>
//           compareComponentDatas(prevCompData, componentData) &&
//           prevCompData.componentDataTO.componentDataState !== ComponentDataState.DELETED
//       )
//     ) {
//       updatedCompData.componentDataTO.componentDataState = ComponentDataState.PERSISTENT;
//     } else {
//       updatedCompData.componentDataTO.componentDataState = ComponentDataState.NEW;
//     }
//     return updatedCompData;
//   });

//   return updatedCurComponentDatas.concat(deletedComponentDatas);
// };

// const compareComponentDatas = (componentData1: ComponentDataCTO, componentData2: ComponentDataCTO): boolean => {
//   return (
//     componentData1.componentTO.id === componentData2.componentTO.id &&
//     componentData1.dataTO.id === componentData2.dataTO.id
//   );
// };

const udpateIndices = (sequence: SequenceCTO): void => {
  sequence.sequenceStepCTOs.forEach((stepCTO, index) => (stepCTO.squenceStepTO.index = index + 1));
};

const getLastIndex = (sequence: SequenceCTO) => {
  if (sequence.sequenceStepCTOs.length === 0) {
    return 0;
  }
  let copySequence: SequenceCTO = Carv2Util.deepCopy(sequence);
  return copySequence.sequenceStepCTOs
    .map((stepCTO) => stepCTO.squenceStepTO.index)
    .reduce((prevValue: number, currentValue: number) => (prevValue > currentValue ? prevValue : currentValue));
};

const findStepInSequence = (id: number, sequenceCTO: SequenceCTO): number => {
  return sequenceCTO.sequenceStepCTOs.findIndex((step) => step.squenceStepTO.id === id);
};

export const SequenceReducer = SequenceSlice.reducer;
export const selectSequences = (state: RootState): SequenceCTO[] => state.sequenceModel.sequences;
export const selectDataSetups = (state: RootState): DataSetupTO[] => state.sequenceModel.dataSetups;
export const selectInitDatas = (state: RootState): InitDataTO[] => state.sequenceModel.initDatas;
export const currentActionToEdit = (state: RootState): ActionCTO | null => state.sequenceModel.currentActionToEdit;
export const currentDataSetupToEdit = (state: RootState): DataSetupCTO | null =>
  state.sequenceModel.currentDataSetupToEdit;
export const currentSequence = (state: RootState): SequenceCTO | null => state.sequenceModel.currentSequence;
export const currentStepIndex = (state: RootState): number | null => state.sequenceModel.currentStepIndex;
export const currentComponentDatas = (state: RootState): ComponentDataCTO[] =>
  state.sequenceModel.currentComponentDatas;
export const currentStep = (state: RootState): SequenceStepCTO | null => {
  return (
    state.sequenceModel.currentSequence?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    ) || null
  );
};
export const currentActions = (state: RootState): ActionCTO[] => {
  return (
    state.sequenceModel.currentSequence?.sequenceStepCTOs.find(
      (step) => step.squenceStepTO.index === state.sequenceModel.currentStepIndex
    )?.actions || []
  );
};

const getPreviousStep = (indexStep: number | null, sequence: SequenceCTO | null): SequenceStepCTO | null => {
  const previousIndex: number = indexStep ? indexStep - 1 : -1;
  return sequence?.sequenceStepCTOs.find((step) => step.squenceStepTO.index === previousIndex) || null;
};

export const previousStep = (state: RootState): SequenceStepCTO | null => {
  return getPreviousStep(state.sequenceModel.currentStepIndex, state.sequenceModel.currentSequence);
};

const loadSequencesFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<SequenceCTO[]> = DataAccess.findAllSequences();
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setSequences(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadDataSetupsFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupTO[]> = DataAccess.findAllDataSetups();
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setDataSetups(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const loadInitDataFromBackend = (): AppThunk => (dispatch) => {
  const response: DataAccessResponse<InitDataTO[]> = DataAccess.findAllInitDatas();
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setInitDatas(response.object));
  } else {
    dispatch(handleError(response.message));
  }
};

const saveSequenceThunk = (sequence: SequenceCTO): AppThunk => (dispatch) => {
  let copySequence: SequenceCTO = Carv2Util.deepCopy(sequence);
  copySequence.sequenceStepCTOs.sort((step1, step2) => step1.squenceStepTO.index - step2.squenceStepTO.index);
  const response: DataAccessResponse<SequenceCTO> = DataAccess.saveSequenceCTO(copySequence);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

const saveDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.saveDataSetupCTO(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDataSetupsFromBackend());
};

const deleteSequenceThunk = (sequence: SequenceCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceCTO> = await DataAccess.deleteSequenceCTO(sequence);
  console.log(response);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

const deleteDataSetupThunk = (dataSetup: DataSetupCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = await DataAccess.deleteDataSetup(dataSetup);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadDataSetupsFromBackend());
};

const deleteSequenceStepThunk = (step: SequenceStepCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<SequenceStepCTO> = await DataAccess.deleteSequenceStepCTO(step);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

const deleteActionThunk = (action: ActionCTO): AppThunk => async (dispatch) => {
  const response: DataAccessResponse<ActionCTO> = await DataAccess.deleteActionCTO(action);
  if (response.code !== 200) {
    dispatch(handleError(response.message));
  }
  dispatch(loadSequencesFromBackend());
};

const setDataSetupToEdit = (dataSetupTO: DataSetupTO): AppThunk => (dispatch) => {
  const response: DataAccessResponse<DataSetupCTO> = DataAccess.findDataSetupCTO(dataSetupTO);
  if (response.code === 200) {
    dispatch(SequenceSlice.actions.setCurrentDataSetup(response.object));
    dispatch(loadDataSetupsFromBackend());
  } else {
    dispatch(handleError(response.message));
  }
};

export const SequenceActions = {
  updateCurrentSequenceStep: SequenceSlice.actions.updateCurrentSequenceStep,
  setSequenceToEdit: SequenceSlice.actions.setCurrentSequence,
  setSequenceStepToEdit: SequenceSlice.actions.setCurrentStepIndex,
  loadSequencesFromBackend,
  loadDataSetupsFromBackend,
  saveSequence: saveSequenceThunk,
  deleteSequence: deleteSequenceThunk,
  deleteSequenceStep: deleteSequenceStepThunk,
  setCurrentComponentDatas: SequenceSlice.actions.setCurrentComponentDatas,
  setActionToEdit: SequenceSlice.actions.setCurrentActionToEdit,
  deleteAction: deleteActionThunk,
  setDataSetupToEdit,
  saveDataSetup: saveDataSetupThunk,
  deleteDataSetup: deleteDataSetupThunk,
  loadInitDataFromBackend,
  updateCurrentDataSetupToEdit: SequenceSlice.actions.setCurrentDataSetup,
  clearCurrentDataSetupToEdit: SequenceSlice.actions.setCurrentDataSetup(null),
};
