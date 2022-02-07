import { AbstractTO } from "../../../access/to/AbstractTO";
import { DataInstanceTO01 } from "./DataInstanceTO01";

export class DataTO01 extends AbstractTO {
    constructor(
        public name: string = "",
        public geometricalDataFk: number = -1,
        public dataConnectionFks: number[] = [],
        public instances: DataInstanceTO01[] = [{id: -1, name: "default", defaultInstance: true}],
    ) {
        super();
    }
}
