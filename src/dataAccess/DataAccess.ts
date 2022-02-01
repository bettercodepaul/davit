import { ActorCTO } from "./access/cto/ActorCTO";
import { ChainCTO } from "./access/cto/ChainCTO";
import { DataCTO } from "./access/cto/DataCTO";
import { SequenceCTO } from "./access/cto/SequenceCTO";
import { SequenceStepCTO } from "./access/cto/SequenceStepCTO";
import { ActionTO } from "./access/to/ActionTO";
import { ChainConfigurationTO } from "./access/to/ChainConfigurationTO";
import { ChainDecisionTO } from "./access/to/ChainDecisionTO";
import { ChainLinkTO } from "./access/to/ChainlinkTO";
import { ChainStateTO } from "./access/to/ChainStateTO";
import { ChainTO } from "./access/to/ChainTO";
import { DataRelationTO } from "./access/to/DataRelationTO";
import { DecisionTO } from "./access/to/DecisionTO";
import { GroupTO } from "./access/to/GroupTO";
import { SequenceConfigurationTO } from "./access/to/SequenceConfigurationTO";
import { SequenceStateTO } from "./access/to/SequenceStateTO";
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

    // ========================================= SEQUENCE CONFIGURATION =========================================

    findAllSequenceConfigurations(): DataAccessResponse<SequenceConfigurationTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllSequenceConfigurations);
    },

    findSequenceConfiguration(sequenceConfigurationFk: number): DataAccessResponse<SequenceConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.findSequenceConfigurationTO(sequenceConfigurationFk));
    },

    deleteSequenceConfiguration(sequenceConfiguration: SequenceConfigurationTO): DataAccessResponse<SequenceConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteSequenceConfiguration(sequenceConfiguration));
    },

    saveSequenceConfigurationTO(sequenceConfigurationTO: SequenceConfigurationTO): DataAccessResponse<SequenceConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.saveSequenceConfigurationTO(sequenceConfigurationTO));
    },

    // ========================================= CHAIN CONFIGURATION =========================================

    findAllChainConfigurations(): DataAccessResponse<ChainConfigurationTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChainConfigurations);
    },

    findChainConfiguration(chainFk: number): DataAccessResponse<ChainConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainConfigurationTO(chainFk));
    },

    deleteChainConfiguration(chainConfiguration: ChainConfigurationTO): DataAccessResponse<ChainConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteChainConfiguration(chainConfiguration));
    },

    saveChainConfigurationTO(chainConfiguration: ChainConfigurationTO): DataAccessResponse<ChainConfigurationTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainConfigurationTO(chainConfiguration));
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

    saveChainlink(link: ChainLinkTO): DataAccessResponse<ChainLinkTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainLink(link));
    },

    findAllChainLinks(): DataAccessResponse<ChainLinkTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChainLinks);
    },

    deleteChainLink(step: ChainLinkTO): DataAccessResponse<ChainLinkTO> {
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

    setChainRoot(chainId: number, id: number, isDecision: boolean): DataAccessResponse<ChainLinkTO | ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.setChainRoot(chainId, id, isDecision));
    },

    findChainDecision(id: number): DataAccessResponse<ChainDecisionTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainDecision(id));
    },

    findChainLink(id: number): DataAccessResponse<ChainLinkTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainLink(id));
    },

    // ========================================= Sequence State =========================================

    findAllSequenceStates(): DataAccessResponse<SequenceStateTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllSequenceStates);
    },

    findAllSequenceStatesBySequenceFk(sequenceFk: number): DataAccessResponse<SequenceStateTO[]> {
        return makeTransactional(() => SequenceDataAccessService.findAllSequenceStatesBySequenceFk(sequenceFk));
    },

    findSequenceState(id: number): DataAccessResponse<SequenceStateTO> {
        return makeTransactional(() => SequenceDataAccessService.findSequenceState(id));
    },

    saveSequenceState(sequenceState: SequenceStateTO): DataAccessResponse<SequenceStateTO> {
        return makeTransactional(() => SequenceDataAccessService.saveSequenceState(sequenceState));
    },

    deleteSequenceState(sequenceStateId: number): DataAccessResponse<SequenceStateTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteSequenceState(sequenceStateId));
    },

    // ========================================= Chain State =========================================

    findAllChainStates(): DataAccessResponse<ChainStateTO[]> {
        return makeTransactional(SequenceDataAccessService.findAllChainStates);
    },

    findChainState(id: number): DataAccessResponse<ChainStateTO> {
        return makeTransactional(() => SequenceDataAccessService.findChainState(id));
    },

    saveChainState(chainState: ChainStateTO): DataAccessResponse<ChainStateTO> {
        return makeTransactional(() => SequenceDataAccessService.saveChainState(chainState));
    },

    deleteChainState(chainStateId: number): DataAccessResponse<ChainStateTO> {
        return makeTransactional(() => SequenceDataAccessService.deleteChainState(chainStateId));
    },

    findAllChainStatesByChainFk(chainFk: number): DataAccessResponse<ChainStateTO[]> {
        return makeTransactional(() => SequenceDataAccessService.findAllChainStatesByChainFk(chainFk));
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
