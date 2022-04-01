import { ChainLinkTO } from "../access/to/ChainlinkTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainLinkRepository = {
    find(id: number): ChainLinkTO | undefined {
        return dataStore.getDataStore().chainLinks.get(id);
    },

    findAll(): ChainLinkTO[] {
        return Array.from(dataStore.getDataStore().chainLinks.values());
    },

    findAllForChain(id: number): ChainLinkTO[] {
        const all: ChainLinkTO[] = this.findAll();
        return all.filter((link) => link.chainFk === id);
    },

    delete(step: ChainLinkTO) {
        // ConstraintsHelper.deleteStepConstraintCheck(step.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().chainLinks.delete(step.id);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return step;
    },

    save(chainLink: ChainLinkTO): ChainLinkTO {
        CheckHelper.nullCheck(chainLink, "chainlink");
        let chainlinkTO: ChainLinkTO;
        if (chainLink.id === -1) {
            chainlinkTO = {
                ...chainLink,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            chainlinkTO = {...chainLink};
        }
        dataStore.getDataStore().chainLinks.set(chainlinkTO.id!, chainlinkTO);
        return chainlinkTO;
    },
};
