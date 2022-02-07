import { DataAndInstanceId } from "../../../../components/atomic/dropdowns/InstanceDropDown";
import { AbstractTO } from "../../../access/to/AbstractTO";
import { GoToChain, GoToTypesChain } from "../../../access/types/GoToTypeChain";

export class ChainDecisionTO01 extends AbstractTO {
    constructor(
        public name: string = "",
        public chainFk: number = -1,
        public actorFk: number = -1,
        public dataAndInstaceIds: DataAndInstanceId[] = [],
        public ifGoTo: GoToChain = {type: GoToTypesChain.FIN},
        public elseGoTo: GoToChain = {type: GoToTypesChain.ERROR},
    ) {
        super();
    }
}
