import { AbstractTO } from "./AbstractTO";

export enum Direction {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
    TOP = "TOP",
    BOTTOM = "BOTTOM",
}

export enum RelationType {
    IN = "IN",
    OUT = "OUT",
}

export class DataRelationTO extends AbstractTO {
    constructor(
        public data1Fk: number = -1,
        public data2Fk: number = -1,
        public label1: string = "",
        public label2: string = "",
        public direction1: Direction = Direction.RIGHT,
        public direction2: Direction = Direction.LEFT,
        public type1: RelationType = RelationType.OUT,
        public type2: RelationType = RelationType.IN,
        public note: string = "",
    ) {
        super();
    }
}
