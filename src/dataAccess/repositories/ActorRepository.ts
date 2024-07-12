import { ActorTO } from "../access/to/ActorTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ActorRepository = {
    find(id: number): ActorTO | undefined {
        return dataStore.getDataStore().actors.get(id);
    },

    findAll(): ActorTO[] {
        return Array.from(dataStore.getDataStore().actors.values());
    },

    delete(actor: ActorTO): ActorTO {
        ConstraintsHelper.deleteActorConstraintCheck(actor.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().actors.delete(actor.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return actor;
    },

    save(actor: ActorTO): ActorTO {
        CheckHelper.nullCheck(actor, "actor");
        let actorTO: ActorTO;
        if (actor.id === -1) {
            actorTO = {
                ...actor,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            actorTO = {...actor};
        }
        dataStore.getDataStore().actors.set(actorTO.id!, actorTO);
        return actorTO;
    },
};
