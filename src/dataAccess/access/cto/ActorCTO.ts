import { ActorTO } from "../to/ActorTO";
import { DesignTO } from "../to/DesignTO";
import { GeometricalDataCTO } from "./GeometraicalDataCTO";

export class ActorCTO {
    constructor(
        public actor: ActorTO = new ActorTO(),
        public geometricalData: GeometricalDataCTO = new GeometricalDataCTO(),
        public design: DesignTO = new DesignTO(),
    ) {
    }
}
