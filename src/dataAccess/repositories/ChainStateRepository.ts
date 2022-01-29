import { ChainStateTO } from "../access/to/ChainStateTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainStateRepository = {
    findAll(): ChainStateTO[] {
        return Array.from(dataStore.getDataStore().chainStates.values());
    },

    findAllByChainId(chainId: number): ChainStateTO[] {
        return this.findAll().filter(state => state.chainFk === chainId);
    },

    find(id: number): ChainStateTO | undefined {
        return dataStore.getDataStore().chainStates.get(id);
    },

    save(chainState: ChainStateTO): ChainStateTO {
        CheckHelper.nullCheck(chainState, "chainState");
        let chainStateToSave: ChainStateTO;
        let chainMockId: number = chainState.id;

        chainMockId = DataAccessUtil.getOrCreateId(chainMockId, this.findAll());

        chainStateToSave = {
            ...chainState,
            id: chainMockId,
        };

        dataStore.getDataStore().chainStates.set(chainMockId, chainStateToSave);

        return chainStateToSave;
    },

    delete(chainState: ChainStateTO): ChainStateTO {
        ConstraintsHelper.deleteChainStateConstraintCheck(chainState.id, dataStore.getDataStore());

        const success = dataStore.getDataStore().chainStates.delete(chainState.id);

        if (!success) {
            throw new Error(`Try to delete chain state: Chain state with ID: ${chainState.id} dos not exists in data store!`);
        }

        return chainState;
    }
};
