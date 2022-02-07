import { ChainlinkTO } from "../to/ChainlinkTO";
import { DataSetupCTO } from "./DataSetupCTO";
import { SequenceCTO } from "./SequenceCTO";

export class ChainlinkCTO {
    constructor(
        public chainLink: ChainlinkTO = new ChainlinkTO(),
        public sequence: SequenceCTO = new SequenceCTO(),
        public dataSetup: DataSetupCTO = new DataSetupCTO(),
    ) {
    }
}
