import { ComponentCTO } from "./access/cto/ComponentCTO";
import { DataCTO } from "./access/cto/DataCTO";
import { DataSetupCTO } from "./access/cto/DataSetupCTO";
import { SequenceCTO } from "./access/cto/SequenceCTO";
import { SequenceStepCTO } from "./access/cto/SequenceStepCTO";
import { ActionTO } from "./access/to/ActionTO";
import { DataRelationTO } from "./access/to/DataRelationTO";
import { DataSetupTO } from "./access/to/DataSetupTO";
import { GroupTO } from "./access/to/GroupTO";
import { InitDataTO } from "./access/to/InitDataTO";
import { SequenceTO } from "./access/to/SequenceTO";
import { DataAccessResponse } from "./DataAccessResponse";
import dataStore from "./DataStore";
import { ComponentDataAccessService } from "./services/ComponentDataAccessService";
import { DataDataAccessService } from "./services/DataDataAccessService";
import { SequenceDataAccessService } from "./services/SequenceDataAccessService";

export const DataAccess = {
  storeFileData(fileData: string): DataAccessResponse<void> {
    let response: DataAccessResponse<void> = {
      object: undefined,
      message: "",
      code: 500,
    };
    try {
      dataStore.storeFileData(fileData);
      return { ...response, code: 200 };
    } catch (error) {
      return { ...response, message: error.message };
    }
  },

  downloadData(): DataAccessResponse<void> {
    let response: DataAccessResponse<void> = {
      object: undefined,
      message: "",
      code: 500,
    };
    try {
      dataStore.downloadData();
      return { ...response, code: 200 };
    } catch (error) {
      return { ...response, message: error.message };
    }
  },

  findAllComponents(): DataAccessResponse<ComponentCTO[]> {
    return makeTransactional(ComponentDataAccessService.findAll);
  },

  saveComponentCTO(component: ComponentCTO): DataAccessResponse<ComponentCTO> {
    return makeTransactional(() => ComponentDataAccessService.saveCTO(component));
  },

  deleteComponentCTO(component: ComponentCTO): DataAccessResponse<ComponentCTO> {
    return makeTransactional(() => ComponentDataAccessService.delete(component));
  },

  deleteSequenceCTO(sequence: SequenceCTO): DataAccessResponse<SequenceCTO> {
    return makeTransactional(() => SequenceDataAccessService.delete(sequence));
  },

  findAllSequences(): DataAccessResponse<SequenceTO[]> {
    return makeTransactional(SequenceDataAccessService.findAll);
  },

  findSequence(sequenceId: number): DataAccessResponse<SequenceCTO> {
    return makeTransactional(() => SequenceDataAccessService.find(sequenceId));
  },

  saveSequenceCTO(sequence: SequenceCTO): DataAccessResponse<SequenceCTO> {
    return makeTransactional(() => SequenceDataAccessService.save(sequence));
  },

  saveSequenceStepCTO(sequenceStep: SequenceStepCTO): DataAccessResponse<SequenceStepCTO> {
    return makeTransactional(() => SequenceDataAccessService.saveSequenceStep(sequenceStep));
  },

  deleteSequenceStepCTO(sequenceStep: SequenceStepCTO): DataAccessResponse<SequenceStepCTO> {
    return makeTransactional(() => SequenceDataAccessService.deleteSequenceStep(sequenceStep));
  },

  findAllDataSetups(): DataAccessResponse<DataSetupTO[]> {
    return makeTransactional(SequenceDataAccessService.findAllDataSetup);
  },

  findDataSetupCTO(dataSetupId: number): DataAccessResponse<DataSetupCTO> {
    return makeTransactional(() => SequenceDataAccessService.findDatSetupCTO(dataSetupId));
  },

  findAllInitDatas(): DataAccessResponse<InitDataTO[]> {
    return makeTransactional(SequenceDataAccessService.findAllInitDatas);
  },

  findAllDatas(): DataAccessResponse<DataCTO[]> {
    return makeTransactional(DataDataAccessService.findAllDatas);
  },

  saveDataSetup(dataSetup: DataSetupTO): DataAccessResponse<DataSetupTO> {
    return makeTransactional(() => SequenceDataAccessService.saveDataSetup(dataSetup));
  },

  deleteDataSetup(dataSetup: DataSetupCTO): DataAccessResponse<DataSetupCTO> {
    return makeTransactional(() => SequenceDataAccessService.deleteDataSetup(dataSetup));
  },

  saveDataSetupCTO(dataSetup: DataSetupCTO): DataAccessResponse<DataSetupCTO> {
    return makeTransactional(() => SequenceDataAccessService.saveDataSetupCTO(dataSetup));
  },

  saveDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
    return makeTransactional(() => DataDataAccessService.saveDataCTO(dataCTO));
  },

  deleteDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
    return makeTransactional(() => DataDataAccessService.deleteDataCTO(dataCTO));
  },

  deleteDataRelation(dataRelationCTO: DataRelationTO): DataAccessResponse<DataRelationTO> {
    return makeTransactional(() => DataDataAccessService.deleteDataRelationCTO(dataRelationCTO));
  },

  findAllDataRelations(): DataAccessResponse<DataRelationTO[]> {
    return makeTransactional(DataDataAccessService.findAllDataRelationTOs);
  },

  saveDataRelationCTO(dataRelation: DataRelationTO): DataAccessResponse<DataRelationTO> {
    return makeTransactional(() => DataDataAccessService.saveDataRelation(dataRelation));
  },

  findAllGroups(): DataAccessResponse<GroupTO[]> {
    return makeTransactional(ComponentDataAccessService.findAllGroups);
  },

  saveGroup(group: GroupTO): DataAccessResponse<GroupTO> {
    return makeTransactional(() => ComponentDataAccessService.saveGroup(group));
  },

  deleteGroupTO(group: GroupTO): DataAccessResponse<GroupTO> {
    return makeTransactional(() => ComponentDataAccessService.deleteGroup(group));
  },

  deleteActionCTO(action: ActionTO): DataAccessResponse<ActionTO> {
    return makeTransactional(() => SequenceDataAccessService.deleteAction(action));
  },
};

function makeTransactional<T>(callback: () => T): DataAccessResponse<T> {
  let response: DataAccessResponse<T> = {
    object: {} as T,
    message: "",
    code: 500,
  };
  try {
    const object = callback();
    response.object =
      typeof object === "undefined"
        ? undefined
        : // : JSON.parse(JSON.stringify(callback()));
          JSON.parse(JSON.stringify(object));
    response.code = 200;
    dataStore.commitChanges();
  } catch (error) {
    console.warn(error);
    response.message = error.message;
    dataStore.roleBack();
  }
  return response;
}
