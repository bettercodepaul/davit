import { DavitUtil } from "../../utils/DavitUtil";
import { DataStoreCTO } from "../access/cto/DataStoreCTO";
import { DataInstanceTO } from "../access/to/DataInstanceTO";
import { DataTO } from "../access/to/DataTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const DataRepository = {
    find(dataId: number): DataTO | undefined {
        return dataStore.getDataStore().datas.get(dataId);
    },

    findAll(): DataTO[] {
        return Array.from(dataStore.getDataStore().datas.values());
    },

    save(data: DataTO) {
        CheckHelper.nullCheck(data, "data");

        if (data.instances.length <= 0) {
            throw new Error(`dataTO with id: ${data.id} has no instances!`);
        }

        checkDeleteInstancesConstraint(data, this.findAll(), dataStore.getDataStore());

        let dataTO: DataTO = {...data};

        dataTO = checkOrsetNewDataId(this.findAll(), dataTO);
        dataTO.instances = data.instances.map((instance) => checkOrSetNewInstanceId(data.instances, instance));

        dataStore.getDataStore().datas.set(dataTO.id!, dataTO);
        return dataTO;
    },

    delete(dataTO: DataTO): DataTO {
        ConstraintsHelper.deleteDataConstraintCheck(dataTO.id, dataStore.getDataStore());
        dataTO.instances.forEach((instance) =>
            ConstraintsHelper.deleteDataInstanceConstraintCheck(dataTO.id, instance.id, dataStore.getDataStore()),
        );
        const success = dataStore.getDataStore().datas.delete(dataTO.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return dataTO;
    },
};

const checkOrSetNewInstanceId = (instances: DataInstanceTO[], instance: DataInstanceTO): DataInstanceTO => {
    const copyInstance: DataInstanceTO = DavitUtil.deepCopy(instance);
    if (instance.id === -1) {
        copyInstance.id = DataAccessUtil.determineNewId(instances);
    }
    return copyInstance;
};

const checkOrsetNewDataId = (dataTOs: DataTO[], dataTO: DataTO): DataTO => {
    const copyDataTO: DataTO = DavitUtil.deepCopy(dataTO);
    if (copyDataTO.id === -1) {
        copyDataTO.id = DataAccessUtil.determineNewId(dataTOs);
    }
    return copyDataTO;
};

const checkDeleteInstancesConstraint = (data: DataTO, datas: DataTO[], dataStore: DataStoreCTO) => {
    if (data.id !== -1) {
        const originalData: DataTO | undefined = datas.find((dt) => dt.id === data.id);
        if (originalData) {
            const deletedInstances: DataInstanceTO[] = originalData.instances.filter(
                (instance) => !data.instances.some((inst) => inst.id === instance.id),
            );
            deletedInstances.forEach((instance) =>
                ConstraintsHelper.deleteDataInstanceConstraintCheck(data.id, instance.id, dataStore),
            );
        }
    }
};
