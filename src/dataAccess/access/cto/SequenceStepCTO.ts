import { ActionTO } from "../to/ActionTO";
import { SequenceStepTO } from "../to/SequenceStepTO";

export class SequenceStepCTO {
    constructor(public sequenceStepTO: SequenceStepTO = new SequenceStepTO(), public actions: ActionTO[] = []) {
    }
}
