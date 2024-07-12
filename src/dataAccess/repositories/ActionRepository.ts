import { ActionTO } from "../access/to/ActionTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ActionRepository = {
    find(actionId: number): ActionTO | undefined {
        return dataStore.getDataStore().actions.get(actionId);
    },

    findAll(): ActionTO[] {
        return Array.from(dataStore.getDataStore().actions.values());
    },

    findAllForStep(stepId: number): ActionTO[] {
        return this.findAll().filter((action) => action.sequenceStepFk === stepId);
    },

    save(action: ActionTO): ActionTO {
        CheckHelper.nullCheck(action, "actorData");
        let actionTO: ActionTO;
        if (action.id === -1) {
            actionTO = {
                ...action,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            actionTO = {...action};
        }
        dataStore.getDataStore().actions.set(actionTO.id, actionTO);
        return actionTO;
    },

    delete(id: number) {
        const sucess: boolean = dataStore.getDataStore().actions.delete(id);
        if (!sucess) {
            throw Error("could not delete action with id: " + id);
        }
    },
};
