import { AbstractTO } from "./AbstractTO";
import { InitDataTO } from "./InitDataTO";

export interface SequenceStateValue{
    sequenceStateFk: number;
    value: boolean;
}

export class SequenceConfigurationTO extends AbstractTO {
    constructor(
        public name = "",
        public note: string = "",
        public sequenceFk: number = -1,
        public initDatas: InitDataTO[] = [],
        public stateValues: SequenceStateValue[] = [],
        ) {
        super();
    }
}
