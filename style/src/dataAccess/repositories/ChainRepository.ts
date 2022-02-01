import { ChainTO } from "../access/to/ChainTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainRepository = {
    find(id: number): ChainTO | undefined {
        return dataStore.getDataStore().chains.get(id);
    },

    findAll(): ChainTO[] {
        return Array.from(dataStore.getDataStore().chains.values());
    },

    saveTO(chain: ChainTO): ChainTO {
        CheckHelper.nullCheck(chain, "chain");
        let chainTO: ChainTO;
        if (chain.id === -1) {
            chainTO = {
                ...chain,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            chainTO = {...chain};
        }
        dataStore.getDataStore().chains.set(chainTO.id!, chainTO);
        return chainTO;
    },

    delete(chain: ChainTO): ChainTO {
        // ConstraintsHelper.deleteSequenceConstraintCheck(chain.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().chains.delete(chain.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return chain;
    },
};
