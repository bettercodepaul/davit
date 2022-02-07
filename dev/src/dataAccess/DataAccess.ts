import { ActorCTO } from "./access/cto/ActorCTO";
import { ChainCTO } from "./access/cto/ChainCTO";
import { DataCTO } from "./access/cto/DataCTO";
import { DataSetupCTO } from "./access/cto/DataSetupCTO";
import { SequenceCTO } from "./access/cto/SequenceCTO";
import { SequenceStepCTO } from "./access/cto/SequenceStepCTO";
import { ActionTO } from "./access/to/ActionTO";
import { ChainDecisionTO } from "./access/to/ChainDecisionTO";
import { ChainlinkTO } from "./access/to/ChainlinkTO";
import { ChainTO } from "./access/to/ChainTO";
import { DataRelationTO } from "./access/to/DataRelationTO";
import { DataSetupTO } from "./access/to/DataSetupTO";
import { DecisionTO } from "./access/to/DecisionTO";
import { GroupTO } from "./access/to/GroupTO";
import { InitDataTO } from "./access/to/InitDataTO";
import { SequenceStepTO } from "./access/to/SequenceStepTO";
import { SequenceTO } from "./access/to/SequenceTO";
import { DataAccessResponse } from "./DataAccessResponse";
import dataStore from "./DataStore";
import { ActorDataAccessService } from "./services/ActorDataAccessService";
import { DataDataAccessService } from "./services/DataDataAccessService";
import { SequenceDataAccessService } from "./services/SequenceDataAccessService";
import { TechnicalDataAccessService } from "./services/TechnicalDataAccessService";

