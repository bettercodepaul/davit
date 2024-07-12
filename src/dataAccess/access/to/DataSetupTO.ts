import { AbstractTO } from "./AbstractTO";

export class DataSetupTO extends AbstractTO {
    constructor(public name = "", public note: string = "") {
        super();
    }
}
