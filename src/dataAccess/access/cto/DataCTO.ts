import { DataTO } from "../to/DataTO";
import { GeometricalDataCTO } from "./GeometraicalDataCTO";

export class DataCTO {
    constructor(
        public data: DataTO = new DataTO(),
        public geometricalData: GeometricalDataCTO = new GeometricalDataCTO(),
    ) {
    }
}
