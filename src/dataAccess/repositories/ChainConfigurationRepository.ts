import { ChainConfigurationTO } from "../access/to/ChainConfigurationTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const ChainConfigurationRepository = {
    find(chainFk: number): ChainConfigurationTO | undefined {
        return dataStore.getDataStore().chainConfigurations.get(chainFk);
    },

    findAll(): ChainConfigurationTO[] {
        return Array.from(dataStore.getDataStore().chainConfigurations.values());
    },

    save(chainConfiguration: ChainConfigurationTO) {
        CheckHelper.nullCheck(chainConfiguration, "ChainConfiguration");
        let chainConfigurationTO: ChainConfigurationTO;
        if (chainConfiguration.id === -1) {
            chainConfigurationTO = {
                ...chainConfiguration,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            chainConfigurationTO = {...chainConfiguration};
        }
        dataStore.getDataStore().chainConfigurations.set(chainConfigurationTO.id!, chainConfigurationTO);
        return chainConfigurationTO;
    },

    delete(chainConfiguration: ChainConfigurationTO): ChainConfigurationTO {
        // TODO: add constraint helper.
        const success = dataStore.getDataStore().chainConfigurations.delete(chainConfiguration.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return chainConfiguration;
    },
};
