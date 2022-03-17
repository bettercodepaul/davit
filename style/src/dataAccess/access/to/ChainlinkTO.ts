import { GoToChain, GoToTypesChain } from "../types/GoToTypeChain";
import { AbstractTO } from "./AbstractTO";

export class ChainlinkTO extends AbstractTO {
    constructor(
        public name: string = "",
        public sequenceFk: number = -1,
        public dataSetupFk: number = -1,
        public goto: GoToChain = {type: GoToTypesChain.ERROR},
        public root: boolean = false,
        public chainFk: number = -1,
    ) {
        super();
    }
}
