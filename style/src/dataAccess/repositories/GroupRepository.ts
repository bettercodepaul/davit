import { GroupTO } from "../access/to/GroupTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const GroupRepository = {
    find(id: number): GroupTO | undefined {
        return dataStore.getDataStore().groups.get(id);
    },

    findAll(): GroupTO[] {
        return Array.from(dataStore.getDataStore().groups.values());
    },

    delete(group: GroupTO): GroupTO {
        ConstraintsHelper.deleteGroupConstraintCheck(group.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().groups.delete(group.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return group;
    },

    save(group: GroupTO): GroupTO {
        CheckHelper.nullCheck(group, "actor");
        let groupTO: GroupTO;
        if (group.id === -1) {
            groupTO = {
                ...group,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
            console.info("set new actor id: " + groupTO.id);
        } else {
            groupTO = {...group};
        }
        dataStore.getDataStore().groups.set(groupTO.id!, groupTO);
        return groupTO;
    },
};
