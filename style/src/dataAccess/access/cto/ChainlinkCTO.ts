import { ChainLinkTO } from "../to/ChainlinkTO";
import { SequenceConfigurationTO } from "../to/SequenceConfigurationTO";
import { SequenceCTO } from "./SequenceCTO";

export class ChainLinkCTO {
    constructor(
        public chainLink: ChainLinkTO = new ChainLinkTO(),
        public sequence: SequenceCTO = new SequenceCTO(),
        public sequenceConfiguration: SequenceConfigurationTO = new SequenceConfigurationTO(),
    ) {
    }
}
