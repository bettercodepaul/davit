import { AbstractTO } from "./AbstractTO";

export class ActorTO extends AbstractTO {
    constructor(
        public name: string = "",
        public geometricalDataFk: number = -1,
        public designFk: number = -1,
        public groupFks: number = -1,
        public note: string = "",
    ) {
        super();
    }
}
