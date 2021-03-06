import { GoToChain, GoToTypesChain } from "../types/GoToTypeChain";
import { AbstractTO } from "./AbstractTO";
import { ConditionTO } from "./ConditionTO";

export class ChainDecisionTO extends AbstractTO {
    constructor(
        public name: string = "",
        public chainFk: number = -1,
        public conditions: ConditionTO[] = [],
        public ifGoTo: GoToChain = {type: GoToTypesChain.FIN},
        public elseGoTo: GoToChain = {type: GoToTypesChain.ERROR},
    ) {
        super();
    }
}
