import { DataRelationTO } from "../access/to/DataRelationTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataConnectionRepository = {
    find(dataConnectionId: number): DataRelationTO | undefined {
        return dataStore.getDataStore().dataConnections.get(dataConnectionId);
    },
    findAll(): DataRelationTO[] {
        return Array.from(dataStore.getDataStore().dataConnections.values());
    },
    save(dataRelation: DataRelationTO) {
        CheckHelper.nullCheck(dataRelation, "dataConnection");
        let dataRelationTO: DataRelationTO;
        if (dataRelation.id === -1) {
            dataRelationTO = {
                ...dataRelation,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
            console.info("set new actor id: " + dataRelationTO.id);
        } else {
            dataRelationTO = {...dataRelation};
        }
        dataStore.getDataStore().dataConnections.set(dataRelationTO.id!, dataRelationTO);
        return dataRelationTO;
    },

    delete(dataRelation: DataRelationTO) {
        CheckHelper.nullCheck(dataRelation, "dataRelationTO");
        const success = dataStore.getDataStore().dataConnections.delete(dataRelation.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return dataRelation;
    },
};
