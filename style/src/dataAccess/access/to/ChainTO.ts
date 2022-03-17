import { AbstractTO } from "./AbstractTO";

export class ChainTO extends AbstractTO {
    constructor(public name: string = "", public note: string = "",) {
        super();
    }
}
