import { AbstractTO } from "./AbstractTO";

export class ConditionTO extends AbstractTO {
    constructor(
        public decisionFk: number = -1,
        public actorFk: number = -1,
        public dataFk: number = -1,
        public instanceFk: number = -1,
    ) {
        super();
    }
}
