import { AbstractTO } from "../../../access/to/AbstractTO";
import { ActionType } from "../../../access/types/ActionType";

export class ActionTO01 extends AbstractTO {
    constructor(
        public sequenceStepFk = -1,
        public receivingActorFk = -1,
        public sendingActorFk = -1,
        public dataFk = -1,
        public instanceFk = -1,
        public actionType = ActionType.ADD,
    ) {
        super();
    }
}
