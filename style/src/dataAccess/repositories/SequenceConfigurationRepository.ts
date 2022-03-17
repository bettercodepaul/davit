import { SequenceConfigurationTO } from "../access/to/SequenceConfigurationTO";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceConfigurationRepository = {
    find(sequenceConfigurationFk: number): SequenceConfigurationTO | undefined {
        return dataStore.getDataStore().sequenceConfigurations.get(sequenceConfigurationFk);
    },

    findAll(): SequenceConfigurationTO[] {
        return Array.from(dataStore.getDataStore().sequenceConfigurations.values());
    },

    save(sequenceConfiguration: SequenceConfigurationTO) {
        CheckHelper.nullCheck(sequenceConfiguration, "sequenceConfiguration");
        let sequenceConfigurationTO: SequenceConfigurationTO;
        if (sequenceConfiguration.id === -1) {
            sequenceConfigurationTO = {
                ...sequenceConfiguration,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            sequenceConfigurationTO = {...sequenceConfiguration};
        }
        dataStore.getDataStore().sequenceConfigurations.set(sequenceConfigurationTO.id!, sequenceConfigurationTO);
        return sequenceConfigurationTO;
    },

    delete(sequenceConfigurationTO: SequenceConfigurationTO): SequenceConfigurationTO {
        // TODO: add constraint helper.
        const success = dataStore.getDataStore().sequenceConfigurations.delete(sequenceConfigurationTO.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return sequenceConfigurationTO;
    },
};
