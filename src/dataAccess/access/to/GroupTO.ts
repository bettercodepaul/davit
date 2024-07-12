import { AbstractTO } from "./AbstractTO";

export class GroupTO extends AbstractTO {
    constructor(public name: string = "", public color: string = "red") {
        super();
    }
}
