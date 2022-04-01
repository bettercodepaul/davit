import { ChainDecisionTO } from "../to/ChainDecisionTO";
import { ChainStateTO } from "../to/ChainStateTO";
import { ChainTO } from "../to/ChainTO";
import { ChainLinkCTO } from "./ChainlinkCTO";

export class ChainCTO {
    constructor(
        public chain: ChainTO = new ChainTO(),
        public links: ChainLinkCTO[] = [],
        public decisions: ChainDecisionTO[] = [],
        public chainStates: ChainStateTO[] = [],
    ) {
    }
}
