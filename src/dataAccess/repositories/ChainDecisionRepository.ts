import { ChainDecisionTO } from "../access/to/ChainDecisionTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainDecisionRepository = {
    find(id: number): ChainDecisionTO | undefined {
        return dataStore.getDataStore().chainDecisions.get(id);
    },

    findAll(): ChainDecisionTO[] {
        return Array.from(dataStore.getDataStore().chainDecisions.values());
    },

    findAllForChain(id: number): ChainDecisionTO[] {
        const all: ChainDecisionTO[] = this.findAll();
        return all.filter((dec) => dec.chainFk === id);
    },

    delete(decision: ChainDecisionTO) {
        const success = dataStore.getDataStore().chainDecisions.delete(decision.id);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return decision;
    },

    save(decision: ChainDecisionTO): ChainDecisionTO {
        CheckHelper.nullCheck(decision, "decision");
        let chainDecisionTO: ChainDecisionTO;
        if (decision.id === -1) {
            chainDecisionTO = {
                ...decision,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            chainDecisionTO = {...decision};
        }
        dataStore.getDataStore().chainDecisions.set(chainDecisionTO.id!, chainDecisionTO);
        return chainDecisionTO;
    },
};
