import { DavitUtil } from "../../utils/DavitUtil";
import { DecisionTO } from "../access/to/DecisionTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DecisionRepository = {
    find(id: number): DecisionTO | undefined {
        return dataStore.getDataStore().decisions.get(id);
    },

    findAll(): DecisionTO[] {
        return Array.from(dataStore.getDataStore().decisions.values());
    },

    findAllForSequence(id: number): DecisionTO[] {
        return this.findAll().filter((cond) => cond.sequenceFk === id);
    },

    save(decision: DecisionTO): DecisionTO {
        CheckHelper.nullCheck(decision, "decision");
        let decisionTO: DecisionTO;

        // Give condition a UID.
        const copyDecisionToSave: DecisionTO = DavitUtil.deepCopy(decision);
        copyDecisionToSave.conditions.map((condition) => {
            if (condition.id === -1) {
                condition.id = DataAccessUtil.determineNewId(decision.conditions);
            }
            return condition;
        });

        if (copyDecisionToSave.id === -1) {
            decisionTO = {
                ...copyDecisionToSave,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            decisionTO = {...copyDecisionToSave};
        }
        dataStore.getDataStore().decisions.set(decisionTO.id, decisionTO);
        return decisionTO;
    },

    delete(decision: DecisionTO) {
        const success: boolean = dataStore.getDataStore().decisions.delete(decision.id);
        if (!success) {
            throw Error("could not delete decision with id: " + decision.id);
        } else {
            return decision;
        }
    },
};
