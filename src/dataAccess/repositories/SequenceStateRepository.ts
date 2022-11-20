import { SequenceStateTO } from "../access/to/SequenceStateTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceStateRepository = {
    findAll(): SequenceStateTO[] {
        return Array.from(dataStore.getDataStore().sequenceStates.values());
    },

    findAllForSequence(sequenceId: number): SequenceStateTO[] {
        return this.findAll().filter(state => state.sequenceFk === sequenceId);
    },

    find(id: number): SequenceStateTO | undefined {
        return dataStore.getDataStore().sequenceStates.get(id);
    },

    save(sequenceState: SequenceStateTO): SequenceStateTO {
        CheckHelper.nullCheck(sequenceState, "sequenceState");
        let sequenceStateId: number = sequenceState.id;

        sequenceStateId = DataAccessUtil.getOrCreateId(sequenceStateId, this.findAll());

        const sequenceStateTOtoSave: SequenceStateTO = {
            ...sequenceState,
            id: sequenceStateId,
        };

        dataStore.getDataStore().sequenceStates.set(sequenceStateId, sequenceStateTOtoSave);

        return sequenceStateTOtoSave;
    },

    delete(sequenceMock: SequenceStateTO): SequenceStateTO {
        ConstraintsHelper.deleteSequenceStateConstraintCheck(sequenceMock.id, dataStore.getDataStore());

        const success = dataStore.getDataStore().sequenceStates.delete(sequenceMock.id);

        if (!success) {
            throw new Error(`Try to delete Sequence state: Sequence state with ID: ${sequenceMock.id} dos not exists in data store!`);
        }

        return sequenceMock;
    }
};
