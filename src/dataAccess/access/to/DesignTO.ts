import { AbstractTO } from "./AbstractTO";

export class DesignTO extends AbstractTO {
    constructor(public color: string = "#3498db") {
        super();
    }
}
