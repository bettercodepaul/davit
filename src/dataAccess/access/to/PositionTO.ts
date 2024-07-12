import { AbstractTO } from "./AbstractTO";

export class PositionTO extends AbstractTO {
    constructor(public x: number = 10, public y: number = 10) {
        super();
    }
}
