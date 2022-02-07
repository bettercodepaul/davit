import { DesignTO } from "../access/to/DesignTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DesignRepository = {
    find(id: number): DesignTO | undefined {
        return dataStore.getDataStore().designs.get(id);
    },

    findAll(): DesignTO[] {
        return Array.from(dataStore.getDataStore().designs.values());
    },

    delete(design: DesignTO): DesignTO {
        ConstraintsHelper.deleteDesignConstraintCheck(design.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().designs.delete(design.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return design;
    },

    save(design: DesignTO): DesignTO {
        let designTO: DesignTO;
        if (design.id === -1) {
            designTO = {
                ...design,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            designTO = {...design};
        }
        dataStore.getDataStore().designs.set(designTO.id!, designTO);
        return designTO;
    },
};
