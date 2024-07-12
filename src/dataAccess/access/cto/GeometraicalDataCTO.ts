import { GeometricalDataTO } from "../to/GeometricalDataTO";
import { PositionTO } from "../to/PositionTO";

export class GeometricalDataCTO {
    constructor(
        public position: PositionTO = new PositionTO(),
        public geometricalData: GeometricalDataTO = new GeometricalDataTO(),
    ) {
    }
}
