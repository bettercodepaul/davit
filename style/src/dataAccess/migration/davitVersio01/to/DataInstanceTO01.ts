import { AbstractTO } from "../../../access/to/AbstractTO";

export class DataInstanceTO01 extends AbstractTO {
    constructor(public name: string = "", public defaultInstance: boolean = true) {
        super();
    }
}
