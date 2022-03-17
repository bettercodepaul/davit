import { ChainlinkTO } from "../access/to/ChainlinkTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainLinkRepository = {
    find(id: number): ChainlinkTO | undefined {
        return dataStore.getDataStore().chainlinks.get(id);
    },

    findAll(): ChainlinkTO[] {
        return Array.from(dataStore.getDataStore().chainlinks.values());
    },

    findAllForChain(id: number): ChainlinkTO[] {
        const all: ChainlinkTO[] = this.findAll();
        const filtered: ChainlinkTO[] = all.filter((link) => link.chainFk === id);
        return filtered;
    },

    delete(step: ChainlinkTO) {
        // ConstraintsHelper.deleteStepConstraintCheck(step.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().chainlinks.delete(step.id);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return step;
    },

    save(chainLink: ChainlinkTO): ChainlinkTO {
        CheckHelper.nullCheck(chainLink, "chainlink");
        let chainlinkTO: ChainlinkTO;
        if (chainLink.id === -1) {
            chainlinkTO = {
                ...chainLink,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            chainlinkTO = {...chainLink};
        }
        dataStore.getDataStore().chainlinks.set(chainlinkTO.id!, chainlinkTO);
        return chainlinkTO;
    },
};
