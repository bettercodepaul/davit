import { GeometricalDataTO } from "../access/to/GeometricalDataTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const GeometricalDataRepository = {
    find(id: number): GeometricalDataTO | undefined {
        return dataStore.getDataStore().geometricalDatas.get(id);
    },

    findAll(): GeometricalDataTO[] {
        return Array.from(dataStore.getDataStore().geometricalDatas.values());
    },

    delete(geometricalData: GeometricalDataTO): boolean {
        ConstraintsHelper.deleteGeometricalDataConstraintCheck(geometricalData.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().geometricalDatas.delete(geometricalData.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return success;
    },

    save(geometricalData: GeometricalDataTO): GeometricalDataTO {
        let geometricalDataTO: GeometricalDataTO;
        if (geometricalData.id === -1) {
            geometricalDataTO = {
                ...geometricalData,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            geometricalDataTO = {...geometricalData};
        }
        dataStore.getDataStore().geometricalDatas.set(geometricalDataTO.id!, geometricalDataTO);
        return geometricalDataTO;
    },
};