export const DataAccess = {
    // ========================================= FILE =========================================

    storeFileData(fileData: string): DataAccessResponse<void> {
        const response: DataAccessResponse<void> = {
            object: undefined,
            message: "",
            code: 500,
        };
        try {
            dataStore.storeFileData(fileData);
            return {...response, code: 200};
        } catch (error) {
            return {...response, message: error.message};
        }
    },

    createNewProject(): DataAccessResponse<void> {
        const response: DataAccessResponse<void> = {
            object: undefined,
            message: "",
            code: 500,
        };
        try {
            dataStore.createNewProject();
            return {...response, code: 200};
        } catch (error) {
            return {...response, message: error.message};
        }
    },

    downloadData(projectName: string): DataAccessResponse<void> {
        const response: DataAccessResponse<void> = {
            object: undefined,
            message: "",
            code: 500,
        };
        makeTransactional(() => TechnicalDataAccessService.saveProjectName(projectName));
        try {
            dataStore.downloadData(projectName);
            return {...response, code: 200};
        } catch (error) {
            return {...response, message: error.message};
        }
    },

    // ========================================= ZOOM =========================================

    setActorZoom(zoom: number): DataAccessResponse<number> {
        return makeTransactional(() => TechnicalDataAccessService.saveActorZoom(zoom));
    },

    setDataZoom(zoom: number): DataAccessResponse<number> {
        return makeTransactional(() => TechnicalDataAccessService.saveDataZoom(zoom));
    },

    loadActorZoom(): DataAccessResponse<number> {
        return makeTransactional(TechnicalDataAccessService.getActorZoom);
    },

    loadDataZoom(): DataAccessResponse<number> {
        return makeTransactional(TechnicalDataAccessService.getDataZoom);
    },

    // ========================================= ACTOR =========================================

    findAllActors(): DataAccessResponse<ActorCTO[]> {
        return makeTransactional(ActorDataAccessService.findAll);
    },

    saveActorCTO(actor: ActorCTO): DataAccessResponse<ActorCTO> {
        return makeTransactional(() => ActorDataAccessService.saveCTO(actor));
    },

    deleteActorCTO(actor: ActorCTO): DataAccessResponse<ActorCTO> {
        return makeTransactional(() => ActorDataAccessService.delete(actor));
    },

    // ========================================= SEQUENCE =========================================

    deleteSequenceCTO(sequence: SequenceCTO): DataAccessResponse<SequenceCTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteSequenceCTO(sequence));
    },

    deleteSequenceTO(sequenceTO: SequenceTO): DataAccessResponse<SequenceTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteSequenceTO(sequenceTO));
    },

    findAllSequences(): DataAccessResponse<SequenceTO[]> {
        return makeTransactional(SequenceDataAccessService.findAll);
    },

    findSequenceCTO(sequenceId: number): DataAccessResponse<SequenceCTO> {
        return makeTransactional(() => SequenceDataAccessService.findSequenceCTO(sequenceId));
    },

    saveSequenceCTO(sequence: SequenceCTO): DataAccessResponse<SequenceCTO> {
        return makeTransactional(() => SequenceDataAccessService.saveSequenceCTO(sequence));
    },

    saveSequenceTO(sequence: SequenceTO): DataAccessResponse<SequenceTO> {
        return makeTransactional(() => SequenceDataAccessService.saveSequenceTO(sequence));
    },

    setRoot(sequenceId: number, id: number, isDecision: boolean): DataAccessResponse<SequenceStepTO | DecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.setRoot(sequenceId, id, isDecision));
    },

    // ========================================= STEP =========================================

    saveSequenceStepCTO(sequenceStep: SequenceStepCTO): DataAccessResponse<SequenceStepCTO> {
        return makeTransactional(() => SequenceDataAccessService.saveSequenceStep(sequenceStep));
    },

    deleteSequenceStepCTO(sequenceStep: SequenceStepCTO): DataAccessResponse<SequenceStepCTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteSequenceStep(sequenceStep));
    },

    findSequenceStepCTO(id: number): DataAccessResponse<SequenceStepCTO> {
        return makeTransactional(() => SequenceDataAccessService.findSequenceStepCTO(id));
    },

    // ========================================= DATA SETUP =========================================

    findAllDataSetups(): DataAccessResponse<DataSetupTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllDataSetup);
    },

    findDataSetupCTO(dataSetupId: number): DataAccessResponse<DataSetupCTO> {
        return makeTransactional(() => SequenceDataAccessService.findDatSetupCTO(dataSetupId));
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

    // ========================================= INIT DATA =========================================

    findAllInitDatas(): DataAccessResponse<InitDataTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllInitDatas);
    },

    findInitData(id: number): DataAccessResponse<InitDataTO> {
        return makeTransactional(() => SequenceDataAccessService.findInitData(id));
    },

    saveInitData(initData: InitDataTO): DataAccessResponse<InitDataTO> {
        return makeTransactional(() => SequenceDataAccessService.saveInitData(initData));
    },

    deleteInitData(id: number): DataAccessResponse<InitDataTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteInitData(id));
    },
    // ========================================= DATA =========================================

    findAllDatas(): DataAccessResponse<DataCTO[]> {
        return makeTransactional(DataDataAccessService.findAllDatas);
    },

    saveDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
        return makeTransactional(() => DataDataAccessService.saveDataCTO(dataCTO));
    },

    deleteDataCTO(dataCTO: DataCTO): DataAccessResponse<DataCTO> {
        return makeTransactional(() => DataDataAccessService.deleteDataCTO(dataCTO));
    },

    // ========================================= RELATION =========================================

    deleteDataRelation(dataRelationCTO: DataRelationTO): DataAccessResponse<DataRelationTO> {
        return makeTransactional(() => DataDataAccessService.deleteDataRelationCTO(dataRelationCTO));
    },

    findAllDataRelations(): DataAccessResponse<DataRelationTO[]> {
        return makeTransactional(DataDataAccessService.findAllDataRelationTOs);
    },

    saveDataRelationCTO(dataRelation: DataRelationTO): DataAccessResponse<DataRelationTO> {
        return makeTransactional(() => DataDataAccessService.saveDataRelation(dataRelation));
    },

    // ========================================= GROUP =========================================

    findAllGroups(): DataAccessResponse<GroupTO[]> {
        return makeTransactional(ActorDataAccessService.findAllGroups);
    },

    saveGroup(group: GroupTO): DataAccessResponse<GroupTO> {
        return makeTransactional(() => ActorDataAccessService.saveGroup(group));
    },

    deleteGroupTO(group: GroupTO): DataAccessResponse<GroupTO> {
        return makeTransactional(() => ActorDataAccessService.deleteGroup(group));
    },

    // ========================================= ACTION =========================================

    deleteActionTO(action: ActionTO): DataAccessResponse<ActionTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteAction(action));
    },

    saveActionTO(action: ActionTO): DataAccessResponse<ActionTO> {
        return makeTransactional(() => SequenceDataAccessService.saveActionTO(action));
    },

    // ========================================= DECISION =========================================

    saveDecision(decision: DecisionTO): DataAccessResponse<DecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.saveDecision(decision));
    },

    deleteDecision(decision: DecisionTO): DataAccessResponse<DecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteDecision(decision));
    },

    findDecision(id: number): DataAccessResponse<DecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.findDecision(id));
    },

    // ========================================= CHAIN =========================================

    findAllChains(): DataAccessResponse<ChainTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChains);
    },

    getChainCTO(chain: ChainTO): DataAccessResponse<ChainCTO> {
        return makeTransactional(() => SequenceDataAccessService.getChainCTO(chain));
    },

    saveChainTO(chain: ChainTO): DataAccessResponse<ChainTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainTO(chain));
    },

    deleteChain(chain: ChainTO): DataAccessResponse<ChainTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteChain(chain));
    },

    saveChainlink(link: ChainlinkTO): DataAccessResponse<ChainlinkTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainlink(link));
    },

    findAllChainLinks(): DataAccessResponse<ChainlinkTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChainLinks);
    },

    deleteChainLink(step: ChainlinkTO): DataAccessResponse<ChainlinkTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteChainTO(step));
    },

    saveChainDecision(decision: ChainDecisionTO): DataAccessResponse<ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainDecision(decision));
    },

    findAllChainDecisions(): DataAccessResponse<ChainDecisionTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChainDecisions);
    },

    deleteChaindecision(decision: ChainDecisionTO): DataAccessResponse<ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteChainDecision(decision));
    },

    setChainRoot(chainId: number, id: number, isDecision: boolean): DataAccessResponse<ChainlinkTO | ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.setChainRoot(chainId, id, isDecision));
    },

    findChainDecision(id: number): DataAccessResponse<ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainDecision(id));
    },

    findChainLink(id: number): DataAccessResponse<ChainlinkTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainLink(id));
    },
};

// ========================================= PRIVATE =========================================

function makeTransactional<T>(callback: () => T): DataAccessResponse<T> {
    const response: DataAccessResponse<T> = {
        object: {} as T,
        message: "",
        code: 500,
    };
    try {
        const object = callback();
        response.object = typeof object === "undefined" ? undefined : JSON.parse(JSON.stringify(object));
        response.code = 200;
        dataStore.commitChanges();
    } catch (error) {
        console.warn(error);
        response.message = error.message;
        dataStore.roleBack();
    }
    return response;
}
