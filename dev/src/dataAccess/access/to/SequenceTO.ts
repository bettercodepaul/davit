import { AbstractTO } from "./AbstractTO";

export class SequenceTO extends AbstractTO {
    constructor(public name: string = "", public note: string = "") {
        super();
    }
}
