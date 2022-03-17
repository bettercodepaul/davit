import { DataSetupTO } from "../access/to/DataSetupTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataSetupRepository = {
    find(dataSetupId: number): DataSetupTO | undefined {
        return dataStore.getDataStore().dataSetups.get(dataSetupId);
    },
    findAll(): DataSetupTO[] {
        return Array.from(dataStore.getDataStore().dataSetups.values());
    },

    save(dataSetup: DataSetupTO) {
        CheckHelper.nullCheck(dataSetup, "dataSetup");
        let dataSetupTO: DataSetupTO;
        if (dataSetup.id === -1) {
            dataSetupTO = {
                ...dataSetup,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            dataSetupTO = {...dataSetup};
        }
        dataStore.getDataStore().dataSetups.set(dataSetupTO.id!, dataSetupTO);
        return dataSetupTO;
    },

    delete(dataSetup: DataSetupTO): DataSetupTO {
        // TODO: add constraint helper.
        const success = dataStore.getDataStore().dataSetups.delete(dataSetup.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return dataSetup;
    },
};
