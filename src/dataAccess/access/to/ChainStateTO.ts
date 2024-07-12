import { StateTO } from "./StateTO";

export class ChainStateTO extends StateTO {
    constructor(
        public chainFk: number = -1,
    ) {
        super();
    }
}
