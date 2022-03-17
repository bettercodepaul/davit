import { AbstractTO } from "./AbstractTO";

export class StateTO extends AbstractTO {
    constructor(public label: string = "",
                public isState: boolean = true,) {
        super();
    }
}
