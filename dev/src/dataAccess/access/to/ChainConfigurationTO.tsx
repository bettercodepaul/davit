import { AbstractTO } from "./AbstractTO";
import { InitDataTO } from "./InitDataTO";

export interface ChainStateValue{
    chainStateFk: number;
    value: boolean
}

export class ChainConfigurationTO extends AbstractTO{
    public constructor(
        public name: string = "",
        public note: string = "",
        public chainFk: number = -1,
        public initDatas: InitDataTO[] = [],
        public stateValues: ChainStateValue[] = [],
    ) {
        super();
        }

}