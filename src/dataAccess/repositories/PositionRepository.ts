import { PositionTO } from "../access/to/PositionTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const PositionRepository = {
    find(id: number): PositionTO | undefined {
        return dataStore.getDataStore().positions.get(id);
    },

    findAll(): PositionTO[] {
        return Array.from(dataStore.getDataStore().positions.values());
    },

    delete(position: PositionTO): boolean {
        ConstraintsHelper.deletePositionConstraintCheck(position.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().positions.delete(position.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return success;
    },

    save(position: PositionTO): PositionTO {
        let positionTO: PositionTO;
        if (position.id === -1) {
            positionTO = {
                ...position,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            positionTO = {...position};
        }
        dataStore.getDataStore().positions.set(positionTO.id!, positionTO);
        return positionTO;
    },
};
