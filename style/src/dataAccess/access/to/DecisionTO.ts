import { GoTo, GoToTypes } from "../types/GoToType";
import { AbstractTO } from "./AbstractTO";
import { ConditionTO } from "./ConditionTO";

export interface StateFkAndStateCondition {
    stateFk: number,
    stateCondition: boolean,
}

export class DecisionTO extends AbstractTO {
    constructor(
        public name: string = "",
        public sequenceFk: number = -1,
        public conditions: ConditionTO[] = [],
        public stateFkAndStateConditions: StateFkAndStateCondition[] = [],
        public ifGoTo: GoTo = {type: GoToTypes.FIN},
        public elseGoTo: GoTo = {type: GoToTypes.ERROR},
        public root: boolean = false,
        public note: string = "",
    ) {
        super();
    }
}
