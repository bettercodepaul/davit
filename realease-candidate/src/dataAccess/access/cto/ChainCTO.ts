import { ChainDecisionTO } from "../to/ChainDecisionTO";
import { ChainTO } from "../to/ChainTO";
import { ChainlinkCTO } from "./ChainlinkCTO";

export class ChainCTO {
    constructor(
        public chain: ChainTO = new ChainTO(),
        public links: ChainlinkCTO[] = [],
        public decisions: ChainDecisionTO[] = [],
    ) {
    }
}
