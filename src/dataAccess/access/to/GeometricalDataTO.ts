import { AbstractTO } from "./AbstractTO";

export class GeometricalDataTO extends AbstractTO {
    constructor(public width: number = 100, public height: number = 30, public positionFk: number = -1) {
        super();
    }
}
