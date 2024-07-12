import { SequenceTO } from "../access/to/SequenceTO";
import { ConstraintsHelper } from "../ConstraintsHelper";
import dataStore from "../DataStore";
import { CheckHelper } from "../util/CheckHelper";
import { DataAccessUtil } from "../util/DataAccessUtil";

export const SequenceRepository = {
    find(sequenceId: number): SequenceTO | undefined {
        return dataStore.getDataStore().sequences.get(sequenceId);
    },

    findAll(): SequenceTO[] {
        return Array.from(dataStore.getDataStore().sequences.values());
    },

    save(sequence: SequenceTO): SequenceTO {
        CheckHelper.nullCheck(sequence, "sequence");
        let sequenceTO: SequenceTO;
        if (sequence.id === -1) {
            sequenceTO = {
                ...sequence,
                id: DataAccessUtil.determineNewId(this.findAll()),
            };
        } else {
            sequenceTO = {...sequence};
        }
        dataStore.getDataStore().sequences.set(sequenceTO.id!, sequenceTO);
        return sequenceTO;
    },

    delete(sequence: SequenceTO): SequenceTO {
        ConstraintsHelper.deleteSequenceConstraintCheck(sequence.id, dataStore.getDataStore());
        const success = dataStore.getDataStore().sequences.delete(sequence.id!);
        if (!success) {
            throw new Error("dataAccess.repository.error.notExists");
        }
        return sequence;
    },
};
