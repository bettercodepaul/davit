import { StateTO } from "./StateTO";

export class SequenceStateTO extends StateTO {
    constructor(
        public sequenceFk: number = -1,
    ) {
        super();
    }
}
